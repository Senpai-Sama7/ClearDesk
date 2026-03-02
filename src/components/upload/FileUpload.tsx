import { useCallback, useState, useRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { classNames, formatFileSize } from '../../utils/formatters';
import { isValidDocumentFile, extractTextFromFile } from '../../utils/fileProcessing';
import { claudeService } from '../../services/claudeService';
import { useDocuments } from '../../contexts/DocumentContext';
import { generateId } from '../../utils/formatters';
import type { Document } from '../../types/document';


interface UploadingFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDocument, updateDocument } = useDocuments();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = async (uploadingFile: UploadingFile) => {
    try {
      // Update status to uploading
      setUploadingFiles(prev =>
        prev.map(f => f.id === uploadingFile.id ? { ...f, status: 'uploading', progress: 30 } : f)
      );

      // Extract text content
      const content = await extractTextFromFile(uploadingFile.file);
      
      setUploadingFiles(prev =>
        prev.map(f => f.id === uploadingFile.id ? { ...f, status: 'processing', progress: 60 } : f)
      );

      // Create initial document
      const newDocument: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
        filename: uploadingFile.file.name,
        originalName: uploadingFile.file.name,
        type: 'other',
        status: 'processing',
        priority: 'medium',
        fileContent: content,
        isEscalated: false,
        tags: [],
      };

      // Add document to state
      const tempId = generateId();
      addDocument(newDocument);

      // Analyze with Claude
      const analysis = await claudeService.analyzeDocument(content, uploadingFile.file.name);

      // Update document with analysis results
      updateDocument(tempId, {
        type: analysis.documentType,
        priority: analysis.priority,
        status: analysis.requiresHumanReview ? 'review' : 'completed',
        extractedData: analysis.extractedData,
        escalationReasons: analysis.escalationReasons,
        isEscalated: analysis.requiresHumanReview,
        processedAt: new Date().toISOString(),
      });

      setUploadingFiles(prev =>
        prev.map(f => f.id === uploadingFile.id ? { ...f, status: 'completed', progress: 100 } : f)
      );

    } catch (error) {
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      id: generateId(),
      file,
      status: 'pending',
      progress: 0,
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Process each file
    newUploadingFiles.forEach(uploadingFile => {
      if (!isValidDocumentFile(uploadingFile.file)) {
        setUploadingFiles(prev =>
          prev.map(f =>
            f.id === uploadingFile.id
              ? { ...f, status: 'error', error: 'Invalid file type' }
              : f
          )
        );
        return;
      }

      processFile(uploadingFile);
    });
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={classNames(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className={classNames(
          'w-12 h-12 mx-auto mb-4',
          isDragging ? 'text-blue-500' : 'text-gray-400'
        )} />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, TXT, CSV, images (JPG, PNG), and Word documents
        </p>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {uploadingFiles.map((uploadingFile) => (
            <div key={uploadingFile.id} className="p-4 flex items-center space-x-4">
              <div className="flex-shrink-0">
                {uploadingFile.status === 'completed' ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : uploadingFile.status === 'error' ? (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <File className="w-8 h-8 text-blue-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadingFile.file.size)}
                </p>
                
                {/* Progress Bar */}
                {uploadingFile.status !== 'completed' && uploadingFile.status !== 'error' && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={classNames(
                          'h-full transition-all duration-300',
                          uploadingFile.status === 'processing' ? 'bg-purple-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadingFile.status === 'processing' ? 'AI analyzing document...' : 'Uploading...'}
                    </p>
                  </div>
                )}
                
                {uploadingFile.error && (
                  <p className="text-xs text-red-600 mt-1">{uploadingFile.error}</p>
                )}
              </div>

              <button
                onClick={() => removeFile(uploadingFile.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
