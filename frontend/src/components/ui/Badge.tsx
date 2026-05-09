import React from 'react';
import { AppointmentStatus } from '../../types';

const statusStyles: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show:   'bg-yellow-100 text-yellow-700',
};

interface BadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
    {status.replace('_', ' ')}
  </span>
);