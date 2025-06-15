'use client';

import { useState, useEffect } from 'react';
import { ProcurementRequest } from '../lib/types/procurement';
import { Badge } from '../components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
    const [requests, setRequests] = useState<ProcurementRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/requests');
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusCounts = () => {
        return {
            open: requests.filter(r => r.status === 'OPEN').length,
            inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
            closed: requests.filter(r => r.status === 'CLOSED').length,
            total: requests.length
        };
    };

    const getTotalValue = () => {
        return requests.reduce((sum, request) => sum + request.total_cost, 0);
    };

    const getRecentRequests = () => {
        return requests
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    };

    const statusCounts = getStatusCounts();
    const totalValue = getTotalValue();
    const recentRequests = getRecentRequests();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Overview of your procurement requests and activities.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Open Requests</p>
                            <p className="text-2xl font-bold text-gray-900">{statusCounts.open}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-gray-900">{statusCounts.inProgress}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">€{totalValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            href="/procurement/new"
                            className="flex items-center p-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                        >
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Create New Request</p>
                                <p className="text-sm text-gray-500">Submit a new procurement request</p>
                            </div>
                        </Link>
                        <Link
                            href="/procurement"
                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">View All Requests</p>
                                <p className="text-sm text-gray-500">Manage and track requests</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Open Requests</span>
                            <Badge variant="default">{statusCounts.open}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">In Progress</span>
                            <Badge variant="secondary">{statusCounts.inProgress}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Closed</span>
                            <Badge variant="outline">{statusCounts.closed}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
                        <Link
                            href="/procurement"
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                            View all →
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {recentRequests.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No requests found</p>
                    ) : (
                        <div className="space-y-4">
                            {recentRequests.map((request) => (
                                <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{request.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {request.vendor_name} • {request.department}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="font-mono text-sm">€{request.total_cost.toLocaleString()}</span>
                                        <Badge variant={
                                            request.status === 'OPEN' ? 'default' :
                                            request.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                                        }>
                                            {request.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 