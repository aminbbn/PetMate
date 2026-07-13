import React from 'react';
import ReminderPage from './reminders/ReminderPage';

export default function Reminders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFB] via-[#FFF9F6] to-[#FFF3EE] bg-dot-grid p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
      {/* Warm ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coral rounded-full blur-[140px] pointer-events-none z-0" style={{ opacity: 0.03 }} />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sunny rounded-full blur-[120px] pointer-events-none z-0" style={{ opacity: 0.03 }} />
      
      <ReminderPage />
    </div>
  );
}
