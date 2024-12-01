import React from "react";

interface ProgressBarProps {
  progress: number; // Progress percentage (0 to 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex items-center my-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 flex-grow">
        <div
          className="bg-purple-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* Percentage */}
      <span className="ml-4 text-sm text-gray-600">{progress}%</span>
    </div>
  );
};

export default ProgressBar;
