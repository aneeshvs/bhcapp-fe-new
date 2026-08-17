"use client";

import React, { useState, useEffect, useMemo, createRef, RefObject, useCallback, useRef } from "react";
import SignaturePad from "signature_pad";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import AccordianPlanSection from "@/src/components/AccordianSection";

const SingleSignaturePad: React.FC<{
  label: string;
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  elementId?: string;
}> = ({ label, value, onChange, disabled, elementId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const initOrResizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = canvas.offsetWidth || rect.width || 300;
      const height = canvas.offsetHeight || rect.height || 128;

      if (width === 0 || height === 0) return;

      if (!padRef.current) {
        canvas.width = width;
        canvas.height = height;
        const pad = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)" });
        padRef.current = pad;

        pad.addEventListener("endStroke", () => {
          if (!pad.isEmpty()) {
            onChange(pad.toDataURL());
          }
        });
      } else {
        if (canvas.width !== width || canvas.height !== height) {
          const pad = padRef.current;
          const data = pad.toData();
          canvas.width = width;
          canvas.height = height;
          pad.clear();
          pad.fromData(data);
        }
      }
    };

    initOrResizeCanvas();
    const timer = setTimeout(initOrResizeCanvas, 200);

    const resizeObserver = new ResizeObserver(() => {
      initOrResizeCanvas();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    const handleResize = () => initOrResizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;
    if (value && value.startsWith("data:image")) {
      if (pad.isEmpty() || pad.toDataURL() !== value) {
        pad.clear();
        pad.fromDataURL(value, { ratio: 1, width: (pad as any).canvas.width, height: (pad as any).canvas.height });
      }
    } else if (!value) {
      pad.clear();
    }
  }, [value]);

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
    }
    onChange("");
  };

  const handleSave = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      onChange(padRef.current.toDataURL());
      window.alert("Signature saved to form!");
    }
  };

  return (
    <div className="md:col-span-2 relative my-3" id={elementId}>
      <label className="block font-semibold text-sm mb-2 text-gray-800">{label}</label>
      <canvas
        ref={canvasRef}
        className={`w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded-lg mb-2 touch-none shadow-md ${
          disabled ? "pointer-events-none opacity-75" : "cursor-default"
        }`}
        style={{ cursor: disabled ? "default" : "default" }}
      />
      {value?.startsWith("data:image") && (
        <div className="mt-2 mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">Saved Signature Preview:</p>
          <img
            src={value}
            alt={label}
            className="w-48 h-20 border rounded shadow bg-white object-contain"
          />
        </div>
      )}
      {!disabled && (
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white text-xs font-semibold transition"
          >
            Save Signature
          </button>
        </div>
      )}
    </div>
  );
};
import Tracker from "@/src/components/Tracker";
import { destroy } from "@/src/services/crud";

interface DecisionMaker {
  decision_maker_type: string;
  name_and_contact_details: string;
}

interface SilSupportPlanFormProps {
  formData: any;
  setFormData: (data: any) => void;
  decisionMakers: DecisionMaker[];
  setDecisionMakers: (data: DecisionMaker[]) => void;
  clientGoal: any;
  setClientGoal: (data: any) => void;
  dailyRoutines: any[];
  setDailyRoutines: (data: any[]) => void;
  supportNeed: any;
  setSupportNeed: (data: any) => void;
  naturalSupport: any;
  setNaturalSupport: (data: any) => void;
  clinicalManagementPlan: any;
  setClinicalManagementPlan: (data: any) => void;
  externalProviders: any[];
  setExternalProviders: (data: any[]) => void;
  behaviourSupport: any;
  setBehaviourSupport: (data: any) => void;
  healthMedical: any;
  setHealthMedical: (data: any) => void;
  riskManagements: any[];
  setRiskManagements: (data: any[]) => void;
  communication: any;
  setCommunication: (data: any) => void;
  housingArrangement: any;
  setHousingArrangement: (data: any) => void;
  choiceControl: any;
  setChoiceControl: (data: any) => void;
  teamMemberRequirement: any;
  setTeamMemberRequirement: (data: any) => void;
  emergencyInformation: any;
  setEmergencyInformation: (data: any) => void;
  reviewSignature: any;
  setReviewSignature: (data: any) => void;
  handleChange: (e: any) => void;
  uuid?: string;
  isReadOnly?: boolean;
}

export default function SilSupportPlanForm({
  formData,
  setFormData,
  decisionMakers,
  setDecisionMakers,
  clientGoal,
  setClientGoal,
  dailyRoutines,
  setDailyRoutines,
  supportNeed,
  setSupportNeed,
  naturalSupport,
  setNaturalSupport,
  clinicalManagementPlan,
  setClinicalManagementPlan,
  externalProviders,
  setExternalProviders,
  behaviourSupport,
  setBehaviourSupport,
  healthMedical,
  setHealthMedical,
  riskManagements,
  setRiskManagements,
  communication,
  setCommunication,
  housingArrangement,
  setHousingArrangement,
  choiceControl,
  setChoiceControl,
  teamMemberRequirement,
  setTeamMemberRequirement,
  emergencyInformation,
  setEmergencyInformation,
  reviewSignature,
  setReviewSignature,
  handleChange,
  uuid,
  isReadOnly = false,
}: SilSupportPlanFormProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleDecisionMakerChange = (index: number, field: keyof DecisionMaker, value: string) => {
    const updated = [...decisionMakers];
    updated[index][field] = value;
    setDecisionMakers(updated);
  };

  const addDecisionMaker = () => {
    setDecisionMakers([...decisionMakers, { decision_maker_type: "Support Decision Maker", name_and_contact_details: "" }]);
  };

  const removeDecisionMaker = async (index: number) => {
    const itemToRemove = decisionMakers[index];
    if (itemToRemove && uuid) {
      try {
        await destroy("sil-support-plan/remove-section", {
          uuid: uuid,
          table: "decision_makers",
          id: (itemToRemove as any).id || null,
          field: "name_and_contact_details",
          value: itemToRemove.name_and_contact_details || "",
        });
      } catch (err) {
        console.error("Error removing decision maker:", err);
      }
    }
    const updated = decisionMakers.filter((_, i) => i !== index);
    setDecisionMakers(updated);
  };

  useEffect(() => {
    if (decisionMakers.length === 0) {
      setDecisionMakers([{ decision_maker_type: "Self-Decision Maker", name_and_contact_details: "" }]);
    }
  }, []);

  const handleClientGoalChange = (field: string, value: string) => {
    setClientGoal({ ...clientGoal, [field]: value });
  };

  const handleDailyRoutineChange = (dayIndex: number, field: string, value: string) => {
    const updated = [...dailyRoutines];
    if (!updated[dayIndex]) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      updated[dayIndex] = { day: days[dayIndex] };
    }
    updated[dayIndex][field] = value;
    setDailyRoutines(updated);
  };

  const handleSupportNeedChange = (field: string, value: string) => {
    setSupportNeed({ ...supportNeed, [field]: value });
  };

  const handleNaturalSupportChange = (value: string) => {
    setNaturalSupport({ ...naturalSupport, details: value });
  };

  const handleClinicalManagementPlanChange = (value: string) => {
    setClinicalManagementPlan({ ...clinicalManagementPlan, details: value });
  };

  const handleExternalProviderChange = (index: number, field: string, value: string) => {
    const updated = [...externalProviders];
    if (!updated[index]) updated[index] = {};
    updated[index][field] = value;
    setExternalProviders(updated);
  };

  const addExternalProvider = () => {
    setExternalProviders([...externalProviders, { provider_name: "", service_type: "", contact_details: "", key_role: "" }]);
  };

  const removeExternalProvider = async (index: number) => {
    const itemToRemove = externalProviders[index];
    if (itemToRemove && uuid) {
      try {
        await destroy("sil-support-plan/remove-section", {
          uuid: uuid,
          table: "external_providers",
          id: (itemToRemove as any).id || null,
          field: "provider_name",
          value: itemToRemove.provider_name || "",
        });
      } catch (err) {
        console.error("Error removing external provider:", err);
      }
    }
    setExternalProviders(externalProviders.filter((_, i) => i !== index));
  };

  const handleBehaviourSupportChange = (field: string, value: string) => {
    setBehaviourSupport({ ...behaviourSupport, [field]: value });
  };

  const handleHealthMedicalChange = (field: string, value: string) => {
    setHealthMedical({ ...healthMedical, [field]: value });
  };

  const handleRiskManagementChange = (typeIndex: number, field: string, value: string) => {
    const updated = [...riskManagements];
    const defaultTypes = ["Personal care risk", "Home environment", "Community access", "Medication management", "Clinical/health risk"];
    if (!updated[typeIndex]) {
      updated[typeIndex] = { risk_type: defaultTypes[typeIndex] };
    }
    updated[typeIndex][field] = value;
    setRiskManagements(updated);
  };

  const handleCommunicationChange = (field: string, value: string) => {
    setCommunication({ ...communication, [field]: value });
  };

  const handleHousingArrangementChange = (field: string, value: string) => {
    setHousingArrangement({ ...housingArrangement, [field]: value });
  };

  const handleChoiceControlChange = (field: string, value: string) => {
    setChoiceControl({ ...choiceControl, [field]: value });
  };

  const handleTeamMemberRequirementChange = (field: string, value: string) => {
    setTeamMemberRequirement({ ...teamMemberRequirement, [field]: value });
  };

  const handleEmergencyInformationChange = (field: string, value: string) => {
    setEmergencyInformation({ ...emergencyInformation, [field]: value });
  };

  const handleReviewSignatureChange = (field: string, value: string) => {
    setReviewSignature((prev: any) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const defaultTypes = ["Personal care risk", "Home environment", "Community access", "Medication management", "Clinical/health risk"];
    if (riskManagements.length === 0) {
      setRiskManagements(defaultTypes.map(risk_type => ({ risk_type, description_of_risk: "", likelihood: "", impact: "", control_measures: "", responsible_person: "" })));
    } else if (riskManagements.length > 0 && riskManagements.length < 5) {
      const updated = defaultTypes.map(risk_type => {
        const existing = riskManagements.find(r => r.risk_type === risk_type);
        return existing || { risk_type, description_of_risk: "", likelihood: "", impact: "", control_measures: "", responsible_person: "" };
      });
      setRiskManagements(updated);
    }
  }, [riskManagements.length]);

  useEffect(() => {
    if (dailyRoutines.length === 0) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      setDailyRoutines(days.map(day => ({ day, morning_routine: "", day_activities: "", evening_routine: "", overnight_support: "" })));
    } else if (dailyRoutines.length > 0 && dailyRoutines.length < 7) {
      // Ensure all 7 days exist
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const updated = days.map(day => {
        const existing = dailyRoutines.find(r => r.day === day);
        return existing || { day, morning_routine: "", day_activities: "", evening_routine: "", overnight_support: "" };
      });
      setDailyRoutines(updated);
    }
  }, [dailyRoutines.length]);

  const sectionKeys = useMemo(() => [
    "generalDetails",
    "decisionMakers",
    "clientGoals",
    "dailyRoutine",
    "supportNeeds",
    "naturalSupports",
    "clinicalManagement",
    "externalProviders",
    "behaviourSupport",
    "healthMedical",
    "riskManagement",
    "communication",
    "housingArrangements",
    "choiceControl",
    "teamMemberRequirements",
    "emergencyInformation",
    "reviewSignatures",
  ], []);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    sectionKeys.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [isExpandedAll, setIsExpandedAll] = useState(true);

  const sectionRefs = useMemo(() => {
    return sectionKeys.reduce((acc, section) => {
      acc[section] = createRef<HTMLDivElement | null>();
      return acc;
    }, {} as Record<string, RefObject<HTMLDivElement | null>>);
  }, [sectionKeys]);

  const toggleExpandAll = () => {
    const nextState = !isExpandedAll;
    setIsExpandedAll(nextState);
    setOpenSections(
      sectionKeys.reduce((acc, sectionKey) => {
        acc[sectionKey] = nextState;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  const handleSectionToggle = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTrackerClick = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: true,
    }));
    const ref = sectionRefs[key];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const trackerSteps = [
    { key: "generalDetails", label: "GENERAL DETAILS" },
    { key: "decisionMakers", label: "DECISION MAKERS" },
    { key: "clientGoals", label: "CLIENT GOALS" },
    { key: "dailyRoutine", label: "DAILY ROUTINE" },
    { key: "supportNeeds", label: "SUPPORT NEEDS" },
    { key: "naturalSupports", label: "NATURAL SUPPORTS" },
    { key: "clinicalManagement", label: "CLINICAL MANAGEMENT" },
    { key: "externalProviders", label: "EXTERNAL PROVIDERS" },
    { key: "behaviourSupport", label: "BEHAVIOUR SUPPORT" },
    { key: "healthMedical", label: "HEALTH & MEDICAL" },
    { key: "riskManagement", label: "RISK MANAGEMENT" },
    { key: "communication", label: "COMMUNICATION" },
    { key: "choiceControl", label: "CHOICE & CONTROL" },
    { key: "teamMemberRequirements", label: "TEAM REQUIREMENTS" },
    { key: "emergencyInformation", label: "EMERGENCY INFO" },
    { key: "reviewSignatures", label: "SIGNATURES" },
  ];

  const scrollToSignature = useCallback(() => {
    setOpenSections((prev) => ({
      ...prev,
      reviewSignatures: true,
    }));
    setTimeout(() => {
      const sigElement = document.getElementById("participant-signature-pad") || document.getElementById("review-signatures-section");
      if (sigElement) {
        sigElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-4 mb-4">
        <div 
          className="flex items-center text-red-600 font-bold bg-yellow-100 px-3 py-1 rounded-lg border border-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-200 transition"
          onClick={scrollToSignature}
        >
          <span className="text-xl mr-2">👉</span>
          <span>Click here to participant signature</span>
        </div>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition border border-gray-300 shadow-sm text-sm"
        >
          {isExpandedAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <Tracker
        steps={trackerSteps}
        onStepClick={handleTrackerClick}
      />

      {/* 1. Client Details */}
      <AccordianPlanSection
        sectionRef={sectionRefs["generalDetails"]}
        title="1. Client Details"
        isOpen={openSections["generalDetails"]}
        onToggle={() => handleSectionToggle("generalDetails")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="relative" onMouseEnter={() => setHoveredField("client_name")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              {hoveredField === "client_name" && (
                <button type="button" onClick={() => handleViewLogs("client_name")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="text"
              name="client_name"
              value={formData.client_name || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField("date_of_birth")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              {hoveredField === "date_of_birth" && (
                <button type="button" onClick={() => handleViewLogs("date_of_birth")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField("ndis_number")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">NDIS Number</label>
              {hoveredField === "ndis_number" && (
                <button type="button" onClick={() => handleViewLogs("ndis_number")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="text"
              name="ndis_number"
              value={formData.ndis_number || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField("address")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {hoveredField === "address" && (
                <button type="button" onClick={() => handleViewLogs("address")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>


          <div className="relative" onMouseEnter={() => setHoveredField("sil_provider")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">SIL Provider</label>
              {hoveredField === "sil_provider" && (
                <button type="button" onClick={() => handleViewLogs("sil_provider")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="text"
              name="sil_provider"
              value={formData.sil_provider || "Best of Homecare"}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-100"
              readOnly
              disabled={isReadOnly}
            />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField("plan_start_date")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Plan Start Date</label>
              {hoveredField === "plan_start_date" && (
                <button type="button" onClick={() => handleViewLogs("plan_start_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="date"
              name="plan_start_date"
              value={formData.plan_start_date || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField("review_date")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Review Date</label>
              {hoveredField === "review_date" && (
                <button type="button" onClick={() => handleViewLogs("review_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <input
              type="date"
              name="review_date"
              value={formData.review_date || ""}
              onChange={handleChange}
              disabled={isReadOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>
        </div>
      </AccordianPlanSection>

      {/* 2. Support with Decision Making */}
      <AccordianPlanSection
        sectionRef={sectionRefs["decisionMakers"]}
        title="2. Support with Decision Making"
        isOpen={openSections["decisionMakers"]}
        onToggle={() => handleSectionToggle("decisionMakers")}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-700">Decision Makers List</h3>
          <button
            type="button"
            onClick={addDecisionMaker}
            disabled={isReadOnly}
            className={`bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            + Add Decision Maker
          </button>
        </div>
        
        <div className="space-y-4">
          {decisionMakers.map((dm, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 border rounded shadow-sm">
              <div className="flex-1 relative" onMouseEnter={() => setHoveredField(`decision_makers_${index}_decision_maker_type`)} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Decision Maker Type</label>
                  {hoveredField === `decision_makers_${index}_decision_maker_type` && (
                    <button type="button" onClick={() => handleViewLogs("decision_makers_decision_maker_type")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="text"
                  value={dm.decision_maker_type || ""}
                  onChange={(e) => handleDecisionMakerChange(index, "decision_maker_type", e.target.value)}
                  disabled={isReadOnly}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                  placeholder="e.g. Self-Decision Maker"
                />
              </div>
              <div className="flex-1 relative" onMouseEnter={() => setHoveredField(`decision_makers_${index}_name_and_contact_details`)} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Name and contact details</label>
                  {hoveredField === `decision_makers_${index}_name_and_contact_details` && (
                    <button type="button" onClick={() => handleViewLogs("decision_makers_name_and_contact_details")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="text"
                  value={dm.name_and_contact_details || ""}
                  onChange={(e) => handleDecisionMakerChange(index, "name_and_contact_details", e.target.value)}
                  disabled={isReadOnly}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                  placeholder="Contact details"
                />
              </div>
              <button
                type="button"
                onClick={() => removeDecisionMaker(index)}
                disabled={isReadOnly}
                className={`bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 h-[40px] ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 3. Client Goals */}
      <AccordianPlanSection
        sectionRef={sectionRefs["clientGoals"]}
        title="3. Client Goals – developed by Best of Homecare and the client (not NDIS Goals)"
        isOpen={openSections["clientGoals"]}
        onToggle={() => handleSectionToggle("clientGoals")}
      >
        <div className="grid grid-cols-1 gap-4">
          {["short_term_goals", "long_term_goals", "living_skills_goals", "community_participation_goals"].map((field) => (
            <div key={field} className="relative" onMouseEnter={() => setHoveredField(`client_goal_${field}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/_/g, " ")}</label>
                {hoveredField === `client_goal_${field}` && (
                  <button type="button" onClick={() => handleViewLogs(`client_goal_${field}`)} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
              </div>
              <textarea
                value={clientGoal[field] || ""}
                onChange={(e) => handleClientGoalChange(field, e.target.value)}
                disabled={isReadOnly}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 4. Daily Living Routine */}
      <AccordianPlanSection
        sectionRef={sectionRefs["dailyRoutine"]}
        title="4. Daily Living Routine (7-Day Overview)"
        isOpen={openSections["dailyRoutine"]}
        onToggle={() => handleSectionToggle("dailyRoutine")}
      >
        <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse border border-gray-200">
          <thead className="bg-blue-100 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold text-gray-900 border border-gray-200">Day</th>
              <th scope="col" className="px-6 py-4 font-bold text-gray-900 border border-gray-200">Morning Routine</th>
              <th scope="col" className="px-6 py-4 font-bold text-gray-900 border border-gray-200">Day Activities</th>
              <th scope="col" className="px-6 py-4 font-bold text-gray-900 border border-gray-200">Evening Routine</th>
              <th scope="col" className="px-6 py-4 font-bold text-gray-900 border border-gray-200">Overnight Support (if applicable)</th>
            </tr>
          </thead>
          <tbody>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
              const routine = dailyRoutines.find(r => r.day === day) || { day, morning_routine: "", day_activities: "", evening_routine: "", overnight_support: "" };
              const rIndex = dailyRoutines.findIndex(r => r.day === day) !== -1 ? dailyRoutines.findIndex(r => r.day === day) : index;
              return (
                <tr key={day} className="border-b bg-white border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900 border border-gray-200 bg-gray-50">{day}</td>
                  {["morning_routine", "day_activities", "evening_routine", "overnight_support"].map((field) => (
                    <td key={field} className="border border-gray-200 p-0 relative" onMouseEnter={() => setHoveredField(`daily_routine_${index}_${field}`)} onMouseLeave={() => setHoveredField(null)}>
                      <div className="h-full w-full relative">
                        {hoveredField === `daily_routine_${index}_${field}` && (
                          <button type="button" onClick={() => handleViewLogs(`daily_routine_${index}_${field}`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                        )}
                        <textarea
                          value={routine[field] || ""}
                          onChange={(e) => handleDailyRoutineChange(rIndex, field, e.target.value)}
                          disabled={isReadOnly}
                          rows={2}
                          className="block w-full h-full border-none focus:ring-0 sm:text-sm p-2 disabled:bg-gray-100 min-w-[200px]"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </AccordianPlanSection>

      {/* 5. Support Needs Overview */}
      <AccordianPlanSection
        sectionRef={sectionRefs["supportNeeds"]}
        title="5. Support Needs Overview"
        isOpen={openSections["supportNeeds"]}
        onToggle={() => handleSectionToggle("supportNeeds")}
      >
        <div className="space-y-4">
          {[
            { key: "personal_care_support", label: "Personal care support:" },
            { key: "domestic_support", label: "Domestic support (cleaning, cooking, laundry):" },
            { key: "community_access_support", label: "Community access support:" },
            { key: "behavioural_or_emotional_support", label: "Behavioural or emotional support needs:" },
            { key: "health_and_medication_support", label: "Health and medication support:" },
            { key: "communication_needs", label: "Communication needs:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`support_need_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `support_need_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`support_need_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `support_need_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`support_need_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={supportNeed[key] || ""}
                  onChange={(e) => handleSupportNeedChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 6. Connection to Family, Friends and Natural Supports */}
      <AccordianPlanSection
        sectionRef={sectionRefs["naturalSupports"]}
        title="6. Connection to Family, Friends and Natural Supports"
        isOpen={openSections["naturalSupports"]}
        onToggle={() => handleSectionToggle("naturalSupports")}
      >
        <div className="relative" onMouseEnter={() => setHoveredField("natural_support_details")} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Natural Supports Details</label>
            {hoveredField === "natural_support_details" && (
              <button type="button" onClick={() => handleViewLogs("natural_support_details")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
            )}
          </div>
          <textarea
            value={naturalSupport.details || ""}
            onChange={(e) => handleNaturalSupportChange(e.target.value)}
            disabled={isReadOnly}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            placeholder="Enter connection to family, friends and natural supports details..."
          />
        </div>
      </AccordianPlanSection>

      {/* 7. Clinical Management Plans */}
      <AccordianPlanSection
        sectionRef={sectionRefs["clinicalManagement"]}
        title="7. Clinical Management Plans (diabetes, mealtime management, medication, etc.)"
        isOpen={openSections["clinicalManagement"]}
        onToggle={() => handleSectionToggle("clinicalManagement")}
      >
        <div className="relative" onMouseEnter={() => setHoveredField("clinical_management_plan_details")} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Clinical Management Details</label>
            {hoveredField === "clinical_management_plan_details" && (
              <button type="button" onClick={() => handleViewLogs("clinical_management_plan_details")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
            )}
          </div>
          <textarea
            value={clinicalManagementPlan.details || ""}
            onChange={(e) => handleClinicalManagementPlanChange(e.target.value)}
            disabled={isReadOnly}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            placeholder="Enter clinical management plans (diabetes, mealtime management, medication, etc.)..."
          />
        </div>
      </AccordianPlanSection>

      {/* 8. External Support Providers */}
      <AccordianPlanSection
        sectionRef={sectionRefs["externalProviders"]}
        title="8. External Support Providers"
        isOpen={openSections["externalProviders"]}
        onToggle={() => handleSectionToggle("externalProviders")}
      >
        <div className="flex justify-end items-center mb-4">
          <button
            type="button"
            onClick={addExternalProvider}
            disabled={isReadOnly}
            className={`bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            + Add External Provider
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Best of Homecare recognises that clients may receive supports from a range of external providers to assist with their health, wellbeing, development and community participation. These providers work alongside SIL supports to ensure a coordinated and person-centred approach.
        </p>

        <h3 className="text-md font-bold text-lime-600 mb-2">External Providers List</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-left text-sm border-collapse border border-gray-200">
            <thead className="bg-blue-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 font-bold text-gray-900 border border-gray-200">Provider Name</th>
                <th className="px-4 py-2 font-bold text-gray-900 border border-gray-200">Service Type</th>
                <th className="px-4 py-2 font-bold text-gray-900 border border-gray-200">Contact Details</th>
                <th className="px-4 py-2 font-bold text-gray-900 border border-gray-200">Key Role in Client Support</th>
                <th className="px-4 py-2 font-bold text-gray-900 border border-gray-200 w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {externalProviders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 border">No external providers added yet. Click "+ Add External Provider" to add one.</td>
                </tr>
              ) : (
                externalProviders.map((ep, idx) => (
                  <tr key={idx} className="bg-white border-b border-gray-200">
                    <td className="p-1 border border-gray-200 relative" onMouseEnter={() => setHoveredField(`ext_prov_${idx}_provider_name`)} onMouseLeave={() => setHoveredField(null)}>
                      {hoveredField === `ext_prov_${idx}_provider_name` && (
                        <button type="button" onClick={() => handleViewLogs(`ext_prov_${idx}_provider_name`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                      )}
                      <input
                        type="text"
                        value={ep.provider_name || ""}
                        onChange={(e) => handleExternalProviderChange(idx, "provider_name", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-2 border-none focus:ring-0 sm:text-sm disabled:bg-gray-100"
                        placeholder="Provider Name"
                      />
                    </td>
                    <td className="p-1 border border-gray-200 relative" onMouseEnter={() => setHoveredField(`ext_prov_${idx}_service_type`)} onMouseLeave={() => setHoveredField(null)}>
                      {hoveredField === `ext_prov_${idx}_service_type` && (
                        <button type="button" onClick={() => handleViewLogs(`ext_prov_${idx}_service_type`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                      )}
                      <input
                        type="text"
                        value={ep.service_type || ""}
                        onChange={(e) => handleExternalProviderChange(idx, "service_type", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-2 border-none focus:ring-0 sm:text-sm disabled:bg-gray-100"
                        placeholder="e.g. GP, OT, Speech..."
                      />
                    </td>
                    <td className="p-1 border border-gray-200 relative" onMouseEnter={() => setHoveredField(`ext_prov_${idx}_contact_details`)} onMouseLeave={() => setHoveredField(null)}>
                      {hoveredField === `ext_prov_${idx}_contact_details` && (
                        <button type="button" onClick={() => handleViewLogs(`ext_prov_${idx}_contact_details`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                      )}
                      <input
                        type="text"
                        value={ep.contact_details || ""}
                        onChange={(e) => handleExternalProviderChange(idx, "contact_details", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-2 border-none focus:ring-0 sm:text-sm disabled:bg-gray-100"
                        placeholder="Contact details"
                      />
                    </td>
                    <td className="p-1 border border-gray-200 relative" onMouseEnter={() => setHoveredField(`ext_prov_${idx}_key_role`)} onMouseLeave={() => setHoveredField(null)}>
                      {hoveredField === `ext_prov_${idx}_key_role` && (
                        <button type="button" onClick={() => handleViewLogs(`ext_prov_${idx}_key_role`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                      )}
                      <input
                        type="text"
                        value={ep.key_role || ""}
                        onChange={(e) => handleExternalProviderChange(idx, "key_role", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full p-2 border-none focus:ring-0 sm:text-sm disabled:bg-gray-100"
                        placeholder="Key role"
                      />
                    </td>
                    <td className="p-2 border border-gray-200 text-center">
                      <button
                        type="button"
                        onClick={() => removeExternalProvider(idx)}
                        disabled={isReadOnly}
                        className={`text-red-600 hover:text-red-800 text-sm font-semibold ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-md font-bold text-lime-600 mb-2">Coordination with stated service providers</h3>
        <p className="text-sm font-medium text-gray-700 mb-2">Best of Homecare will:</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
          <li>support communication with external providers where required;</li>
          <li>implement strategies and recommendations provided by allied health professionals where appropriate;</li>
          <li>participate in care team meetings when requested or authorised;</li>
          <li>ensure information sharing occurs with appropriate consent; and</li>
          <li>maintain updated records of external provider involvement.</li>
        </ul>
      </AccordianPlanSection>

      {/* 9. Behaviour Support */}
      <AccordianPlanSection
        sectionRef={sectionRefs["behaviourSupport"]}
        title="9. Behaviour Support (if applicable)"
        isOpen={openSections["behaviourSupport"]}
        onToggle={() => handleSectionToggle("behaviourSupport")}
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField("beh_supp_bsp_in_place")} onMouseLeave={() => setHoveredField(null)}>
            <div className="w-full md:w-1/3 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Behaviour Support Plan in place?</label>
              {hoveredField === "beh_supp_bsp_in_place" && (
                <button type="button" onClick={() => handleViewLogs("beh_supp_bsp_in_place")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <div className="w-full md:w-2/3 flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="bsp_in_place"
                  value="Yes"
                  checked={behaviourSupport.bsp_in_place === "Yes"}
                  onChange={(e) => handleBehaviourSupportChange("bsp_in_place", e.target.value)}
                  disabled={isReadOnly}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="bsp_in_place"
                  value="No"
                  checked={behaviourSupport.bsp_in_place === "No"}
                  onChange={(e) => handleBehaviourSupportChange("bsp_in_place", e.target.value)}
                  disabled={isReadOnly}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {[
            { key: "key_triggers", label: "Key triggers:" },
            { key: "early_warning_signs", label: "Early warning signs:" },
            { key: "de_escalation_strategies", label: "De-escalation strategies:" },
            { key: "prohibited_practices", label: "Prohibited practices:" },
            { key: "approved_strategies", label: "Approved strategies:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`beh_supp_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `beh_supp_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`beh_supp_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `beh_supp_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`beh_supp_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={behaviourSupport[key] || ""}
                  onChange={(e) => handleBehaviourSupportChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 10. Health & Medical */}
      <AccordianPlanSection
        sectionRef={sectionRefs["healthMedical"]}
        title="10. Health & Medical"
        isOpen={openSections["healthMedical"]}
        onToggle={() => handleSectionToggle("healthMedical")}
      >
        <div className="space-y-4">
          {[
            { key: "gp_details", label: "GP details:" },
            { key: "allergies", label: "Allergies:" },
            { key: "medications", label: "Medications:" },
            { key: "health_risks", label: "Health risks:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`hlth_med_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `hlth_med_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`hlth_med_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `hlth_med_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`hlth_med_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={healthMedical[key] || ""}
                  onChange={(e) => handleHealthMedicalChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 11. Risk Management */}
      <AccordianPlanSection
        sectionRef={sectionRefs["riskManagement"]}
        title="11. Risk Management"
        isOpen={openSections["riskManagement"]}
        onToggle={() => handleSectionToggle("riskManagement")}
      >
        <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border-collapse border border-gray-200">
          <thead className="bg-blue-100 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/6">Risk Type</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/4">Description of Risk</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/8">Likelihood</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/8">Impact</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/4">Control Measures</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-900 border border-gray-200 w-1/6">Responsible Person</th>
            </tr>
          </thead>
          <tbody>
            {["Personal care risk", "Home environment", "Community access", "Medication management", "Clinical/health risk"].map((riskType, index) => {
              const risk = riskManagements.find(r => r.risk_type === riskType) || { risk_type: riskType, description_of_risk: "", likelihood: "", impact: "", control_measures: "", responsible_person: "" };
              const rIndex = riskManagements.findIndex(r => r.risk_type === riskType) !== -1 ? riskManagements.findIndex(r => r.risk_type === riskType) : index;
              return (
                <tr key={riskType} className="border-b bg-white border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-900 border border-gray-200 bg-gray-50">{riskType}</td>
                  {["description_of_risk", "likelihood", "impact", "control_measures", "responsible_person"].map((field) => (
                    <td key={field} className="border border-gray-200 p-0 relative" onMouseEnter={() => setHoveredField(`risk_mgmt_${index}_${field}`)} onMouseLeave={() => setHoveredField(null)}>
                      <div className="h-full w-full relative">
                        {hoveredField === `risk_mgmt_${index}_${field}` && (
                          <button type="button" onClick={() => handleViewLogs(`risk_mgmt_${index}_${field}`)} className="absolute top-1 right-1 text-[10px] btn-primary text-white px-1 py-0.5 rounded z-10">Logs</button>
                        )}
                        <textarea
                          value={risk[field] || ""}
                          onChange={(e) => handleRiskManagementChange(rIndex, field, e.target.value)}
                          disabled={isReadOnly}
                          rows={2}
                          className="block w-full h-full border-none focus:ring-0 sm:text-sm p-2 disabled:bg-gray-100 min-w-[120px]"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </AccordianPlanSection>

      {/* 12. Communication */}
      <AccordianPlanSection
        sectionRef={sectionRefs["communication"]}
        title="12. Communication"
        isOpen={openSections["communication"]}
        onToggle={() => handleSectionToggle("communication")}
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField("comm_communication_method")} onMouseLeave={() => setHoveredField(null)}>
            <div className="w-full md:w-1/3 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Communication method:</label>
              {hoveredField === "comm_communication_method" && (
                <button type="button" onClick={() => handleViewLogs("comm_communication_method")} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
              )}
            </div>
            <div className="w-full md:w-2/3 relative">
              {hoveredField === "comm_communication_method" && (
                <button type="button" onClick={() => handleViewLogs("comm_communication_method")} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
              <textarea
                value={communication.communication_method || ""}
                onChange={(e) => handleCommunicationChange("communication_method", e.target.value)}
                disabled={isReadOnly}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField("comm_support_required")} onMouseLeave={() => setHoveredField(null)}>
            <div className="w-full md:w-1/3 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Support required:</label>
              {hoveredField === "comm_support_required" && (
                <button type="button" onClick={() => handleViewLogs("comm_support_required")} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
              )}
            </div>
            <div className="w-full md:w-2/3 relative">
              {hoveredField === "comm_support_required" && (
                <button type="button" onClick={() => handleViewLogs("comm_support_required")} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
              <textarea
                value={communication.support_required || ""}
                onChange={(e) => handleCommunicationChange("support_required", e.target.value)}
                disabled={isReadOnly}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField("comm_interpreter_required")} onMouseLeave={() => setHoveredField(null)}>
            <div className="w-full md:w-1/3 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Interpreter required</label>
              {hoveredField === "comm_interpreter_required" && (
                <button type="button" onClick={() => handleViewLogs("comm_interpreter_required")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
              )}
            </div>
            <div className="w-full md:w-2/3 flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="interpreter_required"
                  value="Yes"
                  checked={communication.interpreter_required === "Yes"}
                  onChange={(e) => handleCommunicationChange("interpreter_required", e.target.value)}
                  disabled={isReadOnly}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="interpreter_required"
                  value="No"
                  checked={communication.interpreter_required === "No"}
                  onChange={(e) => handleCommunicationChange("interpreter_required", e.target.value)}
                  disabled={isReadOnly}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </AccordianPlanSection>

      {/* 13. Choice & Control */}
      <AccordianPlanSection
        sectionRef={sectionRefs["choiceControl"]}
        title="13. Choice & Control"
        isOpen={openSections["choiceControl"]}
        onToggle={() => handleSectionToggle("choiceControl")}
      >
        <div className="space-y-4">
          {[
            { key: "daily_choices", label: "Daily choices:" },
            { key: "meal_choices", label: "Meal choices:" },
            { key: "activities_and_outings", label: "Activities and outings:" },
            { key: "household_decisions", label: "Household decisions:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`choice_ctrl_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `choice_ctrl_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`choice_ctrl_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `choice_ctrl_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`choice_ctrl_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={choiceControl[key] || ""}
                  onChange={(e) => handleChoiceControlChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 14. Team Member Requirements */}
      <AccordianPlanSection
        sectionRef={sectionRefs["teamMemberRequirements"]}
        title="14. Team Member Requirements"
        isOpen={openSections["teamMemberRequirements"]}
        onToggle={() => handleSectionToggle("teamMemberRequirements")}
      >
        <div className="space-y-4">
          {[
            { key: "staffing_ratio", label: "Staffing ratio:" },
            { key: "team_member_preferences", label: "Team Member preferences:" },
            { key: "training_requirements", label: "Training requirements:" },
            { key: "continuity_requirements", label: "Continuity requirements:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`team_req_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `team_req_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`team_req_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `team_req_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`team_req_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={teamMemberRequirement[key] || ""}
                  onChange={(e) => handleTeamMemberRequirementChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 15. Emergency Information */}
      <AccordianPlanSection
        sectionRef={sectionRefs["emergencyInformation"]}
        title="15. Emergency Information"
        isOpen={openSections["emergencyInformation"]}
        onToggle={() => handleSectionToggle("emergencyInformation")}
      >
        <div className="space-y-4">
          {[
            { key: "emergency_contacts", label: "Emergency contacts:" },
            { key: "evacuation_plan", label: "Evacuation plan:" },
            { key: "emergency_procedures", label: "Emergency procedures:" },
            { key: "after_hours_support", label: "After-hours support:" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 border rounded shadow-sm relative" onMouseEnter={() => setHoveredField(`emerg_info_${key}`)} onMouseLeave={() => setHoveredField(null)}>
              <div className="w-full md:w-1/3 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {hoveredField === `emerg_info_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`emerg_info_${key}`)} className="text-xs btn-primary text-white px-2 py-1 rounded md:hidden">View Logs</button>
                )}
              </div>
              <div className="w-full md:w-2/3 relative">
                {hoveredField === `emerg_info_${key}` && (
                  <button type="button" onClick={() => handleViewLogs(`emerg_info_${key}`)} className="hidden md:block absolute -top-8 right-0 text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                )}
                <textarea
                  value={emergencyInformation[key] || ""}
                  onChange={(e) => handleEmergencyInformationChange(key, e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </AccordianPlanSection>

      {/* 16. Review & Signatures */}
      <AccordianPlanSection
        sectionRef={sectionRefs["reviewSignatures"]}
        title="16. Review & Signatures"
        isOpen={openSections["reviewSignatures"]}
        onToggle={() => handleSectionToggle("reviewSignatures")}
      >
        <div className="space-y-6" id="review-signatures-section">
          {/* Signer Type Radio Choice */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center bg-gray-50 p-4 border rounded shadow-sm">
            <span className="font-semibold text-gray-800">Signing As:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="signer_type"
                value="participant"
                checked={(reviewSignature.signer_type || "participant") === "participant"}
                onChange={() => handleReviewSignatureChange("signer_type", "participant")}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2 font-medium text-gray-700">Participant</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="signer_type"
                value="representative"
                checked={reviewSignature.signer_type === "representative"}
                onChange={() => handleReviewSignatureChange("signer_type", "representative")}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2 font-medium text-gray-700">Representative</span>
            </label>
          </div>

          {/* Conditional: Participant vs Representative Details */}
          {(reviewSignature.signer_type || "participant") === "participant" ? (
            <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
              <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Participant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_participant_name")} onMouseLeave={() => setHoveredField(null)}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Participant Name</label>
                    {hoveredField === "rev_sig_participant_name" && (
                      <button type="button" onClick={() => handleViewLogs("rev_sig_participant_name")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reviewSignature.participant_name ?? reviewSignature.client ?? ""}
                    onChange={(e) => handleReviewSignatureChange("participant_name", e.target.value)}
                    placeholder="Enter participant name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_participant_date")} onMouseLeave={() => setHoveredField(null)}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    {hoveredField === "rev_sig_participant_date" && (
                      <button type="button" onClick={() => handleViewLogs("rev_sig_participant_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={reviewSignature.participant_date ?? reviewSignature.date ?? ""}
                    onChange={(e) => handleReviewSignatureChange("participant_date", e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
              <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Representative Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_representative_name")} onMouseLeave={() => setHoveredField(null)}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Representative Name</label>
                    {hoveredField === "rev_sig_representative_name" && (
                      <button type="button" onClick={() => handleViewLogs("rev_sig_representative_name")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reviewSignature.representative_name || ""}
                    onChange={(e) => handleReviewSignatureChange("representative_name", e.target.value)}
                    placeholder="Enter representative name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_representative_relation")} onMouseLeave={() => setHoveredField(null)}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Relation to the participant</label>
                    {hoveredField === "rev_sig_representative_relation" && (
                      <button type="button" onClick={() => handleViewLogs("rev_sig_representative_relation")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reviewSignature.representative_relation || ""}
                    onChange={(e) => handleReviewSignatureChange("representative_relation", e.target.value)}
                    placeholder="e.g. Parent, Advocate"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_representative_date")} onMouseLeave={() => setHoveredField(null)}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    {hoveredField === "rev_sig_representative_date" && (
                      <button type="button" onClick={() => handleViewLogs("rev_sig_representative_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={reviewSignature.representative_date ?? reviewSignature.date ?? ""}
                    onChange={(e) => handleReviewSignatureChange("representative_date", e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 border rounded-lg shadow-sm">
            <SingleSignaturePad
              label={(reviewSignature.signer_type || "participant") === "participant" ? "Participant Signature" : "Representative Signature"}
              elementId={(reviewSignature.signer_type || "participant") === "participant" ? "participant-signature-pad" : "representative-signature-pad"}
              value={reviewSignature.signer_type === "representative" ? (reviewSignature.representative_signature || reviewSignature.participant_signature || "") : (reviewSignature.participant_signature || "")}
              onChange={(val) => {
                if (reviewSignature.signer_type === "representative") {
                  handleReviewSignatureChange("representative_signature", val);
                  handleReviewSignatureChange("participant_signature", val);
                } else {
                  handleReviewSignatureChange("participant_signature", val);
                }
              }}
            />
          </div>

          {/* Guardian / Nominee Section */}
          <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
            <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Guardian / Nominee</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_guardian_nominee_name")} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Guardian/Nominee Name</label>
                  {hoveredField === "rev_sig_guardian_nominee_name" && (
                    <button type="button" onClick={() => handleViewLogs("rev_sig_guardian_nominee_name")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="text"
                  value={reviewSignature.guardian_nominee_name ?? reviewSignature.guardian_nominee ?? ""}
                  onChange={(e) => handleReviewSignatureChange("guardian_nominee_name", e.target.value)}
                  placeholder="Enter guardian/nominee name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_guardian_nominee_date")} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  {hoveredField === "rev_sig_guardian_nominee_date" && (
                    <button type="button" onClick={() => handleViewLogs("rev_sig_guardian_nominee_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="date"
                  value={reviewSignature.guardian_nominee_date ?? reviewSignature.date ?? ""}
                  onChange={(e) => handleReviewSignatureChange("guardian_nominee_date", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            <SingleSignaturePad
              label="Guardian / Nominee Signature"
              elementId="guardian-signature-pad"
              value={reviewSignature.guardian_nominee_signature || ""}
              onChange={(val) => handleReviewSignatureChange("guardian_nominee_signature", val)}
            />
          </div>

          {/* SIL Coordinator Section */}
          <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
            <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">SIL Coordinator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_key_team_member_name")} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">SIL Coordinator Name</label>
                  {hoveredField === "rev_sig_key_team_member_name" && (
                    <button type="button" onClick={() => handleViewLogs("rev_sig_key_team_member_name")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="text"
                  value={reviewSignature.key_team_member_name ?? reviewSignature.key_team_member ?? ""}
                  onChange={(e) => handleReviewSignatureChange("key_team_member_name", e.target.value)}
                  placeholder="Enter SIL coordinator name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="relative" onMouseEnter={() => setHoveredField("rev_sig_key_team_member_date")} onMouseLeave={() => setHoveredField(null)}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  {hoveredField === "rev_sig_key_team_member_date" && (
                    <button type="button" onClick={() => handleViewLogs("rev_sig_key_team_member_date")} className="text-xs btn-primary text-white px-2 py-1 rounded">View Logs</button>
                  )}
                </div>
                <input
                  type="date"
                  value={reviewSignature.key_team_member_date ?? reviewSignature.date ?? ""}
                  onChange={(e) => handleReviewSignatureChange("key_team_member_date", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            <SingleSignaturePad
              label="SIL Coordinator Signature"
              elementId="key-team-signature-pad"
              value={reviewSignature.key_team_member_signature || ""}
              onChange={(val) => handleReviewSignatureChange("key_team_member_signature", val)}
            />
          </div>
        </div>
      </AccordianPlanSection>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url="sil-support-plan/logs"
        table={
          selectedField?.startsWith("decision_makers_") ? "sil_support_plan_decision_makers" :
          selectedField?.startsWith("client_goal_") ? "sil_support_plan_client_goals" :
          selectedField?.startsWith("daily_routine_") ? "sil_support_plan_daily_routines" :
          selectedField?.startsWith("support_need_") ? "sil_support_plan_support_needs" :
          selectedField === "natural_support_details" ? "sil_support_plan_natural_supports" :
          selectedField === "clinical_management_plan_details" ? "sil_support_plan_clinical_management_plans" :
          selectedField?.startsWith("ext_prov_") ? "sil_support_plan_external_providers" :
          selectedField?.startsWith("beh_supp_") ? "sil_support_plan_behaviour_supports" :
          selectedField?.startsWith("hlth_med_") ? "sil_support_plan_health_medicals" :
          selectedField?.startsWith("risk_mgmt_") ? "sil_support_plan_risk_managements" :
          selectedField?.startsWith("comm_") ? "sil_support_plan_communications" :
          selectedField?.startsWith("house_arr_") ? "sil_support_plan_housing_arrangements" :
          selectedField?.startsWith("choice_ctrl_") ? "sil_support_plan_choice_controls" :
          selectedField?.startsWith("team_req_") ? "sil_support_plan_team_member_requirements" :
          selectedField?.startsWith("emerg_info_") ? "sil_support_plan_emergency_information" :
          selectedField?.startsWith("rev_sig_") ? "sil_support_plan_review_signatures" :
          "sil_support_plans"
        }
        field={
          selectedField?.startsWith("decision_makers_") ? selectedField.replace("decision_makers_", "") :
          selectedField?.startsWith("client_goal_") ? selectedField.replace("client_goal_", "") :
          selectedField?.startsWith("daily_routine_") ? selectedField.replace(/daily_routine_\d+_/, "") :
          selectedField?.startsWith("support_need_") ? selectedField.replace("support_need_", "") :
          (selectedField === "natural_support_details" || selectedField === "clinical_management_plan_details") ? "details" :
          selectedField?.startsWith("ext_prov_") ? selectedField.replace(/ext_prov_\d+_/, "") :
          selectedField?.startsWith("beh_supp_") ? selectedField.replace("beh_supp_", "") :
          selectedField?.startsWith("hlth_med_") ? selectedField.replace("hlth_med_", "") :
          selectedField?.startsWith("risk_mgmt_") ? selectedField.replace(/risk_mgmt_\d+_/, "") :
          selectedField?.startsWith("comm_") ? selectedField.replace("comm_", "") :
          selectedField?.startsWith("house_arr_") ? selectedField.replace("house_arr_", "") :
          selectedField?.startsWith("choice_ctrl_") ? selectedField.replace("choice_ctrl_", "") :
          selectedField?.startsWith("team_req_") ? selectedField.replace("team_req_", "") :
          selectedField?.startsWith("emerg_info_") ? selectedField.replace("emerg_info_", "") :
          selectedField?.startsWith("rev_sig_") ? selectedField.replace("rev_sig_", "") :
          selectedField || ""
        }
        uuid={uuid || ""}
      />
    </div>
  );
}
