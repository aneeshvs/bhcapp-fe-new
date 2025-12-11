'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { index } from '@/src/services/crud';
import FieldActivityLog from '@/src/components/FieldActivityLog';

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

export default function FieldLogsPage() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  const table = searchParams.get('table');
  const field = searchParams.get('field');
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await index<ActivityLogType[]>('logs/view', { 
          uuid,
          table,
          field
        });
        setLogs(response.data || []);
      } catch (error) {
        console.error('Error fetching field logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (uuid && table && field) {
      fetchLogs();
    }
  }, [uuid, table, field]);

  if (!table || !field) {
    return <div className="p-4">Invalid parameters</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Activity Logs for {field.replace(/_/g, ' ')} in {table.replace(/_/g, ' ')}
        </h1>
        <button 
          onClick={() => window.history.back()}
          className="btn-primary text-white font-medium py-2 px-4 rounded"
        >
          Back to Form
        </button>
      </div>
      
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <FieldActivityLog logs={logs} table={table} field={field} />
      )}
    </div>
  );
}