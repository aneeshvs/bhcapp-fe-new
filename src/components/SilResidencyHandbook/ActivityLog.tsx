'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFormSession } from "@/src/services/crud";
import { useSearchParams } from "next/navigation";

type LogEntry = {
  id: number;
  log_name: string;
  description: string;
  causer_id?: number;
  created_at?: string;
  user_id?: number | string;
  staff_id?: number;
  staff_name?: string;
  stafftype_name?: string;
  attributes?: Record<string, unknown> | Array<{ field: string; value: unknown }>;
  old?: Record<string, unknown> | Array<{ field: string; value: unknown }>;
};

type LogProps = {
  logs: LogEntry[];
};

const ActivityLog: React.FC<LogProps> = ({ logs }) => {
  const isBase64Image = (value: unknown): value is string => {
    return typeof value === 'string' && value.startsWith('data:image');
  };

  const formatValue = (value: unknown): React.ReactNode => {
    if (isBase64Image(value)) {
      return (
        <div className="flex flex-col items-start gap-2">
          <div className="w-64 h-32 border rounded overflow-hidden relative">
            <Image 
              src={value} 
              alt="Signature" 
              fill
              className="object-contain"
              sizes="128px"
            />
          </div>
          <span className="text-xs text-gray-500">Signature Image</span>
        </div>
      );
    }
    return String(value ?? '');
  };

  const formatOldValue = (value: unknown): string => {
    if (isBase64Image(value)) {
      return 'Signature Image';
    }
    return String(value ?? '');
  };

  const normalizeFields = (data: unknown): Record<string, unknown> => {
    if (!data) return {};
    if (Array.isArray(data)) {
      const obj: Record<string, unknown> = {};
      data.forEach((item) => {
        if (item && typeof item === 'object' && 'field' in item && 'value' in item) {
          obj[String(item.field)] = item.value;
        }
      });
      return obj;
    }
    if (typeof data === 'object') {
      return data as Record<string, unknown>;
    }
    return {};
  };

  const searchParams = useSearchParams();
  const [flag, setFlag] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const form = "sil-residency-handbook";
        const formUuid = searchParams.get("form-uuid") || searchParams.get("uuid");

        try {
          const { token } = await getFormSession(form, formUuid);
          if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ type: "client" }));
          }
        } catch (e) {
          console.error("Failed to get form session", e);
        }
        setFlag(true);
      } catch (err) {
        console.error("Session check error", err);
        setFlag(true);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, [searchParams]);

  const tableFieldsMap: Record<string, string[]> = {
    SilResidencyHandbook: [
      'signing_as', 'relation_to_participant', 'participant_name', 'participant_signature_date',
      'representative_name', 'representative_signature_date', 'form_status', 'completion_percentage'
    ]
  };

  const [selectedTable, setSelectedTable] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = logs.filter((log) => {
    const normAttr = normalizeFields(log.attributes);
    const changedKeys = Object.keys(normAttr);

    const logDate = log.created_at ? new Date(log.created_at) : null;
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const isInDateRange =
      (!from || (logDate && logDate >= from)) &&
      (!to || (logDate && logDate <= new Date(to.setHours(23, 59, 59, 999))));

    if (!isInDateRange) return false;

    if (!selectedTable && !selectedField) return true;

    if (selectedTable && !selectedField) {
      const tableFields = tableFieldsMap[selectedTable] || [];
      return changedKeys.some((key) => tableFields.includes(key));
    }

    if (selectedTable && selectedField) {
      return changedKeys.includes(selectedField);
    }

    return true;
  });

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="text-gray-500">Loading activity logs...</span>
      </div>
    );
  }

  if (!flag) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">SIL Residency Handbook Audit Logs</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Table</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedField('');
            }}
          >
            <option value="">All Tables</option>
            {Object.keys(tableFieldsMap).map((table) => (
              <option key={table} value={table}>
                {table.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Field</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            disabled={!selectedTable}
          >
            <option value="">All Fields</option>
            {selectedTable &&
              tableFieldsMap[selectedTable]?.map((field) => (
                <option key={field} value={field}>
                  {field.replace(/_/g, ' ')}
                </option>
              ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No activity logs available</p>
      ) : (
        filteredLogs.map((log) => {
          const normAttr = normalizeFields(log.attributes);
          const normOld = normalizeFields(log.old);
          const attrEntries = Object.entries(normAttr);

          return (
            <div
              key={log.id}
              className="bg-white shadow-md border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-indigo-600 capitalize">
                  {(log.log_name || 'sil_residency_handbook').replace(/_/g, ' ')}
                </h2>
                {log.created_at && (
                  <span className="text-sm text-gray-400">
                    {new Date(log.created_at).toLocaleString('en-GB', {
                      hour12: true,
                      hour: 'numeric',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{log.description}</p>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                {log.staff_id && (
                  <p>
                    <strong>Staff ID:</strong> {log.staff_id}
                  </p>
                )}
                <p>
                  <strong>Staff Name:</strong> {log.staff_name ?? 'Admin'}
                </p>
                {log.stafftype_name && (
                  <p>
                    <strong>Role:</strong> {log.stafftype_name}
                  </p>
                )}
                {log.causer_id && (
                  <p>
                    <strong>Updated By:</strong> {log.causer_id}
                  </p>
                )}
              </div>

              {attrEntries.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Changed Fields:</h4>
                  <div className="border-l-4 border-indigo-300 pl-4 space-y-3">
                    {attrEntries.map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <div>
                          <strong className="capitalize text-gray-700">{key.replace(/_/g, ' ')}:</strong>
                        </div>
                        <div className="text-green-700">
                          {formatValue(value)}
                        </div>
                        {normOld[key] !== undefined && (
                          <div className="text-gray-500 text-sm italic">
                            (was: {formatOldValue(normOld[key])})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ActivityLog;
