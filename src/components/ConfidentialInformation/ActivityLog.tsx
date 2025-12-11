// components/ConfidentialInfoActivityLog.tsx
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
  attributes?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

type LogProps = {
  logs: LogEntry[];
};

const ConfidentialInfoActivityLog: React.FC<LogProps> = ({ logs }) => {
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
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle number values for consent flags
    if (typeof value === 'number') {
      if (value === 0 || value === 1) {
        return value ? 'Yes' : 'No';
      }
      return String(value);
    }
    
    // Handle array values (agencies)
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((agency, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-3">
              {Object.entries(agency).map(([key, val]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                  <span className="text-gray-700">{String(val)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    // Handle object values (nested consent objects)
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="border-l-2 border-green-200 pl-3 space-y-1">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="text-sm">
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
              <span className="text-gray-700">{formatNestedValue(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return String(value);
  };

  const formatNestedValue = (value: unknown): string => {
    if (isBase64Image(value)) {
      return 'Signature Image';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'number') {
      if (value === 0 || value === 1) {
        return value ? 'Yes' : 'No';
      }
      return String(value);
    }
    
    return String(value);
  };

  const formatOldValue = (value: unknown): string => {
    if (isBase64Image(value)) {
      return 'Signature Image';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'number') {
      if (value === 0 || value === 1) {
        return value ? 'Yes' : 'No';
      }
      return String(value);
    }
    
    if (Array.isArray(value)) {
      return `${value.length} agency/agencies`;
    }
    
    if (typeof value === 'object' && value !== null) {
      return 'Object data';
    }
    
    return String(value);
  };

  const searchParams = useSearchParams();
  const [flag, setFlag] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        const form = "confidential-information";
        const formUuid = searchParams.get("form-uuid");

        const { token } = await getFormSession(
          form,
          formUuid
        );

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ type: "client" }));
        }
        setFlag(true);
      } catch (e) {
        console.error("Failed to get form session", e);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, [searchParams]);

  // Define table fields mapping for Confidential Information
  const tableFieldsMap: Record<string, string[]> = {
    ConfidentialInformation: [
      'staff_id', 'uuid', 'completion_percentage', 'client_name', 'participant_name',
      'address', 'post_code', 'date_of_birth', 'phone', 'email', 'mobile_no'
    ],
    ConfidentialAgencies: [
      'name', 'role', 'contact', 'agency_name', 'service_type', 'information_shared', 'goal_key'
    ],
    ConfidentialConsent: [
      'signature', 'signed_date', 'signed_by', 'name', 'witnessed_by'
    ],
    VerbalConsent: [
      'verbal_signature', 'verbal_signed_date', 'verbal_name', 'position'
    ],
    PreConsentDisclosure: [
      'discuss_referral_services', 'explain_release_agreement', 
      'explain_share_without_consent', 'provide_privacy_information'
    ]
  };

  const [selectedTable, setSelectedTable] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter logs based on the selected filters and date range
  const filteredLogs = logs.filter((log) => {
    const changedKeys = log.attributes ? Object.keys(log.attributes) : [];

    const logDate = log.created_at ? new Date(log.created_at) : null;
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    // Check date range first
    const isInDateRange =
      (!from || (logDate && logDate >= from)) &&
      (!to || (logDate && logDate <= new Date(to.setHours(23, 59, 59, 999))));

    if (!isInDateRange) return false;

    // Apply table and field filters
    if (!selectedTable && !selectedField) return true;

    if (selectedTable && !selectedField) {
      const tableFields = tableFieldsMap[selectedTable];
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
        <span>Loading...</span>
      </div>
    );
  }

  if (!flag) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Confidential Information Activity Logs</h1>
      
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Section</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedField('');
            }}
          >
            <option value="">All Sections</option>
            {Object.keys(tableFieldsMap).map((table) => (
              <option key={table} value={table}>
                {table.replace(/([A-Z])/g, ' $1').replace('Confidential ', '').trim()}
              </option>
            ))}
          </select>
        </div>

        <div>
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
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
        <p className="text-center text-gray-500">No logs available</p>
      ) : (
        filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-indigo-600 capitalize">
                {log.log_name.replace(/_/g, ' ')}
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
              {log.causer_id && (
                <p>
                  <strong>Updated By:</strong> {log.causer_id}
                </p>
              )}
            </div>

            {log.attributes && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Changed Fields:</h4>
                <div className="border-l-4 border-indigo-300 pl-4 space-y-3">
                  {Object.entries(log.attributes).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <div>
                        <strong className="capitalize text-gray-700">
                          {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}:
                        </strong>
                      </div>
                      <div className="text-green-700">
                        {formatValue(value)}
                      </div>
                      {log.old && log.old[key] !== undefined && (
                        <div className="text-gray-500 text-sm italic">
                          (was: {formatOldValue(log.old[key])})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ConfidentialInfoActivityLog;