import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Input } from '@/components/ui/input';

const Settings: React.FC = () => {
  const [workMinutes, setWorkMinutes] = useLocalStorage<number>('workMinutes', 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage<number>('breakMinutes', 5);

  const handleSave = () => {
    setWorkMinutes(workMinutes);
    setBreakMinutes(breakMinutes);
  };

  useEffect(() => {
    document.title = `${workMinutes} minutes work, ${breakMinutes} minutes break`;
  }, [workMinutes, breakMinutes]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="block mb-2">Work Minutes:</label>
        <Input
          type="number"
          value={workMinutes}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Break Minutes:</label>
        <Input
          type="number"
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </div>
  );
};

export default Settings;
