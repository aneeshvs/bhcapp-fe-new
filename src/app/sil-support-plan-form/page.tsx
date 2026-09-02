"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormSession, index, update, show } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import SilSupportPlanForm from "@/src/components/SilSupportPlan";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";
import api from "@/src/utils/api";
import Image from "next/image";

export default function SilSupportPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [autofilling, setAutofilling] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState<any>({ sil_provider: "Best of Homecare" });
  const [decisionMakers, setDecisionMakers] = useState<any[]>([]);
  const [clientGoal, setClientGoal] = useState<any>({});
  const [dailyRoutines, setDailyRoutines] = useState<any[]>([]);
  const [supportNeed, setSupportNeed] = useState<any>({});
  const [naturalSupport, setNaturalSupport] = useState<any>({});
  const [clinicalManagementPlan, setClinicalManagementPlan] = useState<any>({});
  const [externalProviders, setExternalProviders] = useState<any[]>([]);
  const [behaviourSupport, setBehaviourSupport] = useState<any>({});
  const [healthMedical, setHealthMedical] = useState<any>({});
  const [riskManagements, setRiskManagements] = useState<any[]>([]);
  const [communication, setCommunication] = useState<any>({});
  const [housingArrangement, setHousingArrangement] = useState<any>({});
  const [choiceControl, setChoiceControl] = useState<any>({});
  const [teamMemberRequirement, setTeamMemberRequirement] = useState<any>({});
  const [emergencyInformation, setEmergencyInformation] = useState<any>({});
  const [reviewSignature, setReviewSignature] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const formUuid = searchParams.get("form-uuid") || searchParams.get("uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        try {
          const { client_name, uuid } = await getFormSession("sil-support-plan", formUuid, sessionUserId, sessionClientType);
          if (client_name && client_name !== "Unknown") setClientName(client_name);
          if (uuid) setSessionUuid(uuid);
        } catch (e) {
          console.error("getFormSession failed", e);
        }

        if (token) {
          try {
            await me();
            setFlag(true);
            fetchFormData();
          } catch (e) {
            setShowLoginModal(true);
          }
        } else {
          setShowLoginModal(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [searchParams]);

  const fetchFormData = async () => {
    try {
      const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
      
      let basicDetails: any = null;
      if (sessionUserId) {
        try {
          const res = await index<any>("get-client-basic-details", { userid: sessionUserId, client_type: sessionClientType });
          if (res.success && res.data) {
            basicDetails = res.data;
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
      }

      if (!effectiveUuid) {
        if (basicDetails) {
          setFormData((prev: any) => ({
            ...prev,
            client_name: basicDetails.participant_name || prev.client_name || '',
            date_of_birth: basicDetails.dob || prev.date_of_birth || '',
            ndis_number: basicDetails.ndis_number || prev.ndis_number || '',
            address: basicDetails.address || prev.address || '',
            sil_provider: prev.sil_provider || "Best of Homecare"
          }));
          if (basicDetails.participant_name) {
            setClientName(basicDetails.participant_name);
          }
          if (basicDetails.representative_name) {
            setDecisionMakers((prev: any[]) => {
              if (prev.length === 0 || (prev.length === 1 && !prev[0].name_and_contact_details)) {
                return [{
                  decision_maker_type: basicDetails.representative_relationship || 'Emergency Contact',
                  name_and_contact_details: `${basicDetails.representative_name}${basicDetails.representative_contact ? ' - ' + basicDetails.representative_contact : ''}`
                }];
              }
              return prev;
            });
          }
        }
        return;
      }

      const response = await show<any>("sil-support-plan-show", effectiveUuid);
      if (response?.data) {
        setFormData((prev: any) => ({
          ...prev,
          ...response.data,
          client_name: response.data.client_name || basicDetails?.participant_name || prev.client_name || '',
          date_of_birth: response.data.date_of_birth || basicDetails?.dob || prev.date_of_birth || '',
          ndis_number: response.data.ndis_number || basicDetails?.ndis_number || prev.ndis_number || '',
          address: response.data.address || basicDetails?.address || prev.address || '',
          sil_provider: response.data.sil_provider || prev.sil_provider || "Best of Homecare",
        }));
        if (response.data.client_name && response.data.client_name !== "Unknown") {
          setClientName(response.data.client_name);
        } else if (basicDetails?.participant_name) {
          setClientName(basicDetails.participant_name);
        } else {
          const uId = response.data.user_id || sessionUserId;
          const cType = response.data.client_type || sessionClientType;
          if (uId) {
            try {
              const sessionRes = await getFormSession("sil-support-plan", effectiveUuid, String(uId), String(cType));
              if (sessionRes?.client_name && sessionRes.client_name !== "Unknown") {
                setClientName(sessionRes.client_name);
              }
            } catch (err) {
              console.error("Fallback getFormSession failed", err);
            }
          }
        }
        if (response.data.completion_percentage !== undefined) {
          setCompletionPercentage(response.data.completion_percentage);
        }
        if (response.data.decision_makers && response.data.decision_makers.length > 0) {
          setDecisionMakers(response.data.decision_makers);
        } else if (basicDetails?.representative_name) {
          setDecisionMakers([{
            decision_maker_type: basicDetails.representative_relationship || 'Emergency Contact',
            name_and_contact_details: `${basicDetails.representative_name}${basicDetails.representative_contact ? ' - ' + basicDetails.representative_contact : ''}`
          }]);
        }
        if (response.data.client_goal) {
          setClientGoal(response.data.client_goal);
        }
        if (response.data.daily_routines) {
          setDailyRoutines(response.data.daily_routines);
        }
        if (response.data.support_need) {
          setSupportNeed(response.data.support_need);
        }
        if (response.data.natural_support) {
          setNaturalSupport(response.data.natural_support);
        }
        if (response.data.clinical_management_plan) {
          setClinicalManagementPlan(response.data.clinical_management_plan);
        }
        if (response.data.external_providers) {
          setExternalProviders(response.data.external_providers);
        }
        if (response.data.behaviour_support) {
          setBehaviourSupport(response.data.behaviour_support);
        }
        if (response.data.health_medical) {
          setHealthMedical(response.data.health_medical);
        }
        if (response.data.risk_managements) {
          setRiskManagements(response.data.risk_managements);
        }
        if (response.data.communication) {
          setCommunication(response.data.communication);
        }
        if (response.data.housing_arrangement) {
          setHousingArrangement(response.data.housing_arrangement);
        }
        if (response.data.choice_control) {
          setChoiceControl(response.data.choice_control);
        }
        if (response.data.team_member_requirement) {
          setTeamMemberRequirement(response.data.team_member_requirement);
        }
        if (response.data.emergency_information) {
          setEmergencyInformation(response.data.emergency_information);
        }
        if (response.data.review_signature) {
          setReviewSignature(response.data.review_signature);
        }
      }
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    if (sessionUserId && sessionClientType) {
      fetchFormData();
    }
  }, [sessionUuid, sessionUserId, sessionClientType]);

  const handleAutofill = async () => {
    setAutofilling(true);
    try {
      const targetUserId = sessionUserId || searchParams.get("userid") || "";
      const targetClientType = sessionClientType || searchParams.get("client_type") || "";

      if (!targetUserId || !targetClientType) {
        alert("Client session identifiers missing. Please ensure userid and client_type are present in the URL.");
        setAutofilling(false);
        return;
      }

      const schema = {
        formData: {
          client_name: "string (Full name of participant)",
          date_of_birth: "string (YYYY-MM-DD format)",
          ndis_number: "string (NDIS Number)",
          address: "string (Participant primary residential address)",
          sil_provider: "string (SIL Provider name, default Best of Homecare)",
          plan_start_date: "string (Plan start date YYYY-MM-DD)",
          review_date: "string (Plan review date YYYY-MM-DD)"
        },
        decisionMakers: [{
          decision_maker_type: "string (Type/Relationship, e.g. Emergency Contact, Legal Guardian, Family Member)",
          name_and_contact_details: "string (Name and phone number / email / contact details)"
        }],
        clientGoal: {
          short_term_goals: "string (Comprehensive short term goal narrative based on extracted client profile context; MUST be a detailed person-centered narrative of MINIMUM 300 CHARACTERS detailing outcomes, support strategies, and milestones)",
          long_term_goals: "string (Comprehensive long term goal narrative based on extracted client profile context; MUST be a detailed person-centered narrative of MINIMUM 300 CHARACTERS detailing long-term vision, milestones, and ongoing support approach)",
          living_skills_goals: "string (Comprehensive independent living skills goal narrative based on extracted client profile context; MUST be a detailed narrative of MINIMUM 300 CHARACTERS detailing daily living activities, training, and support routines)",
          community_participation_goals: "string (Comprehensive community participation & social engagement goal narrative based on extracted client profile context; MUST be a detailed narrative of MINIMUM 300 CHARACTERS detailing community access, transport, and social connection strategies)"
        },
        dailyRoutines: [
          { day: "Monday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Tuesday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Wednesday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Thursday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Friday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Saturday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" },
          { day: "Sunday", morning_routine: "string", day_activities: "string", evening_routine: "string", overnight_support: "string" }
        ],
        supportNeed: {
          personal_care_support: "string (Personal care support details)",
          domestic_support: "string (Domestic cleaning, cooking, laundry support)",
          community_access_support: "string (Community access support details)",
          behavioural_or_emotional_support: "string (Behavioural/emotional support details)",
          health_and_medication_support: "string (Health & medication support details)",
          communication_needs: "string (Communication support needs)"
        },
        naturalSupport: {
          details: "string (Connection to family, friends and natural supports)"
        },
        clinicalManagementPlan: {
          details: "string (Clinical management plans, diabetes, mealtime, medication)"
        },
        externalProviders: [{
          provider_name: "string (Provider name)",
          service_type: "string (Service type e.g. GP, OT, Physio, Speech)",
          contact_details: "string (Contact info)",
          key_role: "string (Key role in client support)"
        }],
        behaviourSupport: {
          bsp_in_place: "string (Yes or No)",
          key_triggers: "string (Key triggers)",
          early_warning_signs: "string (Early warning signs)",
          de_escalation_strategies: "string (De-escalation strategies)",
          prohibited_practices: "string (Prohibited practices)",
          approved_strategies: "string (Approved strategies)"
        },
        healthMedical: {
          gp_details: "string (GP details)",
          allergies: "string (Allergies)",
          medications: "string (Medications)",
          health_risks: "string (Health risks)"
        },
        riskManagements: [
          { risk_type: "Personal care risk", description_of_risk: "string", likelihood: "string", impact: "string", control_measures: "string", responsible_person: "string" },
          { risk_type: "Home environment", description_of_risk: "string", likelihood: "string", impact: "string", control_measures: "string", responsible_person: "string" },
          { risk_type: "Community access", description_of_risk: "string", likelihood: "string", impact: "string", control_measures: "string", responsible_person: "string" },
          { risk_type: "Medication management", description_of_risk: "string", likelihood: "string", impact: "string", control_measures: "string", responsible_person: "string" },
          { risk_type: "Clinical/health risk", description_of_risk: "string", likelihood: "string", impact: "string", control_measures: "string", responsible_person: "string" }
        ],
        communication: {
          communication_method: "string (Communication method)",
          support_required: "string (Support required)",
          interpreter_required: "string (Yes or No)"
        },
        choiceControl: {
          daily_choices: "string (Daily choices)",
          meal_choices: "string (Meal choices)",
          activities_and_outings: "string (Activities and outings)",
          household_decisions: "string (Household decisions)"
        },
        teamMemberRequirement: {
          staffing_ratio: "string (Staffing ratio)",
          team_member_preferences: "string (Team member preferences)",
          training_requirements: "string (Training requirements)",
          continuity_requirements: "string (Continuity requirements)"
        },
        emergencyInformation: {
          emergency_contacts: "string (Emergency contacts)",
          evacuation_plan: "string (Evacuation plan)",
          emergency_procedures: "string (Emergency procedures)",
          after_hours_support: "string (After-hours support)"
        },
        reviewSignature: {
          signer_type: "string (participant or representative)",
          participant_name: "string (Participant name)",
          participant_date: "string (Date YYYY-MM-DD)",
          representative_name: "string (Representative name)",
          relationship_to_participant: "string (Relationship)",
          representative_date: "string (Date YYYY-MM-DD)"
        }
      };

      const response = await api.post("/ai/autofill-form", {
        user_id: targetUserId,
        client_type: targetClientType,
        schema: schema
      });

      if (response.data.success) {
        const d = response.data.data;
        if (d.formData) {
          setFormData((prev: any) => ({
            ...prev,
            ...d.formData,
            sil_provider: d.formData.sil_provider || prev.sil_provider || "Best of Homecare"
          }));
          if (d.formData.client_name) setClientName(d.formData.client_name);
        }
        if (d.decisionMakers?.length) {
          setDecisionMakers(d.decisionMakers);
        }
        if (d.clientGoal) {
          setClientGoal((prev: any) => ({ ...prev, ...d.clientGoal }));
        }
        if (d.dailyRoutines?.length) {
          setDailyRoutines(d.dailyRoutines);
        }
        if (d.supportNeed) {
          setSupportNeed((prev: any) => ({ ...prev, ...d.supportNeed }));
        }
        if (d.naturalSupport) {
          setNaturalSupport((prev: any) => ({ ...prev, ...d.naturalSupport }));
        }
        if (d.clinicalManagementPlan) {
          setClinicalManagementPlan((prev: any) => ({ ...prev, ...d.clinicalManagementPlan }));
        }
        if (d.externalProviders?.length) {
          setExternalProviders(d.externalProviders);
        }
        if (d.behaviourSupport) {
          setBehaviourSupport((prev: any) => ({ ...prev, ...d.behaviourSupport }));
        }
        if (d.healthMedical) {
          setHealthMedical((prev: any) => ({ ...prev, ...d.healthMedical }));
        }
        if (d.riskManagements?.length) {
          setRiskManagements(d.riskManagements);
        }
        if (d.communication) {
          setCommunication((prev: any) => ({ ...prev, ...d.communication }));
        }
        if (d.choiceControl) {
          setChoiceControl((prev: any) => ({ ...prev, ...d.choiceControl }));
        }
        if (d.teamMemberRequirement) {
          setTeamMemberRequirement((prev: any) => ({ ...prev, ...d.teamMemberRequirement }));
        }
        if (d.emergencyInformation) {
          setEmergencyInformation((prev: any) => ({ ...prev, ...d.emergencyInformation }));
        }
        if (d.reviewSignature) {
          setReviewSignature((prev: any) => ({ ...prev, ...d.reviewSignature }));
        }

        window.alert("SIL Support Plan auto-filled successfully using AI!");
      } else {
        alert(response.data.message || "Failed to auto-fill form.");
      }
    } catch (e: any) {
      console.error("Autofill Error:", e);
      alert(e.response?.data?.message || e.message || "An error occurred during AI Autofill.");
    } finally {
      setAutofilling(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const saveForm = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && typeof value !== 'object') {
          data.append(key, String(value));
        }
      });
      data.append("user_id", sessionUserId);
      data.append("client_type", sessionClientType);
      if (clientName && clientName !== "Unknown") {
        data.append("client_name", clientName);
      }
      
      decisionMakers.forEach((dm, i) => {
        data.append(`decision_makers[${i}][decision_maker_type]`, dm.decision_maker_type || "");
        data.append(`decision_makers[${i}][name_and_contact_details]`, dm.name_and_contact_details || "");
      });

      if (clientGoal) {
        Object.entries(clientGoal).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`client_goal[${k}]`, String(v));
          }
        });
      }

      dailyRoutines.forEach((dr, i) => {
        Object.entries(dr).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`daily_routines[${i}][${k}]`, String(v));
          }
        });
      });

      if (supportNeed) {
        Object.entries(supportNeed).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`support_need[${k}]`, String(v));
          }
        });
      }

      if (naturalSupport) {
        Object.entries(naturalSupport).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`natural_support[${k}]`, String(v));
          }
        });
      }

      if (clinicalManagementPlan) {
        Object.entries(clinicalManagementPlan).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`clinical_management_plan[${k}]`, String(v));
          }
        });
      }

      externalProviders.forEach((ep, i) => {
        Object.entries(ep).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`external_providers[${i}][${k}]`, String(v));
          }
        });
      });

      if (behaviourSupport) {
        Object.entries(behaviourSupport).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`behaviour_support[${k}]`, String(v));
          }
        });
      }

      if (healthMedical) {
        Object.entries(healthMedical).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`health_medical[${k}]`, String(v));
          }
        });
      }

      riskManagements.forEach((rm, i) => {
        Object.entries(rm).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`risk_managements[${i}][${k}]`, String(v));
          }
        });
      });

      if (communication) {
        Object.entries(communication).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`communication[${k}]`, String(v));
          }
        });
      }

      if (housingArrangement) {
        Object.entries(housingArrangement).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`housing_arrangement[${k}]`, String(v));
          }
        });
      }

      if (choiceControl) {
        Object.entries(choiceControl).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`choice_control[${k}]`, String(v));
          }
        });
      }

      if (teamMemberRequirement) {
        Object.entries(teamMemberRequirement).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`team_member_requirement[${k}]`, String(v));
          }
        });
      }

      if (emergencyInformation) {
        Object.entries(emergencyInformation).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`emergency_information[${k}]`, String(v));
          }
        });
      }

      if (reviewSignature) {
        Object.entries(reviewSignature).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            data.append(`review_signature[${k}]`, String(v));
          }
        });
      }

      const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
      if (effectiveUuid) data.append("uuid", effectiveUuid);

      const response = await update<any>("sil-support-plan", data);
      if (response.success && response.data?.silSupportPlan?.uuid) {
        window.alert("Form submitted successfully.");
        const newUuid = response.data.silSupportPlan.uuid;
        setSessionUuid(newUuid);
        router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
        fetchFormData();
      } else {
        window.alert(response.message || "Error submitting form.");
      }
    } catch (error) {
      console.error(error);
      window.alert("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveForm();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const completionBarStyle = { width: `${completionPercentage}%` };

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={() => { setShowLoginModal(false); setFlag(true); fetchFormData(); }} />
      {flag ? (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
          <div className="flex justify-end gap-4 items-start">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition h-fit mt-2"
            >
              Logout
            </button>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                {clientName || "N/A"}
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={180} height={80} className="h-auto" />
          </div>

          <div className="text-center mb-4 min-h-[56px]">
            {sessionUuid ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="btn-primary h-4 rounded-full transition-width duration-300"
                    style={completionBarStyle}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Form completion: {completionPercentage}%
                </p>
              </>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2"></div>
            )}
          </div>

          <div className="flex justify-center mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">Supported Independent Living (SIL) <br/> Support Plan</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
            <SilSupportPlanForm
              formData={formData}
              setFormData={setFormData}
              decisionMakers={decisionMakers}
              setDecisionMakers={setDecisionMakers}
              clientGoal={clientGoal}
              setClientGoal={setClientGoal}
              dailyRoutines={dailyRoutines}
              setDailyRoutines={setDailyRoutines}
              supportNeed={supportNeed}
              setSupportNeed={setSupportNeed}
              naturalSupport={naturalSupport}
              setNaturalSupport={setNaturalSupport}
              clinicalManagementPlan={clinicalManagementPlan}
              setClinicalManagementPlan={setClinicalManagementPlan}
              externalProviders={externalProviders}
              setExternalProviders={setExternalProviders}
              behaviourSupport={behaviourSupport}
              setBehaviourSupport={setBehaviourSupport}
              healthMedical={healthMedical}
              setHealthMedical={setHealthMedical}
              riskManagements={riskManagements}
              setRiskManagements={setRiskManagements}
              communication={communication}
              setCommunication={setCommunication}
              housingArrangement={housingArrangement}
              setHousingArrangement={setHousingArrangement}
              choiceControl={choiceControl}
              setChoiceControl={setChoiceControl}
              teamMemberRequirement={teamMemberRequirement}
              setTeamMemberRequirement={setTeamMemberRequirement}
              emergencyInformation={emergencyInformation}
              setEmergencyInformation={setEmergencyInformation}
              reviewSignature={reviewSignature}
              setReviewSignature={setReviewSignature}
              handleChange={handleChange}
              uuid={sessionUuid || undefined}
              onPdfExtractionClick={() => setIsPdfModalOpen(true)}
              onAutofillClick={handleAutofill}
              autofilling={autofilling}
            />

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="submit_final"
                name="submit_final"
                checked={formData.submit_final === 1 || formData.form_status === 'completed'}
                onChange={(e) => handleChange(e)}
                className="mr-2"
              />
              <label className="font-medium text-gray-700">Final Submit (Tick to confirm all information is correct)</label>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button type="submit" disabled={loading} className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
          <PdfExtractionModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            userId={sessionUserId || searchParams.get("userid") || ""}
            clientType={sessionClientType || searchParams.get("client_type") || ""}
            onExtractionComplete={handleAutofill}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]"><span>Loading...</span></div>
      )}
    </>
  );
}
