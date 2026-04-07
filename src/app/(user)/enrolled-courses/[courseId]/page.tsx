"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GetCourseDetailsService } from "@/app/service/course-service";
import { GenerateQuestionService } from "@/app/service/quiz.service";
import { getAssetUrl } from "@/app/utils/asset-url";
import { useModal } from "@/components/ModalProvider";
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Award, 
  Clock, 
  Maximize2,
  FileText,
  MessageSquare,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

// Types
interface Course {
  title: string;
  description: string;
  thumbnail: string;
  topic: { name: string };
  language: string;
  duration: number;
  courseProvider: { name: string };
  sections: {
    _id: string;
    title: string;
    description: string;
    videos: string[];
  }[];
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function LearnCourse() {
  const { showAlert } = useModal();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const data: any = await GetCourseDetailsService(courseId);
        setCourse(data);
        // Set first video of first section as default
        if (data?.sections?.length > 0 && data.sections[0].videos?.length > 0) {
          setActiveVideo(data.sections[0].videos[0]);
          setActiveSectionId(data.sections[0]._id);
          setOpenSections({ [data.sections[0]._id]: true });
        }
      } catch (err) {
        setError("Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseDetails();
  }, [courseId]);

  // Handle exam logic
  const handleStartExam = async (selectedTopic: string) => {
    try {
      const response = await GenerateQuestionService(String(selectedTopic));
      if (response.data?.quiz) {
        setQuestions(response.data.quiz);
        setUserAnswers({});
        setScore(0);
        setShowResult(false);
      }
    } catch (err) {
      console.error("Failed to load quiz:", err);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitExam = () => {
    const correctAnswers = questions.reduce((count, q, index) => {
      return userAnswers[index] === q.answer ? count + 1 : count;
    }, 0);

    setScore(correctAnswers);
    setShowResult(true);
    
    // Smooth scroll to top of exam results
    const examElement = document.getElementById('exam-results');
    if (examElement) examElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const renderVideoPlayer = () => (
    activeVideo ? (
      <video
        controls
        className="w-full h-[400px] rounded-lg shadow-md bg-black"
        src={getAssetUrl(activeVideo)}
      />
    ) : (
      <p className="text-gray-500">Select a video to start learning.</p>
    )
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Preparing your learning environment...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-50">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={30} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Course</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );

  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/enrolled-courses" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-950 line-clamp-1">{course.title}</h1>
              <p className="text-xs text-purple-700 font-extrabold uppercase tracking-wider">Continuing Module</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl border border-gray-200">
                <Clock size={16} className="text-gray-600" />
                <span className="text-sm font-black text-gray-800">{course.duration} Hours Total</span>
             </div>
             <button className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95">
                Leave Review
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Main Content (Left) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-900/10 group">
              {activeVideo ? (
                <video
                  key={activeVideo}
                  controls
                  className="w-full h-full"
                  src={getAssetUrl(activeVideo)}
                  autoPlay
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                   <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-purple-500 animate-pulse">
                      <PlayCircle size={48} />
                   </div>
                   <h3 className="text-white text-xl font-black tracking-tight">Ready to Start?</h3>
                   <p className="text-gray-300 mt-2 font-bold">Select a lesson from the curriculum to begin learning.</p>
                </div>
              )}
            </div>

            {/* Assessment UI (if questions are loaded) */}
            {questions.length > 0 && (
              <div id="quiz-section" className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex items-center justify-between gap-4 flex-wrap border-b border-gray-50 pb-8">
                  <div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">Assessment Module</span>
                    <h2 className="text-3xl font-black text-gray-950 tracking-tight">Final Assessment</h2>
                    <p className="text-gray-800 font-bold mt-2">Complete the quiz below to validate your knowledge.</p>
                  </div>
                  <div className="px-6 py-4 bg-gray-100 rounded-2xl border border-gray-200 text-center">
                    <p className="text-xs font-black text-gray-600 uppercase mb-1">Total Questions</p>
                    <p className="text-2xl font-black text-gray-950">{questions.length}</p>
                  </div>
                </div>

                <div className="space-y-10">
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="space-y-6">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 w-10 h-10 bg-purple-700 text-white rounded-xl flex items-center justify-center font-black text-sm">
                          {qIndex + 1}
                        </span>
                        <h3 className="text-xl font-black text-gray-950 pt-1 leading-snug">{q.question}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
                        {q.options.map((opt, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => setUserAnswers(prev => ({ ...prev, [qIndex]: opt }))}
                            className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${
                              userAnswers[qIndex] === opt 
                                ? "bg-purple-700 border-purple-700 text-white shadow-lg shadow-purple-600/20" 
                                : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                            }`}
                          >
                            <span className="font-bold">{opt}</span>
                            {userAnswers[qIndex] === opt && <CheckCircle2 size={18} className="absolute top-4 right-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-gray-50 flex flex-col items-center">
                   <button 
                    onClick={handleSubmitExam}
                    disabled={Object.keys(userAnswers).length < questions.length}
                    className="group bg-gray-900 hover:bg-purple-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all active:scale-95 flex items-center gap-4"
                   >
                     Submit Assessment
                     <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                   {Object.keys(userAnswers).length < questions.length && (
                     <p className="text-gray-800 text-sm mt-4 font-black italic">Please answer all questions to submit</p>
                   )}
                </div>

                {showResult && (
                  <div id="exam-results" className="mt-12 p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-[2.5rem] border border-white text-center shadow-xl animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                       <Award size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-950 mb-2">Results Analyzed</h3>
                    <p className="text-gray-800 mb-8 font-black uppercase tracking-widest text-xs">Your Performance Breakdown</p>
                    
                    <div className="text-6xl font-black text-indigo-700 mb-8 tracking-tighter">
                      {score} <span className="text-2xl text-gray-600">/ {questions.length}</span>
                    </div>

                    {score >= questions.length * 0.7 ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 inline-block font-bold">
                           🎉 Congratulations! You have successfully passed.
                        </div>
                        <br />
                        <button
                          className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-3 mx-auto active:scale-95"
                          onClick={() => showAlert({ message: "🎉 Your Certificate has been generated! Check your profile.", type: "success" })}
                        >
                          < Award size={20} />
                          Download Certificate
                        </button>
                      </div>
                    ) : (
                      <div className="text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 inline-block">
                        Unfortunately, you need at least 70% to pass. Review the material and try again!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Course Details (Bottom Area) */}
            <div className={`p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm ${questions.length > 0 ? 'opacity-50 grayscale scale-95 origin-top transition-all duration-500 pointer-events-none' : ''}`}>
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                     <FileText size={24} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-950 tracking-tight">Course Information</h3>
                     <p className="text-sm text-gray-800 font-black">Provided by {course.courseProvider?.name}</p>
                  </div>
               </div>
               <div className="prose prose-purple max-w-none text-gray-900 leading-relaxed font-bold">
                  {course.description}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 border-t border-gray-100 pt-10">
                  <div className="flex items-start gap-4 p-6 bg-[#F8F9FD] rounded-3xl group">
                     <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <MessageSquare size={20} />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-950 tracking-tight underline transition-all decoration-purple-200">Native Language</h4>
                        <p className="text-sm text-gray-800 font-bold capitalize">{course.language}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-[#F8F9FD] rounded-3xl group">
                     <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <BookOpen size={20} />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-950 tracking-tight underline transition-all decoration-purple-200">Main Topic</h4>
                        <p className="text-sm text-gray-800 font-bold">{course.topic.name}</p>
                     </div>
                  </div>
               </div>

               {/* Exam Call to Action */}
               {!questions.length && (
                 <div className="mt-12 bg-gray-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl transition-all duration-700 group-hover:bg-purple-600/20" />
                   <div className="relative z-10 flex-1">
                      <h3 className="text-2xl font-black mb-3">Ready for the Final Step?</h3>
                      <p className="text-gray-100 font-bold max-w-md">Once you've finished all lessons, attempt the final assessment to earn your official completion certificate.</p>
                   </div>
                   <button
                    onClick={() => handleStartExam(course.topic.name)}
                    className="relative z-10 bg-white text-gray-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-purple-400 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                   >
                     Attempt Exam
                   </button>
                 </div>
               )}
            </div>
          </div>
        </main>

        {/* Curriculum Sidebar (Right) */}
        <aside className="w-full lg:w-[450px] bg-white border-l border-gray-100 flex flex-col h-full shadow-2xl shadow-gray-200/50">
          <div className="p-8 border-b border-gray-100 bg-white">
            <h3 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-3">
               Course Content
               <span className="text-xs px-2 py-0.5 bg-gray-950 text-white rounded-md font-black uppercase">{course.sections.length} Modules</span>
            </h3>
            <div className="mt-6 w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
               <div className="h-full bg-gradient-to-r from-purple-700 to-indigo-700 transition-all duration-1000 w-[15%]" />
            </div>
            <div className="flex items-center justify-between mt-3">
               <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest leading-none">Your Progress</span>
               <span className="text-xs font-black text-purple-700 leading-none">15% COMPLETE</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {course.sections.map((section, secIndex) => (
              <div key={section._id} className="rounded-3xl transition-all duration-300">
                <button
                  onClick={() => toggleSection(section._id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
                    openSections[section._id] ? "bg-[#F8F9FD] text-purple-600 shadow-sm" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                       openSections[section._id] ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-800"
                    }`}>
                      {secIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className={`font-black text-sm truncate pr-4 ${openSections[section._id] ? 'text-purple-700' : 'text-gray-950'}`}>{section.title}</h4>
                      <p className="text-[10px] text-gray-650 font-black uppercase tracking-widest mt-0.5">{section.videos.length} Lectures</p>
                    </div>
                  </div>
                  {openSections[section._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {openSections[section._id] && (
                  <div className="mt-2 space-y-1 pl-4 pr-2">
                    {section.videos.map((video, vidIndex) => (
                      <button
                        key={vidIndex}
                        onClick={() => {
                          setActiveVideo(video);
                          setActiveSectionId(section._id);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                          activeVideo === video 
                            ? "bg-purple-50 text-purple-600" 
                            : "hover:bg-gray-50 text-gray-500"
                        }`}
                      >
                        <div className={`transition-colors ${activeVideo === video ? "text-purple-700" : "text-gray-700 group-hover:text-purple-600"}`}>
                           {activeVideo === video ? <PlayCircle size={20} fill="currentColor" fillOpacity={0.1} /> : <PlayCircle size={18} />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-xs font-black leading-tight ${activeVideo === video ? "text-purple-800" : "text-gray-900 group-hover:text-black"}`}>
                             Lesson {vidIndex + 1}
                          </p>
                          <p className={`text-[10px] font-black mt-1 flex items-center gap-1.5 uppercase ${activeVideo === video ? 'text-purple-600' : 'text-gray-700'}`}>
                             <Clock size={10} /> 12:45 MIN
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                           <CheckCircle2 size={16} className={`transition-opacity ${activeVideo === video ? "opacity-100" : "opacity-20"}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-100">
             <div className="flex items-center gap-3 text-gray-950 font-black uppercase text-[10px] tracking-widest mb-4">
                <Maximize2 size={12} /> Resource Support
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-xl text-xs font-black text-gray-900 hover:bg-gray-100 transition-colors shadow-sm">
                   Resources
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-xl text-xs font-black text-gray-900 hover:bg-gray-100 transition-colors shadow-sm">
                   Discussion
                </button>
             </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
}
