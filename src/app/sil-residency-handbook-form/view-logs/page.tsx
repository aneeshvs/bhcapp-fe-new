'use client';
import React, { useEffect, useState } from 'react';
import ActivityLog from '@/src/components/SilResidencyHandbook/ActivityLog';
import { index } from '@/src/services/crud';
import { useSearchParams } from 'next/navigation';

type ActivityLogType = {
  id: number;
  log_name: string;
  description: string;
  causer_id?: number;
  created_at?: string;
  staff_id?: number;
  staff_name?: string;
  stafftype_name?: string;
  attributes?: Record<string, unknown> | Array<{ field: string; value: unknown }>;
  old?: Record<string, unknown> | Array<{ field: string; value: unknown }>;
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid') || searchParams.get('form-uuid');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await index<ActivityLogType[]>('sil-residency-handbook/logs', uuid ? { uuid } : {});
        setLogs(response.data || []);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [uuid]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {loading && <p className="text-center text-gray-500 mb-4">Loading activity logs...</p>}
      <ActivityLog logs={logs} />
    </div>
  );
}
