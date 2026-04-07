"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    Clock,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    CheckCircle,
    LogOut,
    Zap,
    HelpCircle,
    Brain
} from 'lucide-react';
import axios from 'axios';
import { SaveAIExamResult } from '@/app/service/ai-exam-service';
import { useModal } from '@/components/ModalProvider';

export default function AIExamAttempt() {
    const { showConfirm } = useModal();
    const router = useRouter();

    // Exam Data
    const [params, setParams] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0); // In seconds
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Initial Load and Question Generation
    useEffect(() => {
        const rawParams = sessionStorage.getItem('aiExamParams');
        if (!rawParams) {
            router.push('/ai-exam');
            return;
        }

        const parsedParams = JSON.parse(rawParams);
        setParams(parsedParams);
        generateQuestions(parsedParams);

        // Initial Resume Logic
        const savedProgress = localStorage.getItem('aiExamInProgress');
        if (savedProgress) {
            const { questions: q, answers: a, timeLeft: t, currentIndex: i } = JSON.parse(savedProgress);
            // Only resume if it's the same topic
            setQuestions(q);
            setAnswers(a);
            setTimeLeft(t);
            setCurrentIndex(i);
            setLoading(false);
        }

        // Protection against back/refresh
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isFinished) {
                e.preventDefault();
                e.returnValue = "You have an ongoing exam. Are you sure you want to leave?";
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // 2. Question Generation Function
    const generateQuestions = async (p: any) => {
        if (questions.length > 0) return; // Already resumed

        setGenerating(true);
        try {
            const response = await axios.post('/api/ai-exam/generate', p);
            if (response.data.success) {
                setQuestions(response.data.questions);
                setTimeLeft(response.data.questions.length * 60); // 60s per question
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "AI generation failed. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    // 3. Timer Logic
    useEffect(() => {
        if (loading || isFinished) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current!);
    }, [loading, isFinished]);

    // 4. Save Progress to LocalStorage
    useEffect(() => {
        if (questions.length > 0 && !isFinished) {
            localStorage.setItem('aiExamInProgress', JSON.stringify({
                questions,
                answers,
                timeLeft,
                currentIndex,
                params
            }));
        }
    }, [answers, timeLeft, currentIndex, questions]);

    // 5. Submit Implementation
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setIsFinished(true);
        clearInterval(timerRef.current!);

        try {
            // Calculate scores
            const analysis = questions.map((q, idx) => ({
                ...q,
                userAnswer: answers[idx] || '',
                isCorrect: answers[idx] === q.correctAnswer
            }));

            const correctCount = analysis.filter(a => a.isCorrect).length;
            const skippedCount = questions.length - Object.keys(answers).length;
            const marksPerQuestion = params.totalMarks / questions.length;
            const marksObtained = analysis.filter(a => a.isCorrect).length * marksPerQuestion;
            const percentage = (marksObtained / params.totalMarks) * 100;

            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B';
            else if (percentage >= 60) grade = 'C';
            else if (percentage >= 40) grade = 'D';

            const resultData = {
                category: params.category,
                subcategory: params.subcategory,
                topic: params.topic,
                difficultyLevel: 1, // Simplified for now
                totalMarks: params.totalMarks,
                marksObtained,
                percentage,
                grade,
                timeTaken: (questions.length * 60) - timeLeft,
                totalQuestions: questions.length,
                correctAnswers: analysis.filter(a => a.isCorrect).length,
                wrongAnswers: Object.keys(answers) ? (Object.keys(answers).length - analysis.filter(a => a.isCorrect).length) : 0,
                skippedAnswers: skippedCount,
                questions: analysis
            };

            const savedResult = await SaveAIExamResult(resultData);
            localStorage.removeItem('aiExamInProgress');
            sessionStorage.removeItem('aiExamParams');
            router.push(`/ai-exam/result/${savedResult.examId}`);

        } catch (err) {
            console.error("Failed to save exam result:", err);
            setError("Your exam is finished, but we failed to save the results. Please don't close this window.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading || generating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 relative">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Zap className="text-purple-600 w-12 h-12" />
                        </div>
                        <div className="absolute top-0 right-1/4 animate-bounce">
                            <Loader2 size={32} className="text-purple-400 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Generating Your Exam</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Our AI is crafting unique questions on <b>{params?.topic || params?.subcategory || 'General Knowledge'}</b> just for you. This will take about 10 seconds.
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full animate-[progress_10s_ease-in-out]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-12 rounded-[2rem] shadow-xl text-center max-w-lg border border-red-50">
                    <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Interrupted</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold">Try Re-Generating</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Exam Header */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <Brain className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{params?.topic || params?.subcategory || 'AI Exam'}</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                Live Assessment Group
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Timer Component */}
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 scale-105 animate-pulse' : 'bg-white border-gray-100 text-gray-700'}`}>
                            <Clock size={20} />
                            <span className="text-xl font-black tabular-nums">{formatTime(timeLeft)}</span>
                        </div>

                        <button
                            onClick={async () => { 
                                const confirmed = await showConfirm({ 
                                    message: 'Are you sure you want to exit? All progress will be lost.',
                                    type: 'warning'
                                });
                                if (confirmed) router.push('/ai-exam');
                            }}
                            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm font-bold text-gray-500">Question <span className="text-purple-600 text-lg">{currentIndex + 1}</span> of {questions.length}</p>
                        <div className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {Math.round(progress)}% COMPLETE
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-purple-600 h-full transition-all duration-500 ease-out shadow-sm shadow-purple-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-purple-100/20 border border-purple-50 min-h-[400px] flex flex-col">
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                                    <HelpCircle size={14} /> Multiple Choice Question
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    {currentQuestion?.questionText}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-10">
                                {currentQuestion?.options?.map((option: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setAnswers({ ...answers, [currentIndex]: option })}
                                        className={`group flex items-center p-6 rounded-3xl border-2 transition-all active:scale-[0.98] ${answers[currentIndex] === option
                                                ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-200'
                                                : 'bg-white border-gray-100 hover:border-purple-200 hover:bg-purple-50/30'
                                            }`}
                                    >
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-5 transition-colors ${answers[currentIndex] === option
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className={`font-semibold text-lg ${answers[currentIndex] === option ? 'text-white' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Nav Buttons */}
                            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-8">
                                <button
                                    disabled={currentIndex === 0}
                                    onClick={() => setCurrentIndex(prev => prev - 1)}
                                    className="flex items-center gap-2 px-6 py-3 text-gray-400 font-bold hover:text-purple-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                    <ChevronLeft /> Previous
                                </button>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            // Skip: move next without selection
                                            if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
                                        }}
                                        className="px-6 py-3 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                                    >
                                        Skip
                                    </button>

                                    {currentIndex < questions.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentIndex(prev => prev + 1)}
                                            className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-purple-600 transition-all shadow-lg active:scale-95"
                                        >
                                            Next <ChevronRight size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                            className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-700 transition-all shadow-lg active:scale-95"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> SUBMIT EXAM</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Navigation Pips */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-8">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
                                Questions Navigator
                            </h4>
                            <div className="grid grid-cols-5 gap-3">
                                {questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${currentIndex === idx
                                                ? 'bg-purple-600 text-white shadow-lg scale-110 shadow-purple-200'
                                                : answers[idx]
                                                    ? 'bg-green-100 text-green-600 border border-green-200'
                                                    : 'bg-gray-50 text-gray-400 border border-transparent hover:bg-gray-100'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Answered</span>
                                    <span className="text-sm font-black text-gray-900">{Object.keys(answers).length} / {questions.length}</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full transition-all duration-300"
                                        style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
