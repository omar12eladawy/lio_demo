'use client';

import { useState, useCallback } from 'react';
import { DocumentProcessingResult } from '../../lib/types/procurement';

interface DocumentUploadProps {
    onProcessed: (result: DocumentProcessingResult) => void;
}

export function DocumentUpload({ onProcessed }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const processFile = async (file: File) => {
        try {
            console.log('Starting file processing:', file.name, file.type, file.size);
            setIsUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);

            console.log('Sending request to /api/process-document');
            const response = await fetch('/api/process-document', {
                method: 'POST',
                body: formData,
            });

            console.log('Response received:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to process document: ${errorText}`);
            }

            const result = await response.json();
            console.log('Document processing result:', result);
            onProcessed(result);
        } catch (err) {
            console.error('Error in processFile:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        const file = files[0];
        
        if (!file) return;
        
        // Check file type
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            setError('Please upload a PDF, DOC, DOCX, or TXT file');
            return;
        }
        
        await processFile(file);
    }, []);

    return (
        <div className="space-y-4">
            <div
                className={`flex items-center justify-center w-full transition-colors duration-200 ${
                    isDragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label
                    htmlFor="document-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-sm text-gray-600">Processing document...</p>
                            </div>
                        ) : (
                            <>
                                <svg
                                    className={`w-12 h-12 mb-4 transition-colors ${
                                        isDragOver ? 'text-blue-500' : 'text-gray-400'
                                    }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        {isDragOver ? 'Drop your file here' : 'Click to upload'}
                                    </span>
                                    {!isDragOver && ' or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (MAX. 10MB)</p>
                            </>
                        )}
                    </div>
                    <input
                        id="document-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
} 