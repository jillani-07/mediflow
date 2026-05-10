import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { patientsApi } from '../../api/patients.api';
import { appointmentsApi } from '../../api/appointments.api';
import { AppointmentStatus } from '../../types';

const StatCard = ({
  label, value, icon: Icon, color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { data: patients } = useQuery({
    queryKey: ['patients', 1, 1],
    queryFn: () => patientsApi.getAll(1, 1),
  });

  const { data: scheduled } = useQuery({
    queryKey: ['appointments', 'scheduled'],
    queryFn: () => appointmentsApi.getAll(1, 1, AppointmentStatus.SCHEDULED),
  });

  const { data: completed } = useQuery({
    queryKey: ['appointments', 'completed'],
    queryFn: () => appointmentsApi.getAll(1, 1, AppointmentStatus.COMPLETED),
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Total Patients"
          value={patients?.total ?? '—'}
          icon={Users}
          color="bg-primary-600"
        />
        <StatCard
          label="Scheduled"
          value={scheduled?.total ?? '—'}
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          label="Completed"
          value={completed?.total ?? '—'}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>
    </div>
  );
};