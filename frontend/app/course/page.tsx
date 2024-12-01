"use client";

import { useEffect, useState } from "react";
import api from "../api/axios";
import NotesSection from "./NotesSection/NotesSection";
import ProgressBar from "./ProgressBar";
import Sidebar from "./SidebarSection/Sidebar";
import VideoPlayer from "./VideoPlayerSection/VideoPlayer";

const CoursePage: React.FC = () => {
  const courseId = "C001"; // Current course identifier
  const userId = "U001"; // Current user identifier

  // State to store course data
  const [course, setCourse] = useState<any>(null);

  // State to store user-specific content completion statuses
  const [userCourseStatuses, setUserCourseStatuses] = useState<any[]>([]);

  // State to track the currently selected content
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );

  // State to manage forced re-renders of the Sidebar
  const [sidebarKey, setSidebarKey] = useState<number>(0);

  // State to indicate whether data is still loading
  const [loading, setLoading] = useState(true);

  // Fetch course and user-specific data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);

        // Fetch user-specific content completion statuses
        const userCourseResponse = await api.get(
          `/user-courses/${userId}/${courseId}/contents`
        );
        setUserCourseStatuses(userCourseResponse.data);

        // Automatically select the first content from the first topic
        const firstParent = courseResponse.data.parentTopics[0];
        if (firstParent && firstParent.contents.length > 0) {
          const firstContent = firstParent.contents[0];
          const contentStatus = getContentStatus(
            userCourseResponse.data,
            firstParent.parentId,
            firstContent.contentId
          );

          setSelectedContent({
            ...firstContent,
            parentTopic: firstParent.parentId,
            status: contentStatus,
          });
          setSelectedContentId(firstContent.contentId);
        }

        setLoading(false); // Data loaded, hide loader
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [courseId, userId]);

  // Retrieve the completion status of a specific content
  const getContentStatus = (
    statuses: any[],
    parentTopicId: string,
    contentId: string
  ): string => {
    const parentTopic = statuses.find(
      (topic) => topic.parentTopicId === parentTopicId
    );
    if (parentTopic) {
      const content = parentTopic.contents.find(
        (item: any) => item.contentId === contentId
      );
      return content ? content.status : "Not Completed";
    }
    return "Not Completed"; // Default status if no match found
  };

  // Refresh user-specific content statuses and re-render the Sidebar
  const refreshSidebar = async () => {
    try {
      const response = await api.get(
        `/user-courses/${userId}/${courseId}/contents`
      );
      setUserCourseStatuses(response.data);
      setSidebarKey((prevKey) => prevKey + 1); // Trigger Sidebar re-render
    } catch (error) {
      console.error("Error refreshing content statuses:", error);
    }
  };

  // Handle user selection of a specific content
  const handleContentSelect = (content: any, parentTopicId: string) => {
    const contentStatus = getContentStatus(
      userCourseStatuses,
      parentTopicId,
      content.contentId
    );

    setSelectedContent({
      ...content,
      parentTopic: parentTopicId,
      status: contentStatus,
    });
    setSelectedContentId(content.contentId);
  };

  // Calculate overall progress percentage based on completed content
  const calculateProgress = (): number => {
    if (!userCourseStatuses || userCourseStatuses.length === 0) {
      return 0; // No data, no progress
    }

    const totalContents = userCourseStatuses.reduce(
      (total, parent) => total + parent.contents.length,
      0
    );
    const completedContents = userCourseStatuses.reduce(
      (completed, parent) =>
        completed +
        parent.contents.filter((content: any) => content.status === "Completed")
          .length,
      0
    );

    return totalContents > 0
      ? Math.round((completedContents / totalContents) * 100)
      : 0;
  };

  if (loading) return <p>Loading...</p>; // Show loading message while data is being fetched

  return (
    <div className="flex flex-col h-full lg:flex-row">
      {/* Main Content Area */}
      <div className="flex-grow p-4">
        {/* Course Title */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{course.title}</h2>
          <p className="text-sm text-gray-500">My Course / {course.category}</p>
        </div>

        {/* Video Player Section */}
        {selectedContent ? (
          <VideoPlayer
            selectedContent={selectedContent}
            userId={userId}
            courseId={courseId}
            parentTopics={course.parentTopics}
            onContentSelect={handleContentSelect}
            refreshSidebar={refreshSidebar}
          />
        ) : (
          <p>Please select a content to view</p>
        )}

        {/* Notes Section */}
        <NotesSection
          courseId={courseId}
          userId={userId}
          notes={course.notes}
        />
      </div>

      {/* Sidebar Section */}
      <div className={`w-full lg:w-1/4 bg-gray-100 p-4`}>
        {/* Course Name */}
        <p className="text-3xl font-semibold mb-2">{course.title}</p>

        {/* Progress Indicator */}
        <ProgressBar progress={calculateProgress()} />

        {/* Sidebar Navigation */}
        <Sidebar
          key={sidebarKey}
          courseId={courseId}
          userId={userId}
          onContentSelect={handleContentSelect}
          selectedContentId={selectedContentId}
          setSelectedContentId={setSelectedContentId}
          userCourseStatuses={userCourseStatuses}
        />
      </div>
    </div>
  );
};

export default CoursePage;
