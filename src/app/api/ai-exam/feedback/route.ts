import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { resultData } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
        }

        const prompt = `Based on this exam result:
        - Topic: ${resultData.topic}
        - Score: ${resultData.marksObtained}/${resultData.totalMarks} (${resultData.percentage}%)
        - Correct: ${resultData.correctAnswers}
        - Wrong: ${resultData.wrongAnswers}
        - Skipped: ${resultData.skippedAnswers}
        
        Provide 3-5 personalized and highly specific improvement suggestions for the user. 
        Identify potential weak areas based on the topic.
        Keep the tone encouraging, professional, and actionable.
        Return the response as a simple list of clear points.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Analysis failed" }, { status: response.status });
        }

        const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available at this moment.";
        return NextResponse.json({ success: true, feedback });

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: error.message || "Failed to analyze result" }, { status: 500 });
    }
}
