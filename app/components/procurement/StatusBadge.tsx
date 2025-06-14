interface StatusBadgeProps {
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

const statusStyles = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-green-100 text-green-800',
};

const statusLabels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    CLOSED: 'Closed',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
} 