import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import * as dotenv from "dotenv";
dotenv.config();

const SYSTEM_INSTRUCTION = `You are EduBot, a friendly and knowledgeable AI assistant for Eduverse — a modern online learning management system (LMS).

Your role is to help users with:
- Finding and recommending courses available on the platform
- Answering questions about categories, topics, and subjects
- Explaining how to enroll in courses, use the platform, manage their account
- Providing study tips, learning strategies, and career guidance
- Answering general educational questions
- Helping course providers and universities understand how to use the platform

Guidelines:
- Be friendly, concise, and helpful
- If asked something completely unrelated to learning/education, politely redirect the conversation
- Format responses clearly — use bullet points or numbered lists when listing items
- Keep responses short (2-4 sentences for simple questions, up to 8 lines for complex ones)
- Always be encouraging and supportive of learners
- If you don't know something specific about the platform, say so and suggest they contact support`;

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
        }

        // Format messages for Gemini API
        const contents = [];

        // Add history
        if (history && history.length > 0) {
            for (const msg of history) {
                contents.push({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }]
                });
            }
        }

        // Add current message
        contents.push({
            role: "user",
            parts: [{ text: message }]
        });

        // Make direct API call
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: SYSTEM_INSTRUCTION }]
                    },
                    generationConfig: {
                        maxOutputTokens: 512,
                        temperature: 0.7,
                    }
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);
            return NextResponse.json(
                { error: "AI service error: " + (data.error?.message || "Unknown error") },
                { status: response.status }
            );
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I couldn't generate a response. Please try again.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        const errMsg: string = error?.message || String(error);
        console.error("EduBot API error:", errMsg);

        // Gemini rate-limit: give a friendly message
        if (errMsg.includes("429") || errMsg.toLowerCase().includes("too many requests") || errMsg.toLowerCase().includes("quota")) {
            return NextResponse.json(
                { error: "⏳ I'm getting a lot of questions right now! Please wait a moment and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Sorry, I couldn't process that. Please try again." },
            { status: 500 }
        );
    }
}
