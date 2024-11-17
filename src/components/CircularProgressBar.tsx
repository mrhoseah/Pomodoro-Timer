import React from 'react';
import './CircularProgressBar.css';

interface CircularProgressBarProps {
  size: number;
  progress: number;
  strokeWidth: number;
  children: React.ReactNode;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ size, progress, strokeWidth, children }) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="circle"
          stroke="#4caf50"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-xl font-bold">{children}</div>
    </div>
  );
};

export default CircularProgressBar;
