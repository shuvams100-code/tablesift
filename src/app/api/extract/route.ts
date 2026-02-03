import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import mammoth from "mammoth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

// Model selection based on file complexity and user tier
type UserTier = "free" | "pro" | "business" | "enterprise";

interface ModelConfig {
    model: "gpt-4o-mini" | "gpt-4o";
    credits: number;
}

function getModelConfig(fileType: string, fileSize: number, pageCount: number, userTier: UserTier): ModelConfig {
    // Free tier always uses 4o-mini
    if (userTier === "free") {
        return { model: "gpt-4o-mini", credits: 1 };
    }

    // Word documents → GPT-4o (complex extraction needed)
    if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "application/msword") {
        return { model: "gpt-4o", credits: 3 };
    }

    // Large PDFs (10+ pages) → GPT-4o
    if (fileType === "application/pdf" && pageCount > 10) {
        return { model: "gpt-4o", credits: 2 };
    }

    // Large files (>5MB) → GPT-4o (likely complex)
    if (fileSize > 5 * 1024 * 1024) {
        return { model: "gpt-4o", credits: 3 };
    }

    // Simple images and small PDFs → 4o-mini
    return { model: "gpt-4o-mini", credits: 1 };
}

// Check if file is a Word document
function isWordDocument(fileType: string): boolean {
    return fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "application/msword";
}

// Check if file is an image
function isImage(fileType: string): boolean {
    return fileType.startsWith("image/");
}

// Improved prompt for better extraction
const EXTRACTION_PROMPT = `Analyze this document thoroughly and extract ALL structured data you can find.

Look for:
- Tables and grids (preserve row/column structure)
- Key-value pairs (e.g., "Name: John", "Amount: $500")
- Lists and bullet points
- Prices, dates, quantities, measurements
- Any labeled or categorized information

Output ONLY as clean CSV format:
- Use appropriate column headers
- One row per data record
- No explanations, code blocks, or markdown
- Just raw CSV data

If there are multiple distinct tables or data sections, separate them with a blank line.`;

// Prompt for text-based extraction (Word docs)
const TEXT_EXTRACTION_PROMPT = `Here is the extracted text content from a document. Please analyze it and extract ALL structured data.

Look for:
- Tables and grids (preserve row/column structure)
- Key-value pairs (e.g., "Name: John", "Amount: $500")
- Lists and bullet points
- Prices, dates, quantities, measurements
- Any labeled or categorized information

Output ONLY as clean CSV format:
- Use appropriate column headers
- One row per data record
- No explanations, code blocks, or markdown
- Just raw CSV data

Document content:
`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("file") as File[];
        const userTier = (formData.get("tier") as UserTier) || "free";

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        let combinedCsv = "";
        let totalCreditsUsed = 0;

        for (const file of files) {
            // Get model config based on file type and user tier
            const modelConfig = getModelConfig(file.type, file.size, 1, userTier);
            totalCreditsUsed += modelConfig.credits;

            const bytes = await file.arrayBuffer();
            let content = "";

            // Handle Word documents
            if (isWordDocument(file.type)) {
                try {
                    // Extract text from Word document
                    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
                    const wordText = result.value;

                    // Send extracted text to GPT for structuring
                    const response = await openai.chat.completions.create({
                        model: modelConfig.model,
                        max_tokens: 4096,
                        messages: [
                            {
                                role: "user",
                                content: TEXT_EXTRACTION_PROMPT + wordText,
                            },
                        ],
                    });

                    content = response.choices[0]?.message?.content?.trim() || "";
                } catch (wordError: unknown) {
                    console.error("Word extraction error:", wordError);
                    content = `Error extracting Word document: ${file.name}`;
                }
            }
            // Handle images and PDFs
            else if (isImage(file.type) || file.type === "application/pdf") {
                const base64Image = Buffer.from(bytes).toString("base64");
                const mediaType = file.type;

                const response = await openai.chat.completions.create({
                    model: modelConfig.model,
                    max_tokens: 4096,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:${mediaType};base64,${base64Image}`,
                                    },
                                },
                                {
                                    type: "text",
                                    text: EXTRACTION_PROMPT,
                                },
                            ],
                        },
                    ],
                });

                content = response.choices[0]?.message?.content?.trim() || "";
            }
            // Unsupported file type
            else {
                content = `Unsupported file type: ${file.type}`;
            }

            if (content) {
                // If we have existing content, add a separator
                if (combinedCsv.length > 0) {
                    combinedCsv += "\n\n--- TABLE FROM: " + file.name + " ---\n\n";
                }
                combinedCsv += content;
            }
        }

        if (combinedCsv) {
            return new NextResponse(combinedCsv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="tablesift-combined-${new Date().getTime()}.csv"`,
                    "X-Credits-Used": totalCreditsUsed.toString(),
                },
            });
        }

        return NextResponse.json({ error: "Failed to extract text from any provided files" }, { status: 500 });
    } catch (error: unknown) {
        console.error("Extraction error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
