import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

const Analytics: React.FC = () => {
  // Placeholder for analytics data
  const [completedSessions, setCompletedSessions] = useState<number>(10); // Example data
  const [totalFocusTime, setTotalFocusTime] = useState<number>(300); // in minutes, example data
  const [breakTime, setBreakTime] = useState<number>(60); // in minutes, example data

  return (
    <div>
      <h2>Analytics</h2>
      <div>
        <FontAwesomeIcon icon={faChartBar} size="2x" />
        <span> Completed Sessions: {completedSessions}</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faChartLine} size="2x" />
        <span> Total Focus Time: {totalFocusTime} minutes</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faChartPie} size="2x" />
        <span> Break Time: {breakTime} minutes</span>
      </div>
    </div>
  );
};

export default Analytics;
