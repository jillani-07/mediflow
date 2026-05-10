import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { appointmentsApi } from '../../api/appointments.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', page],
    queryFn: () => appointmentsApi.getAll(page, limit),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
        <Button onClick={() => navigate('/appointments/new')}>
          <Plus size={16} /> Schedule
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Patient', 'Doctor', 'Scheduled At', 'Duration', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : data?.data.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.patient.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{a.doctor.fullName}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(a.scheduledAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">{a.duration} min</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm"
                    onClick={() => navigate(`/appointments/${a.id}`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data && data.total > limit && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="secondary" size="sm"
                disabled={page * limit >= data.total}
                onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};