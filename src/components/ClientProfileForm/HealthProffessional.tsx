"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

export interface HealthProffessional {
  role: string;
  name: string;
  contact_number: string;
}

interface PreviousHealthProffessionalProps {
  healthProffessional: HealthProffessional[];
  setHealthProffessional: React.Dispatch<React.SetStateAction<HealthProffessional[]>>;
  uuid?: string | null;
}

export default function HealthProffessional({
  healthProffessional,
  setHealthProffessional,
  uuid
}: PreviousHealthProffessionalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const predefinedRoles = [
    "General Practitioner",
    "Physiotherapy",
    "Speech Therapist",
    "Occupational Therapist",
    "Behaviour Support Practitioner",
    "Podiatrist",
  ];

  // Separate predefined and 'others' for clarity
  const others = healthProffessional.filter(p => !predefinedRoles.includes(p.role));
  const predefined = predefinedRoles.map((role) =>
    healthProffessional.find((p) => p.role === role) || { role, name: "", contact_number: "" }
  );

  const updateProfessional = (
    index: number,
    field: keyof HealthProffessional,
    value: string,
    isOther: boolean = false
  ) => {
    const updatedProfessionals = [...healthProffessional];

    if (isOther) {
      const filteredIndex = healthProffessional.findIndex(
        (p) => !predefinedRoles.includes(p.role) && others.indexOf(p) === index
      );
      if (filteredIndex !== -1) {
        updatedProfessionals[filteredIndex] = {
          ...updatedProfessionals[filteredIndex],
          [field]: value,
        };
      }
    } else {
      const role = predefinedRoles[index];
      const existingIndex = updatedProfessionals.findIndex((p) => p.role === role);

      if (existingIndex !== -1) {
        updatedProfessionals[existingIndex] = {
          ...updatedProfessionals[existingIndex],
          [field]: value,
        };
      } else {
        // Role doesn't exist yet — add it
        const newEntry: HealthProffessional = {
          role,
          name: field === "name" ? value : "",
          contact_number: field === "contact_number" ? value : "",
        };
        updatedProfessionals.push(newEntry);
      }
    }

    setHealthProffessional(updatedProfessionals);
  };

  const addOther = () => {
    setHealthProffessional([
      ...healthProffessional,
      { role: "", name: "", contact_number: "" },
    ]);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-3 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="mb-4 text-lg font-semibold text-heading">HEALTH PROFESSIONAL DETAILS</h4>
        <button
          type='button'
          onClick={handleViewLogs}
          className="btn-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          View Logs
        </button>
      </div>
      <table className="w-full table-auto border-collapse p-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-bold">Role/Position</th>
            <th className="px-4 py-2 text-left font-bold">Name</th>
            <th className="px-4 py-2 text-left font-bold">Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {predefined.map((pro, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{pro.role}</td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Name"
                  value={pro.name}
                  onChange={(e) =>
                    updateProfessional(idx, "name", e.target.value, false)
                  }
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Contact Number"
                  value={pro.contact_number}
                  onChange={(e) =>
                    updateProfessional(idx, "contact_number", e.target.value, false)
                  }
                />
              </td>
            </tr>
          ))}

          {others.map((pro, idx) => (
            <tr key={`other-${idx}`}>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Role/Position"
                  value={pro.role === "others" ? "" : pro.role}
                  onChange={(e) =>
                    updateProfessional(idx, "role", e.target.value, true)
                  }
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Name"
                  value={pro.name}
                  onChange={(e) =>
                    updateProfessional(idx, "name", e.target.value, true)
                  }
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Contact Number"
                  value={pro.contact_number}
                  onChange={(e) =>
                    updateProfessional(idx, "contact_number", e.target.value, true)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4">
        <button
          type="button"
          onClick={addOther}
          className="btn-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Add Other
        </button>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="health_professional_detail"
        field="all" // This will show all changes to the health professionals
        url="logs/view"
      />
    </div>
  );
}