'use client';
import React, { useEffect, useState } from 'react';
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

interface FieldLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  uuid: string | null;
  table: string | null;
  field: string | null;
  url: string;
  customValueFormatter?: (value: unknown, field: string) => React.ReactNode;
}

export default function FieldLogsModal({
  isOpen,
  onClose,
  uuid,
  table,
  field,
  url,
  customValueFormatter,
}: FieldLogsModalProps) {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch logs only when valid
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await index<ActivityLogType[]>(url, {
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

    if (!isOpen) return;

    if (!uuid) {
      // No UUID → no API call
      setLogs([]);
      setLoading(false);
      return;
    }

    fetchLogs();
  }, [isOpen, uuid, table, field, url]);

  if (!isOpen) return null;

  // Show invalid parameters message
  if (!table || !field) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 max-w-lg w-full">
          <p className="text-gray-800">Invalid parameters</p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Activity Logs for{' '}
            <span className="font-bold">{field.replace(/_/g, ' ')}</span> in{' '}
            <span className="font-bold">{table.replace(/_/g, ' ')}</span>
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="bg-gray-50 p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-gray-500">
              No activity logs found for {field.replace(/_/g, ' ')}
            </p>
          ) : (
            <FieldActivityLog 
              logs={logs} 
              table={table} 
              field={field}
              customValueFormatter={customValueFormatter}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 btn-primary btn-primary:hover text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}