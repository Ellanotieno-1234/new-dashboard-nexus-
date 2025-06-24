'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function FileUploader() {
  const { t } = useLanguage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload logic here
    console.log('Accepted files:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-cyan-500 bg-cyan-500/10' 
          : 'border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className={isDragActive ? 'text-cyan-400' : 'text-gray-400'}>
          {/* Icon can be added here if needed */}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">
            {isDragActive 
              ? t('fileUpload.dropHere')
              : t('fileUpload.dragAndDrop')
            }
          </p>
          <p className="text-xs text-gray-500">
            {t('fileUpload.formats')}
          </p>
        </div>
      </div>
    </div>
  );
}
