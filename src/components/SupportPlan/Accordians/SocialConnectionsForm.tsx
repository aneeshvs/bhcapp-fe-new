"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanSocialConnections } from "@/src/components/SupportPlan/types";

interface SocialConnectionsProps {
  formData: SupportPlanSocialConnections;
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
}: SocialConnectionsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.feels_lonely === 0 && formData.feels_lonely_details) {
      handleChange({
        target: {
          name: 'feels_lonely_details',
          value: ''
        }
      });
    }
  }, [formData.feels_lonely, formData.feels_lonely_details, handleChange]);

  // Clear informal supports details when has_informal_supports is set to "No"
  useEffect(() => {
    if (formData.has_informal_supports === 0 && formData.informal_supports_details) {
      handleChange({
        target: {
          name: 'informal_supports_details',
          value: ''
        }
      });
    }
  }, [formData.has_informal_supports, formData.informal_supports_details, handleChange]);

  // Clear community engagement details when wants_more_community_engagement is set to "No"
  useEffect(() => {
    if (formData.wants_more_community_engagement === 0 && formData.community_engagement_details) {
      handleChange({
        target: {
          name: 'community_engagement_details',
          value: ''
        }
      });
    }
  }, [formData.wants_more_community_engagement, formData.community_engagement_details, handleChange]);

  // Clear support for community engagement details when wants_support_for_community_engagement is set to "No"
  useEffect(() => {
    if (formData.wants_support_for_community_engagement === 0 && formData.support_for_community_engagement_details) {
      handleChange({
        target: {
          name: 'support_for_community_engagement_details',
          value: ''
        }
      });
    }
  }, [formData.wants_support_for_community_engagement, formData.support_for_community_engagement_details, handleChange]);

  // Clear community access support details when needs_community_access_support is set to "No"
  useEffect(() => {
    if (formData.needs_community_access_support === 0 && formData.community_access_support_details) {
      handleChange({
        target: {
          name: 'community_access_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_community_access_support, formData.community_access_support_details, handleChange]);

  // Clear taxi card details when has_taxi_card is set to "No"
  useEffect(() => {
    if (formData.has_taxi_card === 0 && formData.taxi_card_details) {
      handleChange({
        target: {
          name: 'taxi_card_details',
          value: ''
        }
      });
    }
  }, [formData.has_taxi_card, formData.taxi_card_details, handleChange]);

  // Clear visitors program details when interested_in_visitors_program is set to "No"
  useEffect(() => {
    if (formData.interested_in_visitors_program === 0 && formData.visitors_program_details) {
      handleChange({
        target: {
          name: 'visitors_program_details',
          value: ''
        }
      });
    }
  }, [formData.interested_in_visitors_program, formData.visitors_program_details, handleChange]);

  // Clear hobbies activities details when has_hobbies_activities is set to "No"
  useEffect(() => {
    if (formData.has_hobbies_activities === 0 && formData.hobbies_activities_details) {
      handleChange({
        target: {
          name: 'hobbies_activities_details',
          value: ''
        }
      });
    }
  }, [formData.has_hobbies_activities, formData.hobbies_activities_details, handleChange]);

  // Clear duke index details when needs_duke_index is set to "No"
  useEffect(() => {
    if (formData.needs_duke_index === 0 && formData.duke_index_details) {
      handleChange({
        target: {
          name: 'duke_index_details',
          value: ''
        }
      });
    }
  }, [formData.needs_duke_index, formData.duke_index_details, handleChange]);

  // Clear feeding support details when social_connections_needs_feeding_support is set to "No"
  useEffect(() => {
    if (formData.social_connections_needs_feeding_support === 0 && formData.social_connections_feeding_support_details) {
      handleChange({
        target: {
          name: 'social_connections_feeding_support_details',
          value: ''
        }
      });
    }
  }, [formData.social_connections_needs_feeding_support, formData.social_connections_feeding_support_details, handleChange]);

  // Clear dietician referral details when social_connections_wants_dietician_referral is set to "No"
  useEffect(() => {
    if (formData.social_connections_wants_dietician_referral === 0 && formData.social_connections_dietician_referral_details) {
      handleChange({
        target: {
          name: 'social_connections_dietician_referral_details',
          value: ''
        }
      });
    }
  }, [formData.social_connections_wants_dietician_referral, formData.social_connections_dietician_referral_details, handleChange]);

  // Clear shopping support details when social_connections_needs_shopping_support is set to "No"
  useEffect(() => {
    if (formData.social_connections_needs_shopping_support === 0 && formData.social_connections_shopping_support_details) {
      handleChange({
        target: {
          name: 'social_connections_shopping_support_details',
          value: ''
        }
      });
    }
  }, [formData.social_connections_needs_shopping_support, formData.social_connections_shopping_support_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanSocialConnections] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanSocialConnections] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanSocialConnections] || ""}
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
          Social Connections
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feels Lonely */}
          {renderYesNoField("feels_lonely", "Do you ever feel lonely?", "feels_lonely_details")}

          {/* Has Informal Supports */}
          {renderYesNoField("has_informal_supports", "Do you have informal supports from friends, family, or neighbours?", "informal_supports_details")}

          {/* Wants More Community Engagement */}
          {renderYesNoField("wants_more_community_engagement", "Do you want to engage more with the local community?", "community_engagement_details")}

          {/* Wants Support for Community Engagement */}
          {renderYesNoField("wants_support_for_community_engagement", "Do you want us to support you to engage with your local community more?", "support_for_community_engagement_details")}

          {/* Needs Community Access Support */}
          {renderYesNoField("needs_community_access_support", "Do you need support accessing the community", "community_access_support_details")}

          {/* Has Taxi Card */}
          {renderYesNoField("has_taxi_card", "Do you have a multi-purpose taxi card?", "taxi_card_details")}

          {/* Interested in Visitors Program */}
          {renderYesNoField("interested_in_visitors_program", "Would you be interested in being connected with the Community Visitors Program?", "visitors_program_details")}

          {/* Has Hobbies Activities */}
          {renderYesNoField("has_hobbies_activities", "Hobbies and activities participant enjoys", "hobbies_activities_details")}

          {/* Needs Duke Index */}
          {renderYesNoField("needs_duke_index", "Does the Duke Social Support Index need to be completed?", "duke_index_details")}

          {/* Social Connections Needs Feeding Support */}
          {renderYesNoField("social_connections_needs_feeding_support", "Do you require support with feeding?", "social_connections_feeding_support_details")}

          {/* Social Connections Wants Dietician Referral */}
          {renderYesNoField("social_connections_wants_dietician_referral", "Do you want a referral to a Dietician?", "social_connections_dietician_referral_details")}

          {/* Social Connections Needs Shopping Support */}
          {renderYesNoField("social_connections_needs_shopping_support", "Do you need support in completing food shopping/unpacking?", "social_connections_shopping_support_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_social_connection"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}