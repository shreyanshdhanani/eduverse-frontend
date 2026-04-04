"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GetCourseByIdService,
  AddCourseSectionService,
  UpdateCourseSectionService,
  DeleteCourseSectionService,
  AddVideoToSectionService, // Assume this service exists for adding video
} from "@/app/service/course-service";
import { Pencil, Trash2, Save, XCircle, VideoIcon } from "lucide-react";

interface Section {
  _id?: string;
  title: string;
  description: string;
  videos?: string[]; // Array of video URLs or IDs
}

interface Course {
  _id: string;
  title: string;
  description: string;
  sections: Section[];
}

export default function CourseSectionsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [newSection, setNewSection] = useState<Section>({ title: "", description: "" });
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false); // State to control video popup
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null); // Track which section the video is being added to
  const [newVideo, setNewVideo] = useState<File | null>(null); // For handling video file input

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await GetCourseByIdService(courseId);
        console.log('courseData', courseData)
        setCourse(courseData);
      } catch (err) {
        setError("Failed to fetch course details.");
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const handleAddSection = async () => {
    if (!newSection.title || !newSection.description) {
      setError("Both title and description are required.");
      return;
    }
    try {
      const updatedCourse = await AddCourseSectionService(courseId, newSection);
      setCourse(updatedCourse);
      setNewSection({ title: "", description: "" });
      setError(null);
    } catch {
      setError("Failed to add section.");
    }
  };

  const handleUpdateSection = async (sectionId: string, title: string, description: string) => {
    try {
      const updatedCourse = await UpdateCourseSectionService(courseId, sectionId, { title, description });
      setCourse(updatedCourse);
      setEditingSectionId(null);
    } catch {
      setError("Failed to update section.");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const updatedCourse = await DeleteCourseSectionService(courseId, sectionId);
      setCourse(updatedCourse);
    } catch {
      setError("Failed to delete section.");
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo) {
      setError("Please select a video file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", newVideo);

      const updatedCourse = await AddVideoToSectionService(courseId, selectedSectionId, formData);
      setCourse(updatedCourse);
      setShowVideoPopup(false);
      setNewVideo(null);
    } catch {
      setError("Failed to upload video.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">Manage Course Sections</h2>
      {error && <p className="text-red-500">{error}</p>}

      {course && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
          </div>

          {/* Add Section */}
          <div className="mb-6 flex items-center space-x-3">
            <input
              type="text"
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              placeholder="Section title"
              className="p-2 border rounded-md w-80"
            />
            <input
              type="text"
              value={newSection.description}
              onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
              placeholder="Section description"
              className="p-2 border rounded-md w-80"
            />
            <button onClick={handleAddSection} className="p-2 bg-purple-600 text-white rounded-md">
              Add Section
            </button>
          </div>

          {/* Display Sections */}
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(course.sections || []).map((section) => (
                section && (
                  <tr key={section._id} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      {editingSectionId === section._id ? (
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            setCourse((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    sections: prev.sections.map((s) =>
                                      s._id === section._id ? { ...s, title: e.target.value } : s
                                    ),
                                  }
                                : null
                            )
                          }
                          className="p-2 border rounded-md w-full"
                        />
                      ) : (
                        section.title
                      )}
                    </td>
                    <td className="p-3">
                      {editingSectionId === section._id ? (
                        <input
                          type="text"
                          value={section.description}
                          onChange={(e) =>
                            setCourse((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    sections: prev.sections.map((s) =>
                                      s._id === section._id ? { ...s, description: e.target.value } : s
                                    ),
                                  }
                                : null
                            )
                          }
                          className="p-2 border rounded-md w-full"
                        />
                      ) : (
                        section.description
                      )}
                    </td>
                    <td className="p-3 flex justify-center items-center space-x-6">
                      {editingSectionId === section._id ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateSection(section._id!, section.title, section.description)
                            }
                            className="text-green-600"
                          >
                            <Save />
                          </button>
                          <button onClick={() => setEditingSectionId(null)} className="text-orange-500">
                            <XCircle />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingSectionId(section._id!)} className="text-yellow-500">
                            <Pencil />
                          </button>
                          <button
                            onClick={() => {
                              setShowVideoPopup(true);
                              setSelectedSectionId(section._id!);
                            }}
                            className="text-black-500"
                          >
                            <VideoIcon />
                          </button>
                          <button onClick={() => handleDeleteSection(section._id!)} className="text-red-500">
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>

          {/* Video Upload Popup */}
          {showVideoPopup && selectedSectionId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 className="text-lg font-semibold mb-4">Add Video to Section</h3>
                <input
                  type="file"
                  onChange={(e) => setNewVideo(e.target.files ? e.target.files[0] : null)}
                  className="p-2 border rounded-md mb-4 w-full"
                />
                <button
                  onClick={handleAddVideo}
                  className="p-2 bg-blue-600 text-white rounded-md"
                >
                  Add Video
                </button>
                <button
                  onClick={() => setShowVideoPopup(false)}
                  className="p-2 bg-gray-600 text-white rounded-md mt-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
