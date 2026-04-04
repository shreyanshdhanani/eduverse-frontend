"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { GenerateQuestionService } from "@/app/service/quiz.service";

const QuizContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/user-login");
        return;
      }

      if (!selectedTopic) {
        console.error("No topic selected in URL.");
        return;
      }

      try {
        const response = await GenerateQuestionService(selectedTopic);
        console.log("response.data", response.data);
        
        if (response.data && response.data.quiz) {
          setQuestions(response.data.quiz);
        } else {
          router.push("/quiz");
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuestions();
  }, [selectedTopic, router]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    alert(`Quiz Submitted! Your Score: ${calculatedScore} / ${questions.length}`);
  };

  if (!selectedTopic) {
    return <div className="text-center text-lg mt-10">No topic selected. Please go back and choose a topic.</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center text-lg mt-10">Loading questions...</div>;
  }

  return (
    <div className="p-10 bg-white shadow-lg rounded-lg max-w-3xl mx-auto border border-gray-300 mt-10 mb-10">
      <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Question {currentQuestionIndex + 1} / {questions.length}
      </h2>
      <p className="mb-8 text-xl font-medium text-gray-700 text-center">
        {questions[currentQuestionIndex].question}
      </p>
      <div className="space-y-4">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <label
            key={index}
            className={`block p-4 border rounded-lg cursor-pointer transition duration-300 text-lg font-medium ${
              selectedAnswers[currentQuestionIndex] === option ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-purple-200"
            }`}
          >
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={option}
              className="hidden"
              onChange={() => handleAnswerSelect(option)}
              checked={selectedAnswers[currentQuestionIndex] === option}
            />
            {option}
          </label>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          className="px-8 py-3 bg-gray-500 text-white rounded-md text-lg font-semibold transition duration-300 hover:bg-gray-700 disabled:opacity-50"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-purple-600 text-white rounded-md text-lg font-semibold transition duration-300 hover:bg-purple-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-md text-lg font-semibold transition duration-300 hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const QuizComponent = () => {
  return (
    <Suspense fallback={<div className="text-center text-lg mt-10">Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
};

export default QuizComponent;