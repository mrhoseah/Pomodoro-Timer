import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

const Analytics: React.FC = () => {
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0); // in minutes
  const [breakTime, setBreakTime] = useState<number>(0); // in minutes

  useEffect(() => {
    // Fetch data from local storage or API
    const completed = localStorage.getItem('completedSessions');
    const focusTime = localStorage.getItem('totalFocusTime');
    const breakDuration = localStorage.getItem('breakTime');

    if (completed) setCompletedSessions(Number(completed));
    if (focusTime) setTotalFocusTime(Number(focusTime));
    if (breakDuration) setBreakTime(Number(breakDuration));
  }, []);

  useEffect(() => {
    // Update local storage whenever the state changes
    localStorage.setItem('completedSessions', completedSessions.toString());
    localStorage.setItem('totalFocusTime', totalFocusTime.toString());
    localStorage.setItem('breakTime', breakTime.toString());
  }, [completedSessions, totalFocusTime, breakTime]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartBar} size="2x" />
        <span> Completed Sessions: {completedSessions}</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartLine} size="2x" />
        <span> Total Focus Time: {totalFocusTime} minutes</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartPie} size="2x" />
        <span> Break Time: {breakTime} minutes</span>
      </div>
    </div>
  );
};

export default Analytics;
