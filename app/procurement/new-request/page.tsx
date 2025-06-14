'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestForm } from '../../components/procurement/RequestForm';
import { DocumentUpload } from '../../components/procurement/DocumentUpload';
import { DocumentProcessingResult } from '../../lib/types/procurement';

export default function NewRequestPage() {
    const router = useRouter();
    const [documentData, setDocumentData] = useState<DocumentProcessingResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDocumentProcessed = (result: DocumentProcessingResult) => {
        setDocumentData(result);
    };

    const handleSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            router.push('/procurement');
        } catch (error) {
            console.error('Error creating request:', error);
            alert('Failed to create request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New Procurement Request</h1>
                <p className="mt-2 text-gray-600">
                    Create a new procurement request by filling out the form below or uploading a document.
                </p>
            </div>

            <div className="space-y-8">
                {/* Document Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Upload Document (Optional)
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Upload a vendor offer document to automatically extract information and pre-fill the form.
                    </p>
                    <DocumentUpload onProcessed={handleDocumentProcessed} />
                    
                    {documentData && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">
                                ✓ Document processed successfully! The form below has been pre-filled with extracted data.
                            </p>
                        </div>
                    )}
                </div>

                {/* Request Form Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Request Details
                    </h2>
                    <RequestForm 
                        onSubmit={handleSubmit} 
                        initialData={documentData || undefined}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
} 