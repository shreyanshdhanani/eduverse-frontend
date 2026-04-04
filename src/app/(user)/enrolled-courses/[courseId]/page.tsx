"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GetCourseDetailsService } from "@/app/service/course-service";
import { GenerateQuestionService } from "@/app/service/quiz.service";

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
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const data = await GetCourseDetailsService(courseId);
        setCourse(data);
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

  const handleSubmitExam = () => {
    const correctAnswers = questions.reduce((count, q, index) => {
      return userAnswers[index] === q.answer ? count + 1 : count;
    }, 0);

    setScore(correctAnswers);
    setShowResult(true);
  };

  const renderVideoPlayer = () => (
    activeVideo ? (
      <video
        controls
        className="w-full h-[400px] rounded-lg shadow-md bg-black"
        src={`http://localhost:3020/api${activeVideo}`}
      />
    ) : (
      <p className="text-gray-500">Select a video to start learning.</p>
    )
  );

  if (loading) return <p className="text-center text-lg">Loading course...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{course.description}</p>
          {course.thumbnail && (
            <div className="mt-6 flex justify-center">
              <img
                src={`http://localhost:3020/api/upload/courses/${course.thumbnail}`}
                alt="Course Thumbnail"
                className="rounded-xl shadow-lg max-w-full h-auto md:max-w-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="mb-12">{renderVideoPlayer()}</div>

        {/* Course Sections */}
        <div className="space-y-10">
          {course.sections.map((section, secIndex) => (
            <div key={section._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-700">
                {secIndex + 1}. {section.title}
              </h2>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {section.videos.map((video, vidIndex) => (
                  <button
                    key={vidIndex}
                    onClick={() => setActiveVideo(video)}
                    className={`p-3 border rounded-lg hover:bg-indigo-100 text-left transition ${
                      activeVideo === video ? "bg-indigo-200" : "bg-gray-100"
                    }`}
                  >
                    ▶️ Video {vidIndex + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final Exam Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => handleStartExam(course.topic.name)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            🎓 Attempt Final Exam
          </button>
        </div>

        {/* Quiz Section */}
        {questions.length > 0 && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">📝 Final Exam</h2>
            {questions.map((q, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <p className="font-medium text-gray-700 mb-2">
                  {index + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <label key={optIndex} className="block">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        checked={userAnswers[index] === opt}
                        onChange={() =>
                          setUserAnswers({ ...userAnswers, [index]: opt })
                        }
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={handleSubmitExam}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                ✅ Submit Exam
              </button>
            </div>
          </div>
        )}

        {/* Exam Result */}
        {showResult && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-xl font-semibold">
              🎯 Your Score: {score}/{questions.length}
            </p>
            {score >= questions.length * 0.7 ? (
              <button
                className="mt-4 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg"
                onClick={() => alert("🎉 Certificate Generated! (Coming Soon)")}
              >
                🎓 Download Certificate
              </button>
            ) : (
              <p className="text-red-500 mt-2">
                You need at least 70% to pass. Try again!
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          Provided by {course.courseProvider?.name} | Language: {course.language} | Duration: {course.duration} hrs
        </div>
      </div>
    </div>
  );
}
