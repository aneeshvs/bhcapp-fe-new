"use client";
import React from 'react';

type ActivityLogProps = {
  logs: any[];
};

export default function ActivityLog({ logs }: ActivityLogProps) {
  if (!logs || logs.length === 0) {
    return <p className="text-gray-500 p-4">No activity logs found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4">Form Activity History</h2>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="border-b pb-3 text-sm">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>{log.description}</span>
              <span className="text-slate-500 font-normal">{log.created_at}</span>
            </div>
            {log.staff_name && (
              <p className="text-xs text-blue-600 font-medium">By: {log.staff_name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
