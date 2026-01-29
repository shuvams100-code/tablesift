import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64Image = Buffer.from(bytes).toString("base64");
        const mediaType = file.type as any;

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mediaType,
                                data: base64Image,
                            },
                        },
                        {
                            type: "text",
                            text: "Extract the data from the table in this image and return it ONLY as a clean CSV string. Do not include any explanation or markdown formatting. Ensure headers are correctly identified.",
                        },
                    ],
                },
            ],
        });

        const content = response.content[0];
        if (content.type === 'text') {
            return new NextResponse(content.text, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="tablesift-export.csv"`,
                },
            });
        }

        return NextResponse.json({ error: "Failed to extract text" }, { status: 500 });
    } catch (error: any) {
        console.error("Extraction error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
