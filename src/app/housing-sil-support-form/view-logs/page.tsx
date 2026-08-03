// pages/activity-logs.js
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import ActivityLog from '@/src/components/HousingSilSupport/ActivityLog';
import { index } from '@/src/services/crud';
import { useSearchParams } from 'next/navigation';

type ActivityLogType = {
  id: number;
  log_name: string;
  description: string;
  causer_id?: number;
  created_at?: string;
  properties?: {
    user_id?: number;
    staff_id?: number;
    attributes?: Record<string, unknown>;
    old?: Record<string, unknown>;
  };
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await index<ActivityLogType[]>('housing-sil-support/logs', uuid ? { uuid } : {});
        console.log('Fetched logs:', response.data);
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
        {loading && <p>Loading...</p>}
        <ActivityLog logs={logs} />
    </div>
  );
}
