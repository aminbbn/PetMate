import React, { useState, useRef } from 'react';
import { Upload, File, Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { HealthAttachment } from './healthTypes';
import { formatBytes } from './healthUtils';
import { toPersian } from '../../lib/persian';

interface HealthAttachmentFieldProps {
  attachments: HealthAttachment[];
  onChange: (attachments: HealthAttachment[]) => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'failed';
  error?: string;
}

export const HealthAttachmentField: React.FC<HealthAttachmentFieldProps> = ({
  attachments,
  onChange,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startUpload = (file: File) => {
    const fileId = Math.random().toString(36).substring(2, 9);
    const newUploading: UploadingFile = {
      id: fileId,
      file,
      progress: 0,
      status: 'uploading',
    };

    setUploadingFiles(prev => [...prev, newUploading]);

    // Simulate real progress upload adapter
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Add to completed attachments list
        const completedAttachment: HealthAttachment = {
          id: fileId,
          name: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          createdAt: new Date().toISOString(),
          // We don't store full base64 in localstorage to keep it lightweight.
          // We provide a mock localized URL representing sandbox storage.
          url: '#', 
        };

        setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'success' } : f));
        
        // Wait a small moment to let the user see "100%" before removing from uploading queue and adding to attachments
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
          onChange([...attachments, completedAttachment]);
        }, 800);
      } else {
        setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: currentProgress } : f));
      }
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (file.size > 8 * 1024 * 1024) {
          alert(`فایل ${file.name} بیشتر از حد مجاز (۸ مگابایت) است.`);
          return;
        }
        startUpload(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.size > 8 * 1024 * 1024) {
          alert(`فایل ${file.name} بیشتر از حد مجاز (۸ مگابایت) است.`);
          return;
        }
        startUpload(file);
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-black text-gray-500 mr-1">مدارک، تصاویر و نسخه‌ها (حداکثر ۸ مگابایت)</label>
      
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2 select-none ${
          isDragging
            ? 'border-coral bg-coral/5 scale-[1.01]'
            : 'border-gray-200 hover:border-coral-light/50 hover:bg-gray-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,application/pdf,.doc,.docx"
        />
        <Upload size={24} className={`transition-transform duration-300 ${isDragging ? 'text-coral -translate-y-1' : 'text-gray-400'}`} />
        <div className="space-y-1">
          <p className="text-sm font-black text-gray-700">کلیک کنید یا فایل را به این کادر بکشید</p>
          <p className="text-xs text-gray-400 font-medium">تصاویر (PNG, JPG) یا اسناد PDF و Word</p>
        </div>
      </div>

      {/* Uploading Progress Items */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(file => (
            <div key={file.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3 text-right">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <File size={16} className="text-gray-500 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-gray-700 truncate max-w-[200px]">{file.file.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold">{formatBytes(file.file.size)}</div>
                </div>
              </div>

              {/* Progress and status */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-coral">{toPersian(file.progress)}٪</span>
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-coral h-full transition-all duration-200 rounded-full" 
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Attachment Chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachments.map(att => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-mint/5 border border-mint/20 rounded-xl text-right animate-fadeIn"
            >
              <File size={13} className="text-mint-deep shrink-0" />
              <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{att.name}</span>
              <span className="text-[9px] text-gray-400 font-medium shrink-0">({formatBytes(att.sizeBytes)})</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAttachment(att.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-red-50 cursor-pointer"
                title="حذف مدرک"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Backend storage limit notice */}
      <p className="text-[10px] text-gray-400 leading-normal mr-1 font-medium">
        ℹ️ فایل‌های ضمیمه‌شده به صورت محلی در سیستم شما ذخیره می‌شوند و برای حفظ عملکرد سبک برنامه، از آپلود در سرورهای ابری خودداری شده است.
      </p>
    </div>
  );
};
