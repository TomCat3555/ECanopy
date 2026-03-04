import { useState, useEffect } from 'react';
import { visitorService } from '../services/visitorService';

export default function VisitorStatusBadge({ visitor, onUpdate }) {
    const [status, setStatus] = useState(visitor.status);

    useEffect(() => {
        let interval;
        if (visitor.logId && status === 'PENDING') {
            interval = setInterval(async () => {
                try {
                    const log = await visitorService.getVisitorLog(visitor.logId);
                    if (log.status !== 'PENDING') {
                        setStatus(log.status); // APPROVED or REJECTED
                        clearInterval(interval);
                        if (onUpdate) onUpdate(log);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [visitor.logId, status, onUpdate]);

    const getBadgeStyle = (s) => {
        switch (s) {
            case 'APPROVED':
            case 'CHECKED_IN':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 animate-pulse';
            case 'REJECTED':
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'CHECKED_OUT':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (s) => {
        if (s === 'PENDING') return 'Waiting Approval...';
        return s.replace('_', ' ');
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeStyle(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
}
