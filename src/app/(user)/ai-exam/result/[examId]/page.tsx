"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Trophy,
  Target,
  Clock,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  History as HistoryIcon,
  FileSearch,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { GetAIExamDetails } from '@/app/service/ai-exam-service';

export default function AIExamResult() {
  const { examId } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchResult();
    }
  }, [examId]);

  const fetchResult = async () => {
    try {
      const data = await GetAIExamDetails(examId as string);
      setResult(data);
      getAIFeedback(data);
    } catch (error) {
      console.error("Failed to fetch result:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAIFeedback = async (resultData: any) => {
    setGeneratingFeedback(true);
    try {
      const response = await axios.post('/api/ai-exam/feedback', { resultData });
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setGeneratingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <AlertCircle size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
        <p className="text-gray-500 mb-8">We couldn't find the record for this exam attempt.</p>
        <button onClick={() => router.push('/ai-exam')} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-purple-700">Back to AI Exam</button>
      </div>
    );
  }

  const chartData = [
    { name: 'Correct', value: result.correctAnswers, color: '#10B981' }, // emerald-500
    { name: 'Wrong', value: result.wrongAnswers, color: '#EF4444' }, // red-500
    { name: 'Skipped', value: result.skippedAnswers, color: '#94A3B8' }, // slate-400
  ];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  const isPass = result.percentage >= 40;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* TOP HERO/SCORE CARD */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/30 border border-purple-50 relative">
          <div className={`absolute top-0 left-0 w-full h-3 ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="relative">
                <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 ${isPass ? 'border-emerald-50 bg-emerald-50/30 text-emerald-600' : 'border-red-50 bg-red-50/30 text-red-600'}`}>
                  <span className="text-5xl font-black">{Math.round(result.percentage)}%</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-1">Accuracy</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                  <Trophy size={16} className={isPass ? 'text-yellow-500' : 'text-gray-400'} />
                  <span className="text-sm font-black text-gray-900 uppercase">Grade {result.grade}</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{isPass ? 'Congratulations! 🎉' : 'Keep Practicing 🍀'}</h1>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">You completed the assessment on <b>{result.topic || result.subcategory || 'the selected topic'}</b>.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Target size={12} /> Marks</p>
                    <p className="text-lg font-black text-gray-900">{result.marksObtained}/{result.totalMarks}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12} /> Time</p>
                    <p className="text-lg font-black text-gray-900">{formatSeconds(result.timeTaken)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><CheckCircle size={12} /> Correct</p>
                    <p className="text-lg font-black text-emerald-600">{result.correctAnswers}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><XCircle size={12} /> Wrong</p>
                    <p className="text-lg font-black text-red-600">{result.wrongAnswers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: CHART AND AI FEEDBACK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Breakdown Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-8 w-full border-b border-gray-50 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={20} /></div>
              <h3 className="text-xl font-bold text-gray-900">Performance Breakdown</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights and Feedback */}
          <div className="bg-gradient-to-br from-gray-900 to-purple-950 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="p-2 bg-white/10 text-yellow-300 rounded-lg"><Sparkles size={20} /></div>
                <h3 className="text-xl font-bold">AI Insights</h3>
              </div>

              {generatingFeedback ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
                  <p className="text-purple-200 text-sm animate-pulse">Personalizing your path to success...</p>
                </div>
              ) : feedback ? (
                <div className="space-y-4">
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed text-purple-100/80">
                    {feedback.split('\n').map((line, i) => (
                      <p key={i}>{line.replace(/^\*|\-/, '•')}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic py-10 text-center">AI Analysis currently unavailable.</p>
              )}
            </div>
          </div>
        </div>

        {/* QUESTION REVIEW TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileSearch size={20} /></div>
              <h3 className="text-xl font-bold text-gray-900">Detailed Review</h3>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <CheckCircle size={14} /> {result.correctAnswers} Correct
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <XCircle size={14} /> {result.wrongAnswers} Incorrect
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 p-8 space-y-8">
            {result.questions.map((q: any, idx: number) => (
              <div key={idx} className="bg-white rounded-3xl pt-2 pb-6 group">
                <div className="flex items-start gap-5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-xs border ${q.isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    Q{idx + 1}
                  </div>
                  <div className="flex-1 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900 leading-tight pt-1">
                      {q.questionText}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((option: string, oIdx: number) => {
                        const isUserAns = q.userAnswer === option;
                        const isCorrectAns = q.correctAnswer === option;
                        return (
                          <div
                            key={oIdx}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-4 text-sm font-semibold transition-all ${isCorrectAns
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : isUserAns
                                  ? 'bg-red-50 border-red-500 text-red-800'
                                  : 'bg-gray-50 border-gray-50 text-gray-500'
                              }`}
                          >
                            <span className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center shrink-0">{String.fromCharCode(65 + oIdx)}</span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAns && <CheckCircle className="text-emerald-500" size={18} />}
                            {(isUserAns && !isCorrectAns) && <XCircle className="text-red-500" size={18} />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                        <div className="text-blue-500 shrink-0 mt-1"><HelpCircle size={18} /></div>
                        <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Explanation</p>
                          <p className="text-sm text-blue-700 leading-relaxed font-medium">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
          <button
            onClick={() => router.push('/ai-exam')}
            className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black transition-all hover:bg-purple-600 shadow-xl active:scale-95"
          >
            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /> RETAKE EXAM
          </button>
          <button
            onClick={() => router.push('/ai-exam/history')}
            className="flex items-center justify-center gap-3 bg-white text-gray-700 px-10 py-5 rounded-2xl font-black border border-gray-200 transition-all hover:bg-gray-50 shadow-sm active:scale-95"
          >
            <HistoryIcon size={20} /> VIEW HISTORY
          </button>
          <button
            onClick={() => router.push('/home')}
            className="flex items-center justify-center gap-3 bg-white text-gray-500 px-10 py-5 rounded-2xl font-bold transition-all hover:text-purple-600"
          >
            Continue Browsing <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
