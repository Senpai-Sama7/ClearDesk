import type { UploadProgress } from '../types/document';

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(new Error(`Failed to read file: ${e}`));
    };
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(new Error(`Failed to read file: ${e}`));
    };
    reader.readAsDataURL(file);
  });
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as ArrayBuffer);
    };
    reader.onerror = (e) => {
      reject(new Error(`Failed to read file: ${e}`));
    };
    reader.readAsArrayBuffer(file);
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Text files
  if (fileType.startsWith('text/') || 
      fileName.endsWith('.txt') || 
      fileName.endsWith('.csv') ||
      fileName.endsWith('.json') ||
      fileName.endsWith('.md')) {
    return readFileAsText(file);
  }

  // PDF files - extract as text (in production, use pdf.js)
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // Mock PDF extraction for demo
    return `[PDF Document: ${file.name}]
File Size: ${(file.size / 1024).toFixed(2)} KB
Type: PDF Document

[Note: PDF text extraction would be performed here using pdf.js or similar library]
This is a simulated extraction for demonstration purposes.`;
  }

  // Image files - return placeholder
  if (fileType.startsWith('image/')) {
    return `[Image Document: ${file.name}]
File Size: ${(file.size / 1024).toFixed(2)} KB
Type: ${fileType}
Dimensions: Would be extracted via image processing

[Note: OCR text extraction would be performed here using Tesseract.js or similar]`;
  }

  // Word documents
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return `[Word Document: ${file.name}]
File Size: ${(file.size / 1024).toFixed(2)} KB
Type: Microsoft Word Document

[Note: DOCX text extraction would be performed here]`;
  }

  // Default
  return `[File: ${file.name}]
Type: ${fileType || 'Unknown'}
Size: ${(file.size / 1024).toFixed(2)} KB

Unable to extract text content from this file type.`;
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  const iconMap: Record<string, string> = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    txt: 'text',
    csv: 'spreadsheet',
    xls: 'spreadsheet',
    xlsx: 'spreadsheet',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
  };
  return iconMap[ext] || 'file';
}

export function isValidDocumentFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  const validExtensions = ['.pdf', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.doc', '.docx'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  return hasValidType || hasValidExtension;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function createUploadProgress(fileId: string, fileName: string): UploadProgress {
  return {
    fileId,
    fileName,
    progress: 0,
    status: 'uploading',
  };
}
