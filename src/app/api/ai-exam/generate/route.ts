import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { category, subcategory, topic, difficulty, numQuestions } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
        }

        const prompt = `Generate exactly ${numQuestions} multiple choice questions about "${topic || subcategory || category}" 
        at a ${difficulty} difficulty level. 
        
        CRITICAL INSTRUCTIONS:
        1. Return ONLY a valid JSON array of objects.
        2. Each object must have these EXACT keys: 
           "questionText" (string), 
           "options" (array of exactly 4 strings), 
           "correctAnswer" (string, must exactly match one item in options), 
           "explanation" (string, 1-2 sentence explanation).
        3. Make sure the questions are technically accurate and the options are plausible.
        4. Do not include any markdown formatting like \`\`\`json or \`\`\` in the response.
        5. Total questions: ${numQuestions}.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        response_mime_type: "application/json",
                    }
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Generation failed" }, { status: response.status });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return NextResponse.json({ error: "No content generated" }, { status: 500 });
        }

        const questions = JSON.parse(text);
        return NextResponse.json({ success: true, questions });

    } catch (error: any) {
        console.error("Exam Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate exam" }, { status: 500 });
    }
}
