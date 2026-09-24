"use client";
import React, { useEffect, useState, Suspense } from 'react';
import ActivityLog from '@/src/components/MedicineAdministrationConsent/ActivityLog';
import { index } from '@/src/services/crud';
import { useSearchParams } from 'next/navigation';
import { IconLoader } from '@tabler/icons-react';

function ActivityLogsPageContent() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await index<any[]>('medicine-administration-consent/logs', uuid ? { uuid } : {});
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
      {loading ? (
        <div className="p-8 text-center"><IconLoader className="animate-spin mx-auto" size={32} /></div>
      ) : (
        <ActivityLog logs={logs} />
      )}
    </div>
  );
}

export default function ActivityLogsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><IconLoader className="animate-spin mx-auto" size={32} /></div>}>
      <ActivityLogsPageContent />
    </Suspense>
  );
}
