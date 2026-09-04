import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Welcome to EduVerse AI</h2>
        <button onClick={() => navigate('/dashboard')} className="py-3 px-6 bg-indigo-700 text-white rounded-xl text-xs font-bold">Start Learning</button>
      </div>
    </div>
  );
};

export default Onboarding;
