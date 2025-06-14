"use client"
import { useEffect, useState } from "react";
// dbounce from lodash
import { debounce, get } from "lodash";

import Link from 'next/link';

interface ProcurementRequest {
    _id?: string;
    requestor_name: string;
    title: string;
    vendor_name: string;
    vat_id: string;
    commodity_group: string;
    order_lines: any[];
    total_cost: number;
    department: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    created_at: string;
    updated_at: string;
}

export default function HomePage() {
    const [requests, setRequests] = useState<ProcurementRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/requests');
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate request counts
    const openRequests = requests.filter(req => req.status === 'OPEN').length;
    const closedRequests = requests.filter(req => req.status === 'CLOSED').length;
    const inProgressRequests = requests.filter(req => req.status === 'IN_PROGRESS').length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Procurement Management System
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Streamline your procurement process with our modern, efficient, and user-friendly platform.
                    </p>
                    <Link
                        href="/procurement"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                        View Procurement Overview
                    </Link>
                </div>
            </div>

            {/* Request Tracker Cards */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Current Status
                </h2>
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {/* Open Requests Card */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Open Requests</p>
                                    <p className="text-3xl font-bold text-blue-600">{openRequests}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* In Progress Requests Card */}
                         <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                             <div className="flex items-center">
                                 <div className="flex-1">
                                     <p className="text-sm font-medium text-gray-600">In Progress Requests</p>
                                     <p className="text-3xl font-bold text-yellow-600">{inProgressRequests}</p>
                                 </div>
                                 <div className="flex-shrink-0">
                                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                         <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                         </svg>
                                     </div>
                                 </div>
                             </div>
                         </div>

                        {/* Closed Requests Card */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Closed Requests</p>
                                    <p className="text-3xl font-bold text-green-600">{closedRequests}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

