"use client";

import React, { useEffect, useState } from "react";
import { FaFilePdf, FaVideo } from "react-icons/fa";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import api from "../../api/axios";

interface Content {
  contentId: string;
  type: string; // "video" or "pdf"
  title: string;
}

interface ParentTopic {
  parentId: string;
  title: string;
  contents: Content[];
}

interface UserContentStatus {
  parentTopicId: string;
  contents: {
    contentId: string;
    status: string; // "Completed" or "Not Completed"
  }[];
}

interface SidebarProps {
  courseId: string;
  userId: string;
  onContentSelect: (content: Content) => void;
  selectedContentId: string | null; // Currently selected content
  setSelectedContentId: (id: string | null) => void; // Setter for selected content
}

const Sidebar: React.FC<SidebarProps> = ({
  courseId,
  userId,
  onContentSelect,
  selectedContentId,
  setSelectedContentId,
}) => {
  const [parentTopics, setParentTopics] = useState<ParentTopic[]>([]);
  const [userContentStatuses, setUserContentStatuses] = useState<
    UserContentStatus[]
  >([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Filters
  const [selectedFilter, setSelectedFilter] = useState("All"); // All, Completed, Not Completed
  const [contentTypeFilter, setContentTypeFilter] = useState("All"); // All, Video, PDF

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course data
        const courseResponse = await api.get(`/courses/${courseId}`);
        setParentTopics(courseResponse.data.parentTopics);

        // Fetch user completion data
        const userCourseResponse = await api.get(
          `/user-courses/${userId}/${courseId}/contents`
        );
        setUserContentStatuses(userCourseResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load course or user content statuses.");
      }
    };

    fetchData();
  }, [courseId, userId]);

  const toggleAccordion = (parentId: string) => {
    setOpenAccordion(openAccordion === parentId ? null : parentId);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContentId(content.contentId);
    onContentSelect(content);
  };

  const getContentStatus = (parentId: string, contentId: string): string => {
    const parentStatus = userContentStatuses.find(
      (status) => status.parentTopicId === parentId
    );
    if (parentStatus) {
      const contentStatus = parentStatus.contents.find(
        (content) => content.contentId === contentId
      );
      return contentStatus ? contentStatus.status : "Not Completed";
    }
    return "Not Completed"; // Default to "Not Completed"
  };

  const filterContents = (parentId: string, contents: Content[]): Content[] => {
    // Apply Content Type Filter (All, Video, PDF)
    let filteredContents = contents;
    if (contentTypeFilter !== "All") {
      filteredContents = contents.filter((content) => content.type === contentTypeFilter.toLowerCase());
    }

    // Apply Status Filter (All, Completed, Not Completed)
    switch (selectedFilter) {
      case "Completed":
        return filteredContents.filter(
          (content) =>
            getContentStatus(parentId, content.contentId) === "Completed"
        );
      case "Not Completed":
        return filteredContents.filter(
          (content) =>
            getContentStatus(parentId, content.contentId) === "Not Completed"
        );
      default: // All
        return filteredContents;
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="sidebar">
      {/* Filters */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-md">Filters</span>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setFiltersVisible(!filtersVisible)}
        >
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {filtersVisible && (
        <>
          {/* Content Type Filter */}
          <div className="mb-4">
            <button
              className={`px-3 py-1 mr-2 rounded ${
                contentTypeFilter === "All"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setContentTypeFilter("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 mr-2 rounded ${
                contentTypeFilter === "Video"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setContentTypeFilter("Video")}
            >
              Video
            </button>
            <button
              className={`px-3 py-1 rounded ${
                contentTypeFilter === "PDF"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setContentTypeFilter("PDF")}
            >
              PDF
            </button>
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <button
              className={`px-3 py-1 mr-2 rounded ${
                selectedFilter === "All"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 mr-2 rounded ${
                selectedFilter === "Completed"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("Completed")}
            >
              Completed
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedFilter === "Not Completed"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("Not Completed")}
            >
              Not Completed
            </button>
          </div>
        </>
      )}

      {/* Parent Topics and Contents */}
      {parentTopics.map((topic) => (
        <div key={topic.parentId} className="mb-4">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
            onClick={() => toggleAccordion(topic.parentId)}
          >
            <span className="font-bold">{topic.title}</span>
            <span
              className={`transform transition-transform ${
                openAccordion === topic.parentId ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          </div>

          {openAccordion === topic.parentId && (
            <ul className="pl-4 mt-2">
              {filterContents(topic.parentId, topic.contents).map((content) => (
                <li
                key={content.contentId}
                className={`flex items-center p-2 rounded mb-1 cursor-pointer ${
                  selectedContentId === content.contentId
                    ? "bg-purple-100 border-l-4 border-purple-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onContentSelect(content, topic.parentId)} // Pass parentTopicId
              >
                {/* Content Type Icon */}
                <span className="mr-2 text-lg">
                  {content.type === "video" ? (
                    <FaVideo className="text-purple-500" />
                  ) : (
                    <FaFilePdf className="text-red-500" />
                  )}
                </span>
                <span className="text-gray-800">{content.title}</span>
                {/* Content Status */}
                <span className="ml-auto text-sm">
                  {getContentStatus(topic.parentId, content.contentId) === "Completed" ? (
                    <MdCheckCircle className="text-green-500" />
                  ) : (
                    <MdRadioButtonUnchecked className="text-gray-400" />
                  )}
                </span>
              </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
