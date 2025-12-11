// components/ActivityLog.tsx
'use client';
import React, { useState, useEffect } from 'react';

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

const ActivityLog: React.FC<LogProps> = ({ logs }) => {
  const searchParams = useSearchParams();
   const [flag, setFlag] = useState(false);
   const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
      (async () => {
        try {
          const form = "support-care-plan";
          const formUuid = searchParams.get("form-uuid");
  
          // pass form, form_token, form_client_type, and form-uuid to API
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
        }finally {
      setCheckingSession(false);
    }
      })();
    }, [searchParams]);
  const tableFieldsMap: Record<string, string[]> = {
    IntialEnquiry: [
      'staff_id', 'full_name', 'preferred_name', 'gender', 'date_of_birth', 'address',
      'postcode', 'phone_number', 'mobile_number', 'email', 'need_support_person',
      'support_person_details', 'completion_percentage',
    ],
    Funding: [
      'type_of_funding', 'funding_contact_person', 'ndis_plan_attached',
      'ndis_plan_start_date', 'ndis_plan_end_date', 'plan_manager_name',
      'plan_manager_phone', 'plan_manager_email',
    ],
    EmergencyContact: ['name', 'relationship', 'phone', 'mobile', 'work_contact'],  
    CulturalBackground: [
      'country_of_birth', 'preferred_language', 'religion', 'other_languages',
      'cultural_needs', 'interpreter_required', 'auslan_required',
    ],
    DiagnosisSummary: ['primary_diagnosis', 'secondary_diagnosis'],
    HealthInformation: ['health_conditions'],
    HealthcareSupportDetail: [
      'medicare', 'health_fund', 'pension_card_number', 'health_care_card', 'dva_type',
      'dva_number', 'companion_card', 'preferred_hospital', 'ambulance_number', 'disabled_parking',
    ],
    BehaviourSupport: ['has_support_plan', 'plan_copy_received'],
    MedicalAlert: [
      'epilepsy', 'asthma', 'diabetes', 'allergies', 'medical_info',
      'diagnosis', 'other_description', 'medication_taken', 'medication_purpose',
      'staff_administer_medication', 'self_administered', 'guardian', 'support_worker',
    ],
    PreventiveHealthSummary: [
      'medical_checkup_status', 'last_dental_check', 'last_hearing_check',
      'last_vision_check', 'requires_vaccination_assistance',
      'communication_assistance_required', 'mealtime_plan', 'likes', 'dislikes',
      'interests', 'male', 'female', 'no_preference', 'special_request',
    ],
    SupportInformation: [
      'communication_assistance_required', 'mealtime_plan', 'likes', 'dislikes',
      'interests', 'male', 'female', 'no_preference', 'special_request',
    ],
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
  return null; // nothing is rendered (redirect is happening)
}

  return (
    <>
      {flag ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
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
              {/* {log.user_id && (
                <p>
                  <strong>User ID:</strong> {log.user_id}
                </p>
              )} */}
              {/* {log.stafftype_name && (
                <p>
                  <strong>Staff Type:</strong> {log.stafftype_name}
                </p>
              )} */}
              {log.causer_id && (
                <p>
                  <strong>Updated By:</strong> {log.causer_id}
                </p>
              )}
            </div>

            {log.attributes && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Changed Fields:</h4>
                <div className="border-l-4 border-indigo-300 pl-4 space-y-1 text-sm">
                  {Object.entries(log.attributes).map(([key, value]) => (
                    <div key={key}>
                      <strong className="capitalize">{key}:</strong>{' '}
                      <span className="text-green-700">{String(value)}</span>
                      {log.old && log.old[key] !== undefined && (
                        <span className="text-gray-500 ml-2 italic">
                          (was: {String(log.old[key])})
                        </span>
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
    ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
    </>
    
  );
};

export default ActivityLog;
