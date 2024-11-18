import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { setWorkMinutes, setBreakMinutes } from '@/features/settings/settingsSlice';
import { Input } from '@/components/ui/input';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setWorkMinutes(Number(e.target.value)));
  };

  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBreakMinutes(Number(e.target.value)));
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
          onChange={handleWorkMinutesChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Break Minutes:</label>
        <Input
          type="number"
          value={breakMinutes}
          onChange={handleBreakMinutesChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default Settings;
