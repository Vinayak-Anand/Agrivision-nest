import React from "react";
import api from "../../api/axios";

interface VideoPlayerProps {
  selectedContent: {
    contentId: string;
    type: string; // "video" or "pdf"
    title: string;
    url: string;
    parentTopic: string; // Parent topic for API compatibility
    status: string; // Current status: "Completed" or "Not Completed"
  } | null;
  userId: string;
  courseId: string;
  refreshSidebar: () => void; // Callback to refresh the Sidebar after updating status
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  selectedContent,
  userId,
  courseId,
  refreshSidebar,
}) => {
  if (!selectedContent) {
    return <p>Please select a content to view.</p>;
  }

  const { url, title, type, contentId, parentTopic, status } = selectedContent;

  const handleMarkStatus = async (newStatus: string) => {
    try {
      await api.put(`/user-courses/${userId}/${courseId}/content-status`, {
        parentTopicId: parentTopic,
        contentId,
        status: newStatus,
      });
      refreshSidebar(); // Refresh the Sidebar to show the updated status
      alert(`Content marked as ${newStatus}!`);
    } catch (error) {
      console.error(`Error updating content status to ${newStatus}:`, error);
      alert(`Failed to mark content as ${newStatus}. Please try again.`);
    }
  };

  return (
    <div className="video-player-section h-[70%] mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex space-x-2">
          {status === "Not Completed" ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleMarkStatus("Completed")}
            >
              Mark as Complete
            </button>
          ) : (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleMarkStatus("Not Completed")}
            >
              Mark as Not Completed
            </button>
          )}
        </div>
      </div>
      {type === "video" ? (
        <video
          className="w-[80%] h-[90%] rounded-md border-2 border-black shadow-lg mx-auto mt-6"
          controls
          preload="metadata"
          src={url}
        >
          Your browser does not support the video tag.
        </video>
        ) : (
          <iframe
            className="w-[80%] h-[90%] rounded-md border-2 border-black shadow-lg mx-auto mt-6"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
            title={title}
          />
        )
      }
    </div>
  );
};

export default VideoPlayer;
