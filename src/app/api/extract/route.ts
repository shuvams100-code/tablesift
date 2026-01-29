import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("file") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        let combinedCsv = "";

        for (const file of files) {
            // Convert file to base64
            const bytes = await file.arrayBuffer();
            const base64Image = Buffer.from(bytes).toString("base64");
            const mediaType = file.type;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
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
                                text: "Extract the data from the table in this image and return it ONLY as a clean CSV string. Do not include any explanation, code blocks, or markdown formatting. Ensure headers are correctly identified. Output only raw CSV data.",
                            },
                        ],
                    },
                ],
            });

            const content = response.choices[0]?.message?.content?.trim() || "";

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
