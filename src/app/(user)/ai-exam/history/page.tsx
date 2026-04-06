"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  BarChart,
  ChevronRight,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
  History as HistoryIcon,
  ArrowLeft
} from 'lucide-react';
import { GetAIExamHistory } from '@/app/service/ai-exam-service';

export default function AIExamHistory() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [selectedGrade, selectedDifficulty]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await GetAIExamHistory({
        grade: selectedGrade || undefined,
        difficulty: selectedDifficulty || undefined
      });
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item =>
    (item.topic || item.subcategory || item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalExams = history.length;
  const avgScore = totalExams > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalExams)
    : 0;
  const bestScore = totalExams > 0
    ? Math.max(...history.map(h => h.percentage))
    : 0;

  if (loading && history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => router.push('/ai-exam')}
              className="group flex items-center gap-2 text-gray-500 font-bold mb-4 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Exam <span className="text-purple-600">History</span></h1>
            <p className="text-gray-500 font-medium">Tracking your AI generation performance over time.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[140px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><FileText size={12} /> Total</p>
              <p className="text-2xl font-black text-gray-900">{totalExams}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[140px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BarChart size={12} /> Avg. Score</p>
              <p className="text-2xl font-black text-purple-600">{avgScore}%</p>
            </div>
          </div>
        </div>

        {/* Filters Top Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by topic or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-gray-600 flex-1 lg:flex-none cursor-pointer"
            >
              <option value="">Filter Grade</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="F">Failed</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none text-sm font-bold text-gray-600 flex-1 lg:flex-none cursor-pointer"
            >
              <option value="">All Difficulty</option>
              <option value="1">Beginner</option>
              <option value="3">Advanced</option>
              <option value="5">Master</option>
            </select>

            <button
              onClick={() => { setSelectedGrade(''); setSelectedDifficulty(''); setSearchTerm(''); }}
              className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-purple-600 animate-spin" /></div>
        ) : filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredHistory.map((item) => {
              const date = new Date(item.createdAt).toLocaleDateString();
              const isPass = item.percentage >= 40;

              return (
                <div
                  key={item.examId}
                  className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100/30 hover:border-purple-200 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Score Badge */}
                    <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 ${isPass ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                      <span className="text-xl font-black">{Math.round(item.percentage)}%</span>
                      <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-1">{item.grade}</span>
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm">{item.examId}</span>
                        <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">{item.difficultyLevel === 1 ? 'Beginner' : 'Expert'}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{item.topic || item.subcategory || item.category}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {item.totalQuestions} Questions</span>
                        <span className="flex items-center gap-1.5"><Trophy size={14} /> {item.marksObtained}/{item.totalMarks} Marks</span>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/ai-exam/result/${item.examId}`)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-50 group-hover:bg-purple-600 text-gray-600 group-hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-sm active:scale-95"
                    >
                      Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HistoryIcon className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No Exam Records Found</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Try giving your first AI-generated exam to start tracking your progress.</p>
            <button
              onClick={() => router.push('/ai-exam')}
              className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
            >
              Start AI Exam Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
