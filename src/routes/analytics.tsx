import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const Analytics: React.FC = () => {
  const completedSessions = useSelector((state: RootState) => state.analytics.completedSessions);
  const totalFocusTime = useSelector((state: RootState) => state.analytics.totalFocusTime);
  const breakTime = useSelector((state: RootState) => state.analytics.breakTime);
  const incompleteSessions = useSelector((state: RootState) => state.analytics.incompleteSessions);

const performancePercentage = (completedSessions + incompleteSessions) === 0 ?
 0 : ((completedSessions / (completedSessions + incompleteSessions)) * 100).toFixed();
;  // Helper function to format time in a human-readable way

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartBar} size="2x" />
        <span> Completed Sessions: {completedSessions}</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartLine} size="2x" />
        <span> Total Focus Time: {moment(totalFocusTime).minutes()} minutes</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartPie} size="2x" />
        <span> Break Time: {moment(breakTime).minutes()} minutes</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartBar} size="2x" />
        <span> Incomplete Sessions: {incompleteSessions}</span>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faChartPie} size="2x" />
        <span> Performance Percentage: {Number(performancePercentage)}%</span>
      </div>
    </div>
  );
};

export default Analytics;
