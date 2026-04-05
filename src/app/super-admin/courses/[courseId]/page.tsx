"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCourseDetails } from "@/app/service/course-provider-service";
import { getAssetUrl } from "@/app/utils/asset-url";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { PiMedalLight } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: { name: string };
  subcategory: { name: string };
  topic: { name: string };
  level: string;
  language: string;
  duration: number;
  thumbnail: string;
  previewVideo: string | null;
  certificateAvailable: boolean;
  createdAt: string;
  courseProvider: { name: string; email: string; contact: string };
  sections?: {
    title: string;
    description: string;
    videos: string[];
  }[];
}

export default function CourseDetails() {
  const params = useParams();
  const courseId = params?.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError("Course ID not found");
        setLoading(false);
        return;
      }
      try {
        const data = await getCourseDetails(courseId as string);
        setCourse(data as any);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading) return <p className="text-blue-600 text-center text-lg mt-10">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!course) return <p className="text-gray-600 text-center mt-10">No course found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      {/* Thumbnail with Preview */}
      <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
        <Image
          src={getAssetUrl(course.thumbnail)}
          alt="Course thumbnail"
          layout="fill"
          objectFit="cover"
        />
        {course.previewVideo && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <a
              href={getAssetUrl(course.previewVideo)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-5 py-3 rounded-full flex items-center gap-3 hover:bg-purple-700 transition-transform duration-200"
            >
              <PlayCircle className="w-6 h-6" />
              Watch Preview
            </a>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10 text-white">
          <PiMedalLight size={40} />
        </div>
      </div>

      {/* Title and Description */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-700 mt-3 text-md leading-relaxed">{course.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-gray-700">
        <MetaItem label="Level" value={course.level} />
        <MetaItem label="Language" value={course.language} />
        <MetaItem label="Duration" value={`${course.duration} hrs`} />
        <MetaItem label="Category" value={course.category?.name} />
        <MetaItem label="Subcategory" value={course.subcategory?.name} />
        <MetaItem label="Topic" value={course.topic?.name} />
        <MetaItem
          label="Certificate"
          value={course.certificateAvailable ? "Available" : "Not Available"}
          color={course.certificateAvailable ? "text-green-600" : "text-red-500"}
        />
        <MetaItem label="Created On" value={new Date(course.createdAt).toLocaleDateString()} />
      </div>

      {/* Provider */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Course Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{course.courseProvider.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{course.courseProvider.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{course.courseProvider.contact}</p>
          </div>
        </div>
      </div>

      {/* Course Sections */}
      {course.sections && course.sections.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h3>
          <div className="space-y-6">
            {course.sections.map((section, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                <h4 className="text-lg font-semibold text-purple-700">{section.title}</h4>
                <p className="text-gray-600 mt-2">{section.description}</p>
                <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-1">
                  {section.videos.map((video, i) => (
                    <li key={i}>
                      <a
                        href={getAssetUrl(video)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Video {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MetaItem = ({ label, value, color = "text-gray-800" }: { label: string; value: string; color?: string }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-medium ${color}`}>{value}</p>
  </div>
);
