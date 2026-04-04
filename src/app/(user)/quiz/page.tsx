"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { GetAllTopicsService } from "@/app/service/topic-service";
import { SiGooglegemini } from "react-icons/si";
import { useRouter } from "next/navigation";
// ** Carousel Settings **
const settings = {
  dots: false,
  infinite: false,
  speed: 700,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1000, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

export default function AIQuizTopics() {
  const router = useRouter()
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Fetch all quiz topics from the database
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicData = await GetAllTopicsService();
        setTopics(topicData);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const generateQuiz = async(selectedTopic: string)=>{
    const authToken = localStorage.getItem("authToken");
    if(authToken)
    {
      router.push(`/question?topic=${selectedTopic}`)
    }
    else{
        router.push('user-login')
    }
  }
 
  return (
    <div className="container mt-40 mx-auto p-6 m-10 mb-40">
      {/* 🔹 AI-Powered Title */}
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
           <SiGooglegemini size={30} className="w-8 h-8 text-purple-600" />
          AI-Powered Quiz Generator
        </h2>
      </div>

      {/* 🔹 Topic Selection Carousel */}
      <Slider {...settings}>
        {topics.length > 0 ? (
          
          topics.map((topic) => (
            <div key={topic._id} className="p-7">
              <button
                className={`w-full p-4 rounded-xl shadow-md transition-all duration-300
                          ${
                            selectedTopic === topic._id
                              ? "bg-purple-600 text-white"
                              : "bg-white text-gray-800 border border-purple-500"
                          }
                          hover:bg-purple-500 hover:text-white hover:shadow-lg`}
                onClick={() => setSelectedTopic(topic._id)}
              >
                {topic.name}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No topics available.</p>
        )}
      </Slider>
      

      {/* 🔹 Generate Quiz Button */}
      {selectedTopic && (
        <div className="mt-6 flex justify-center">
          <button onClick={()=> generateQuiz(selectedTopic)}  className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold shadow-lg transition-all hover:bg-purple-700 animate-glow">
            Generate AI Quiz
          </button>
        </div>
      )}
    </div>
  );
}
