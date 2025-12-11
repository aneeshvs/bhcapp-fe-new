import React from 'react';
import Image from 'next/image';

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
  table: string;
  field: string;
  customValueFormatter?: (value: unknown, field: string) => React.ReactNode;
};

const FieldActivityLog: React.FC<LogProps> = ({ logs, field, customValueFormatter }) => {
  // Function to check if value is a base64 image with proper type checking
  const isBase64Image = (value: unknown): value is string => {
    return typeof value === 'string' && value.startsWith('data:image');
  };

  // Improved date detection - only format as date if it's a valid date string
  const isValidDateString = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;

  // Don't treat plain numbers, booleans, or short strings as dates
  if (/^\d+$/.test(value) || value.trim().length < 8) return false;

  // Explicitly exclude anything with alphabetic characters (except for valid month names)
  if (/[a-zA-Z]/.test(value) && !/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !isNaN(date.getTime());
};

  // Default value formatter
  const formatValue = (value: unknown, fieldName: string) => {
    if (customValueFormatter) {
      return customValueFormatter(value, fieldName);
    }

    // Base64 image check
    if (isBase64Image(value)) {
      return (
        <div className="flex flex-col items-start gap-2">
          <div className="w-32 h-12 border rounded overflow-hidden relative">
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
    // ✅ Improved date check - only format valid date strings
    if (isValidDateString(value)) {
      const date = new Date(value as string);
      return (
        <span className="text-blue-700">
          {date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      );
    }

    // Boolean-like values
    if (value === '1' || value === 1) return <span className="text-green-700">Yes</span>;
    if (value === '0' || value === 0) return <span className="text-red-700">No</span>;

    // Handle numeric values
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '')) {
      return <span className="text-purple-700">{String(value)}</span>;
    }

    // Default fallback
    return <span className="text-gray-800">{String(value)}</span>;
  };

  // Format old value (without image display)
  const formatOldValue = (value: unknown) => {
    if (isBase64Image(value)) {
      return 'Signature Image';
    }
    
    // Apply the same logic for old values
    if (isValidDateString(value)) {
      const date = new Date(value as string);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    if (value === '1' || value === 1) return 'Yes';
    if (value === '0' || value === 0) return 'No';
    
    return String(value);
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-500">No activity logs found for {field.replace(/_/g, ' ')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-indigo-600 capitalize">
              {log.description}
            </h4>
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

          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <p>
              <strong>Updated By:</strong> {log.staff_name ?? "Admin"}
            </p>
            {log.stafftype_name && (
              <p>
                <strong>Role:</strong> {log.stafftype_name}
              </p>
            )}
          </div>

          {/* Modified section starts here */}
          {field === 'all' ? (
            <div className="mt-4 space-y-3">
              {log.attributes && Object.entries(log.attributes)
              .filter(([key]) => key !== 'initial_enquiry_id'  && !(key === 'goal_key'))
              .map(([key, value]) => (
                <div key={key} className="border-l-4 border-indigo-300 pl-4 space-y-1 text-sm">
                  <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>New value:</strong>{' '}
                      {formatValue(value, key)}
                    </div>
                    {log.old && log.old[key] !== undefined && (
                      <div>
                        <strong>Previous value:</strong>{' '}
                        <span className="text-gray-500">
                          {formatOldValue(log.old[key])}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            log.attributes && log.attributes[field] !== undefined && (
              <div className="mt-2">
                <div className="border-l-4 border-indigo-300 pl-4 space-y-1 text-sm">
                  <div>
                    <strong>New value:</strong>{' '}
                    {formatValue(log.attributes[field], field)}
                  </div>
                  {log.old && log.old[field] !== undefined && (
                    <div>
                      <strong>Previous value:</strong>{' '}
                      <span className="text-gray-500">
                        {formatOldValue(log.old[field])}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default FieldActivityLog;