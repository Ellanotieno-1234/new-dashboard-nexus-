'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { uploadInventoryFile, uploadOrdersFile, uploadMROFile } from '@/lib/api';

type UploadType = 'inventory' | 'orders' | 'mro';

interface FileUploaderProps {
  type: UploadType;
  onUploadSuccess?: () => void;
}

export function FileUploader({ type, onUploadSuccess }: FileUploaderProps) {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const file = acceptedFiles[0];
      let uploadFn = uploadInventoryFile; // Default to inventory upload
      if (type === 'orders') {
        uploadFn = uploadOrdersFile;
      } else if (type === 'mro') {
        uploadFn = uploadMROFile;
      }
      
      if (!uploadFn) {
        throw new Error('No upload function defined for this type');
      }
      const result = await uploadFn(file);

      if (result.success) {
        setUploadSuccess(true);
        onUploadSuccess?.();
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [type, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
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
        <div className={`
          ${isDragActive ? 'text-cyan-400' : 'text-gray-400'}
          ${isUploading ? 'animate-pulse' : ''}
        `}>
          {/* Icon can be added here if needed */}
        </div>
        <div className="space-y-1">
          {isUploading ? (
            <p className="text-sm text-cyan-400">Uploading...</p>
          ) : uploadSuccess ? (
            <p className="text-sm text-green-400">Upload successful!</p>
          ) : uploadError ? (
            <p className="text-sm text-red-400">{uploadError}</p>
          ) : (
            <>
              <p className="text-sm text-gray-400">
                {isDragActive 
                  ? t('fileUpload.dropHere')
                  : t('fileUpload.dragAndDrop')
                }
              </p>
              <p className="text-xs text-gray-500">
                {t('fileUpload.formats')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
