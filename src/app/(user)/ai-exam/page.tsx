"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Target,
  BarChart,
  Clock,
  Settings2,
  ArrowRight,
  Loader2,
  Trophy,
  Zap,
  BookOpen
} from 'lucide-react';
import { GetAIExamSetupData } from '@/app/service/ai-exam-service';

const DIFFICULTIES = [
  { level: 1, label: 'Beginner', color: 'text-green-500', bg: 'bg-green-50' },
  { level: 2, label: 'Intermediate', color: 'text-blue-500', bg: 'bg-blue-50' },
  { level: 3, label: 'Advanced', color: 'text-purple-500', bg: 'bg-purple-50' },
  { level: 4, label: 'Expert', color: 'text-orange-500', bg: 'bg-orange-50' },
  { level: 5, label: 'Master', color: 'text-red-500', bg: 'bg-red-50' },
];

const MARKS_OPTIONS = [10, 20, 30, 50, 100];

export default function AIExamSetup() {
  const router = useRouter();
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState(2);
  const [totalMarks, setTotalMarks] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAIExamSetupData();
        setHierarchy(data);
      } catch (error) {
        console.error("Failed to fetch setup data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeCategory = hierarchy.find(c => c._id === selectedCategory);
  const activeSubcategory = activeCategory?.subcategories?.find((s: any) => s._id === selectedSubcategory);

  const currentDifficulty = DIFFICULTIES.find(d => d.level === difficulty) || DIFFICULTIES[1];
  const numQuestions = totalMarks / 2; // Assuming 2 marks per question

  const categoryName = activeCategory?.name || '';
  const subcategoryName = activeSubcategory?.name || '';
  const topicName = activeSubcategory?.topics?.find((t: any) => t._id === selectedTopic)?.name || '';

  const handleStartExam = () => {
    const examParams = {
      category: categoryName,
      subcategory: subcategoryName,
      topic: topicName,
      difficulty: currentDifficulty.label,
      totalMarks,
      numQuestions
    };

    // Store in session storage to pass to the attempt page
    sessionStorage.setItem('aiExamParams', JSON.stringify(examParams));
    router.push('/ai-exam/attempt');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Preparing AI Exam Laboratory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Brain size={16} /> AI-Powered Assessment
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Configure Your <span className="text-purple-600">AI Exam</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our AI will generate a unique set of questions based on your selection. Target your weak areas and master any topic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Topic Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-purple-100/20 border border-purple-50">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">1. Select Domain</h2>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Main Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory('');
                      setSelectedTopic('');
                    }}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all appearance-none font-medium text-gray-700 border border-gray-200"
                  >
                    <option value="">Select Category</option>
                    {hierarchy.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>

                {/* Subcategory */}
                <div className={!selectedCategory ? 'opacity-40 pointer-events-none' : ''}>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setSelectedTopic('');
                    }}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all appearance-none font-medium text-gray-700 border border-gray-200"
                  >
                    <option value="">Select Subcategory (Optional)</option>
                    {activeCategory?.subcategories?.map((sub: any) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                  </select>
                </div>

                {/* Topic */}
                <div className={!selectedSubcategory ? 'opacity-40 pointer-events-none' : ''}>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Specific Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all appearance-none font-medium text-gray-700 border border-gray-200"
                  >
                    <option value="">Select Topic (Optional)</option>
                    {activeSubcategory?.topics?.map((topic: any) => <option key={topic._id} value={topic._id}>{topic.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Difficulty & Marks */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-purple-100/20 border border-purple-50">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Settings2 size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. Adjust Parameters</h2>
              </div>

              <div className="space-y-12">
                {/* Difficulty Slider */}
                <div>
                  <div className="flex justify-between items-center mb-6 px-1">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">Difficulty Level</label>
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter ${currentDifficulty.bg} ${currentDifficulty.color}`}>
                      {currentDifficulty.label}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-all"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 px-1">
                    <span>LEVEL 1</span>
                    <span>LEVEL 3</span>
                    <span>LEVEL 5</span>
                  </div>
                </div>

                {/* Marks Dropdown/Toggle */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-6 px-1 uppercase tracking-widest">Total Marks</label>
                  <div className="grid grid-cols-5 gap-3">
                    {MARKS_OPTIONS.map(m => (
                      <button
                        key={m}
                        onClick={() => setTotalMarks(m)}
                        className={`py-4 rounded-2xl font-black transition-all text-sm border-2 ${totalMarks === m
                            ? 'bg-gray-900 text-white border-gray-900 scale-105 shadow-lg'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200 hover:text-purple-600'
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout/Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-purple-200 sticky top-12">
              <h3 className="text-xl font-bold mb-8">Exam Summary</h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/60 font-bold uppercase mb-1">Focus Area</p>
                    <p className="font-bold line-clamp-1">{topicName || subcategoryName || categoryName || 'Mixed Domain'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <BarChart size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/60 font-bold uppercase mb-1">Questions</p>
                    <p className="font-bold uppercase">{numQuestions} Multiple Choice</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/60 font-bold uppercase mb-1">Estimated Time</p>
                    <p className="font-bold">{numQuestions} Minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-yellow-300">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-xs font-black uppercase">Adaptive AI Mode</span>
                </div>
                <p className="text-[11px] text-purple-100 leading-relaxed">
                  Questions are generated in real-time. Each exam is unique. Performance is tracked for AI insights.
                </p>
              </div>

              <button
                disabled={!selectedCategory}
                onClick={handleStartExam}
                className="w-full py-5 bg-white text-purple-700 hover:bg-yellow-400 hover:text-gray-900 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl active:scale-95"
              >
                PROCEED TO EXAM
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={() => router.push('/ai-exam/history')}
              className="w-full py-4 bg-white text-gray-500 rounded-[2rem] font-bold text-sm border border-gray-200 hover:text-purple-600 hover:border-purple-200 transition-all flex items-center justify-center gap-2"
            >
              <Trophy size={18} />
              View Your Score History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
