"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourseDetails } from "@/app/service/course-provider-service";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

interface CourseSection {
  _id: string;
  title: string;
  description: string;
  videos: string[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  topic: string;
  level: string;
  language: string;
  duration: number;
  thumbnail: string;
  previewVideo: string | null;
  certificateAvailable: boolean;
  createdAt: string;
  sections: CourseSection[];
}

export default function CourseDetails() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Course ID not found");
        setLoading(false);
        return;
      }

      try {
        const courseData = await getCourseDetails(courseId);
        setCourse(courseData);
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="text-blue-500 text-center">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!course) return <p className="text-gray-500 text-center">No course found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Thumbnail and Preview */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
        <Image
          src={`http://localhost:3020/api/upload/courses/${course.thumbnail}`}
          alt={course.title}
          fill
          style={{ objectFit: "cover" }}
        />
        {course.previewVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <a
              href={`http://localhost:3020/api/upload/courses/${course.previewVideo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-black bg-opacity-50 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-opacity-80"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Preview
            </a>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-700">{course.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <span className="text-sm text-gray-500">Level</span>
            <p className="font-semibold">{course.level}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Language</span>
            <p className="font-semibold capitalize">{course.language}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Duration</span>
            <p className="font-semibold">{course.duration} hours</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Certificate</span>
            <p className={`font-semibold ${course.certificateAvailable ? "text-green-600" : "text-red-500"}`}>
              {course.certificateAvailable ? "Available" : "Not Available"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Created On</span>
            <p className="font-semibold">{new Date(course.createdAt).toDateString()}</p>
          </div>
        </div>
      </div>

      {/* Sections and Videos */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Course Content</h2>
        {course.sections.map((section, index) => (
          <div key={section._id} className="mb-8 border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold">{index + 1}. {section.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{section.description}</p>
            {section.videos.length > 0 ? (
              <ul className="space-y-2">
                {section.videos.map((video, idx) => (
                  <li key={idx}>
                    <a
                      href={`http://localhost:3020/api${video}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ▶ Lecture {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No videos uploaded.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
