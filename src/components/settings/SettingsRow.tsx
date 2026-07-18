import React from 'react';

interface SettingsRowProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-300">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
            <Icon className="text-gray-400" size={16} />
          </div>
        )}
        <div className="space-y-0.5">
          <h4 className="text-sm font-black text-gray-800">{title}</h4>
          {description && (
            <p className="text-xs text-gray-400 font-bold leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0 mr-4 flex items-center justify-end">
        {children}
      </div>
    </div>
  );
};
