'use client';

import { useState, useEffect } from 'react';
import { RequestList } from '../components/procurement/RequestList';
import { ProcurementRequest } from '../lib/types/procurement';

export default function ProcurementPage() {
    const [requests, setRequests] = useState<ProcurementRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/requests');
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();
            console.log('Fetched requests:', data);
            setRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (requestId: string, newStatus: string) => {
        try {
            console.log('Updating status for request ID:', requestId, 'to status:', newStatus);
            const response = await fetch(`/api/requests/${requestId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            await fetchRequests();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (requestId: string) => {
        try {
            console.log('Deleting request ID:', requestId);
            const response = await fetch(`/api/requests/${requestId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete request');
            }

            await fetchRequests();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Procurement Overview</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                        Total Requests: {requests.length}
                    </span>
                    <button
                        onClick={fetchRequests}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg">
                    <RequestList
                        requests={requests}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
} 