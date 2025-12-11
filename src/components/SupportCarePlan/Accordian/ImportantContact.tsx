'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface ImportantContactsFormData {
  advocate: string;
  childcare_school_contact: string;
  power_of_attorney_guardian: string;
  workplace_volunteer_contact: string;
  landlord_sda_provider: string;
  doctor: string;
  specialist_practitioner: string;
  solicitor: string;
  insurer_home_contents: string;
  private_health_cover: string;
  insurer_vehicle: string;
}

interface ImportantContactsProps {
  formData: ImportantContactsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ImportantContactsForm({
  formData,
  handleChange,
  uuid,
}: ImportantContactsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const contactFields = [
    { key: 'advocate', label: 'Advocate', placeholder: 'Enter advocate contact details' },
    { key: 'childcare_school_contact', label: 'Childcare/School Contact', placeholder: 'Enter childcare/school contact details' },
    { key: 'power_of_attorney_guardian', label: 'Power of Attorney/Guardian', placeholder: 'Enter power of attorney/guardian details' },
    { key: 'workplace_volunteer_contact', label: 'Workplace/Volunteer Contact', placeholder: 'Enter workplace/volunteer contact details' },
    { key: 'landlord_sda_provider', label: 'Landlord/SDA Provider', placeholder: 'Enter landlord/SDA provider details' },
    { key: 'doctor', label: 'Doctor', placeholder: 'Enter doctor contact details' },
    { key: 'specialist_practitioner', label: 'Specialist Practitioner', placeholder: 'Enter specialist practitioner details' },
    { key: 'solicitor', label: 'Solicitor', placeholder: 'Enter solicitor contact details' },
    { key: 'insurer_home_contents', label: 'Home Contents Insurer', placeholder: 'Enter home contents insurer details' },
    { key: 'private_health_cover', label: 'Private Health Cover', placeholder: 'Enter private health cover details' },
    { key: 'insurer_vehicle', label: 'Vehicle Insurer', placeholder: 'Enter vehicle insurer details' },
  ];

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Important Contacts Information
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactFields.map((field) => (
            <div
              key={field.key}
              className="relative"
              onMouseEnter={() => setHoveredField(field.key)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">{field.label}</label>
                {hoveredField === field.key && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs(field.key)}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name={field.key}
                placeholder={field.placeholder}
                value={formData[field.key as keyof ImportantContactsFormData] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_care_plan_important_contacts"
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}