import React, { useState } from 'react';

interface SettingsProps {
  setWorkTime: (time: number) => void;
  setBreakTime: (time: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ setWorkTime, setBreakTime }) => {
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);

  const handleSave = () => {
    setWorkTime(workMinutes * 60);
    setBreakTime(breakMinutes * 60);
  };

  return (
    <div>
      <label>
        Work Minutes:
        <input type="number" value={workMinutes} onChange={(e) => setWorkMinutes(Number(e.target.value))} />
      </label>
      <label>
        Break Minutes:
        <input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
