'use client';

import { useState } from 'react';
import { ProcurementRequest } from '../../lib/types/procurement';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getCategoryForCommodityGroup, getCategoryColors, categories } from '../../lib/utils/commodity-groups';
import { ConfirmationDialog } from '../ui/confirmation-dialog';

interface RequestListProps {
    requests: ProcurementRequest[];
    onStatusChange: (requestId: string, newStatus: string) => Promise<void>;
    onDelete: (requestId: string) => Promise<void>;
}

export function RequestList({ requests, onStatusChange, onDelete }: RequestListProps) {
    const [sortField, setSortField] = useState<keyof ProcurementRequest>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; requestId: string | null; requestTitle: string }>({
        isOpen: false,
        requestId: null,
        requestTitle: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter requests based on status and category
    const filteredRequests = requests.filter(request => {
        const statusMatch = filterStatus === 'all' || request.status === filterStatus;
        const categoryMatch = filterCategory === 'all' || 
            getCategoryForCommodityGroup(request.commodity_group) === filterCategory;
        return statusMatch && categoryMatch;
    });

    // Sort requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
    });

    const handleSort = (field: keyof ProcurementRequest) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'default';
            case 'IN_PROGRESS':
                return 'secondary';
            case 'CLOSED':
                return 'outline';
            default:
                return 'default';
        }
    };

    const handleDeleteClick = (requestId: string, requestTitle: string) => {
        setDeleteDialog({
            isOpen: true,
            requestId,
            requestTitle
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.requestId) return;
        
        setIsDeleting(true);
        try {
            await onDelete(deleteDialog.requestId);
            setDeleteDialog({ isOpen: false, requestId: null, requestTitle: '' });
        } catch (error) {
            console.error('Failed to delete request:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, requestId: null, requestTitle: '' });
    };

    return (
        <div className="space-y-4">
            {/* Filters and Controls */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Filter by Status:</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Filter by Category:</label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Showing {sortedRequests.length} of {requests.length} requests
                </div>
            </div>

            {/* Category Legend */}
            <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category Color Guide</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => {
                        const colors = getCategoryColors(category);
                        return (
                            <div key={category} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                                {category}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('title')}
                            >
                                Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('requestor_name')}
                            >
                                Requestor {sortField === 'requestor_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('vendor_name')}
                            >
                                Vendor {sortField === 'vendor_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('department')}
                            >
                                Department {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('commodity_group')}
                            >
                                Commodity Group {sortField === 'commodity_group' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50 text-right"
                                onClick={() => handleSort('total_cost')}
                            >
                                Total Cost {sortField === 'total_cost' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('created_at')}
                            >
                                Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedRequests.map((request) => {
                                const category = getCategoryForCommodityGroup(request.commodity_group);
                                const colors = getCategoryColors(category || '');
                                
                                return (
                                <TableRow key={request._id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                        {request.title}
                                    </TableCell>
                                    <TableCell>{request.requestor_name}</TableCell>
                                    <TableCell>{request.vendor_name}</TableCell>
                                    <TableCell>{request.department}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                                                {request.commodity_group}
                                            </div>
                                            {category && (
                                                <div className="text-xs text-gray-500">
                                                    {category}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        €{request.total_cost.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(request.status)}>
                                            {request.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {formatDate(request.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Select
                                                value={request.status}
                                                onValueChange={(value) => onStatusChange(request._id!, value)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="OPEN">Open</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteClick(request._id!, request.title)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Request"
                message={`Are you sure you want to delete "${deleteDialog.requestTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </div>
    );
} 