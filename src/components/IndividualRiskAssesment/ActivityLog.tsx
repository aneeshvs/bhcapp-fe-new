// components/RiskAssessmentActivityLog.tsx
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

const RiskAssessmentActivityLog: React.FC<LogProps> = ({ logs }) => {
  const searchParams = useSearchParams();
  const [checkingSession, setCheckingSession] = useState(true);
  const [flag, setFlag] = useState(false);
  
  useEffect(() => {
    (async () => {
      try {
        const form = "risk-assessment";
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

  const tableFieldsMap: Record<string, string[]> = {
    RiskAssessment: [
      'staff_id', 'uuid', 'completion_percentage', 'participant_name', 
      'client_name', 'site_address', 'assessment_date', 'planned_review_date'
    ],
    AssessmentDetails: [
      'vulnerability', 'review_frequency', 'dependent_on_homecare'
    ],
    AssessmentCommunications: [
      'hearing_impairment', 'hearing_hazards', 'hearing_management_plan',
      'speech_impairment', 'speech_hazards', 'speech_management_plan'
    ],
    AssessmentCognitions: [
      'oriented_in_time_place', 'oriented_hazards', 'oriented_management_plan',
      'accepts_direction', 'direction_hazards', 'direction_management_plan',
      'short_term_memory_issues', 'memory_hazards', 'memory_management_plan'
    ],
    AssessmentMobilities: [
      'walk_unaided', 'accessibility_required', 'walk_hazards', 'walk_management_plan',
      'manages_stairs', 'stairs_hazards', 'stairs_management_plan',
      'uses_walking_aid', 'walking_aid_hazards', 'walking_aid_management_plan',
      'uses_wheelchair', 'wheelchair_hazards', 'wheelchair_management_plan',
      'bed_transfer', 'bed_transfer_hazards', 'bed_transfer_management_plan',
      'vehicle_transfer', 'vehicle_transfer_hazards', 'vehicle_transfer_management_plan',
      'toilet_transfer', 'toilet_transfer_hazards', 'toilet_transfer_management_plan'
    ],
    AssessmentPersonalCare: [
      'showering', 'showering_hazards', 'showering_management_plan',
      'meal', 'meal_hazards', 'meal_management_plan',
      'toileting', 'toileting_hazards', 'toileting_management_plan',
      'grooming', 'grooming_hazards', 'grooming_management_plan',
      'repositioning_bed', 'repositioning_bed_hazards', 'repositioning_bed_management_plan',
      'repositioning_chair', 'repositioning_chair_hazards', 'repositioning_chair_management_plan',
      'mouthcare', 'mouthcare_hazards', 'mouthcare_management_plan',
      'skin_care', 'skin_care_hazards', 'skin_care_management_plan'
    ],
    PlanManualHandlings: [
      'goal_key', 'training_provided', 'training_hazards', 'training_management_plan',
      'tasks_safe', 'tasks_hazards', 'tasks_management_plan'
    ],
    AssessmentViolenceRisks: [
      'physical_aggression', 'physical_hazards', 'physical_management_plan', 'physical_bsp_plan',
      'verbal_aggression', 'verbal_hazards', 'verbal_management_plan', 'verbal_bsp_plan',
      'client_aggression', 'client_hazards', 'client_management_plan', 'client_bsp_plan',
      'self_harm', 'self_harm_hazards', 'self_harm_management_plan', 'self_harm_bsp_plan',
      'drug_alcohol_use', 'drug_alcohol_hazards', 'drug_alcohol_management_plan', 'drug_alcohol_bsp_plan',
      'sexual_abuse_history', 'sexual_abuse_hazards', 'sexual_abuse_management_plan', 'sexual_abuse_bsp_plan',
      'emotional_manipulation', 'emotional_hazards', 'emotional_management_plan', 'emotional_bsp_plan',
      'other_known_risks', 'other_risks_hazards', 'other_risks_management_plan', 'other_risks_bsp_plan',
      'finance_management', 'finance_hazards', 'finance_management_plan', 'finance_bsp_plan'
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
    <>
      {flag ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">Risk Assessment Activity Logs</h1>
          
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
                    {table.replace(/([A-Z])/g, ' $1').trim()}
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
                          <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
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
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
    </>
  );
};

export default RiskAssessmentActivityLog;