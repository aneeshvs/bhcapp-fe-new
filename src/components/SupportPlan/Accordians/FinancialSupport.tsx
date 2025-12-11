"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanFinancialSupports } from "@/src/components/SupportPlan/types";

interface SupportPlanFinancialProps {
  formData: SupportPlanFinancialSupports;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function SocialConnectionsForm({
  formData,
  handleChange,
  uuid,
}: SupportPlanFinancialProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.financial_has_power_of_attorney === 0 && formData.financial_power_of_attorney_details) {
      handleChange({
        target: {
          name: 'financial_power_of_attorney_details',
          value: ''
        }
      });
    }
  }, [formData.financial_has_power_of_attorney, formData.financial_power_of_attorney_details, handleChange]);

  // Clear access to money details when has_access_to_money is set to "No"
  useEffect(() => {
    if (formData.has_access_to_money === 0 && formData.access_to_money_details) {
      handleChange({
        target: {
          name: 'access_to_money_details',
          value: ''
        }
      });
    }
  }, [formData.has_access_to_money, formData.access_to_money_details, handleChange]);

  // Clear risk of abuse details when at_risk_of_abuse is set to "No"
  useEffect(() => {
    if (formData.at_risk_of_abuse === 0 && formData.risk_of_abuse_details) {
      handleChange({
        target: {
          name: 'risk_of_abuse_details',
          value: ''
        }
      });
    }
  }, [formData.at_risk_of_abuse, formData.risk_of_abuse_details, handleChange]);

  // Clear support for bills details when needs_support_for_bills is set to "No"
  useEffect(() => {
    if (formData.needs_support_for_bills === 0 && formData.support_for_bills_details) {
      handleChange({
        target: {
          name: 'support_for_bills_details',
          value: ''
        }
      });
    }
  }, [formData.needs_support_for_bills, formData.support_for_bills_details, handleChange]);

  // Clear not enough money details when not_enough_money is set to "No"
  useEffect(() => {
    if (formData.not_enough_money === 0 && formData.not_enough_money_details) {
      handleChange({
        target: {
          name: 'not_enough_money_details',
          value: ''
        }
      });
    }
  }, [formData.not_enough_money, formData.not_enough_money_details, handleChange]);

  // Clear financial counsellor details when support_financial_counsellor is set to "No"
  useEffect(() => {
    if (formData.support_financial_counsellor === 0 && formData.financial_counsellor_details) {
      handleChange({
        target: {
          name: 'financial_counsellor_details',
          value: ''
        }
      });
    }
  }, [formData.support_financial_counsellor, formData.financial_counsellor_details, handleChange]);

  // Clear government initiatives details when support_government_initiatives is set to "No"
  useEffect(() => {
    if (formData.support_government_initiatives === 0 && formData.government_initiatives_details) {
      handleChange({
        target: {
          name: 'government_initiatives_details',
          value: ''
        }
      });
    }
  }, [formData.support_government_initiatives, formData.government_initiatives_details, handleChange]);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string) => (
    <>
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(fieldName)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label}</label>
          {hoveredField === fieldName && (
            <button
              type="button"
              onClick={() => handleViewLogs(fieldName)}
              className="text-xs btn-primary text-white px-2 py-1 rounded"
            >
              View Logs
            </button>
          )}
        </div>
        <div className="flex gap-4">
          {yesNoOptions.map(({ label, value }) => (
            <label key={label} className="flex items-center gap-2">
              <input
                type="radio"
                name={fieldName}
                value={value}
                checked={formData[fieldName as keyof SupportPlanFinancialSupports] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanFinancialSupports] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Details</label>
            {hoveredField === detailsField && (
              <button
                type="button"
                onClick={() => handleViewLogs(detailsField)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name={detailsField}
            placeholder={"Enter details..."}
            value={formData[detailsField as keyof SupportPlanFinancialSupports] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Financial Support
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderYesNoField("financial_has_power_of_attorney", "Do you have a Power of Attorney or Financial Guardian?", "financial_power_of_attorney_details")}

          {renderYesNoField("has_access_to_money", "Do you have access to your own money?", "access_to_money_details")}

          {renderYesNoField("at_risk_of_abuse", "Are you at risk of financial abuse?", "risk_of_abuse_details")}

          {renderYesNoField("needs_support_for_bills", "Do you need support to pay bills/attend bank?", "support_for_bills_details")}

          {renderYesNoField("not_enough_money", "Do you ever find that you don't have enough money to purchase food or pay your bills?", "not_enough_money_details")}

          {renderYesNoField("support_financial_counsellor", "Do you want support to engage with a financial hardship/ counsellor?", "financial_counsellor_details")}

          {renderYesNoField("support_government_initiatives", "Do you want support to access Government initiatives such as the Utility Relief Grant Scheme?", "government_initiatives_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_financial_support"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}