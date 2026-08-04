"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { update, show, verifyFormOtp, getFormSession } from "@/src/services/crud";
import SilSupportPlanForm from "@/src/components/SilSupportPlan";
import Image from "next/image";
import phpApi from "@/src/utils/PhpApi";

export default function ShowSilSupportPlanPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const searchParams = useSearchParams();
  const sessionUserId = searchParams.get("userid") || "";
  const sessionClientType = searchParams.get("client_type") || "";
  
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { client_name } = await getFormSession("sil-support-plan", uuid as string, sessionUserId, sessionClientType);
        if (client_name && client_name !== "Unknown") {
          setClientName(client_name);
        }
      } catch (e) {
        console.error("getFormSession in show page failed", e);
      }
    })();
  }, [uuid, sessionUserId, sessionClientType]);
  
  const [isSignatureOnly, setIsSignatureOnly] = useState(true);

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
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const isAdmin = typeof window !== "undefined" && searchParams.get("admin") === "1";
  const isReadOnly = isSignatureOnly && !isAdmin;

  const fetchSignatureMode = useCallback(async () => {
    try {
        const response = await phpApi.get('/php/check-signature-mode.php', {
            params: {
                uuid,
                form_name: 'sil_support_plan'
            }
        });
        if (response.data.success) {
            setIsSignatureOnly(response.data.signature_only === 1);
        }
    } catch (error) {
        console.error("Error fetching signature mode:", error);
    }
  }, [uuid]);

  const fetchFormData = useCallback(async () => {
    try {
      const response = await show<any>("sil-support-plan-show", uuid as string);
      if (response?.data) {
        setFormData(response.data);
        if (response.data.client_name && response.data.client_name !== "Unknown") {
          setClientName(response.data.client_name);
        } else {
          const uId = response.data.user_id || sessionUserId;
          const cType = response.data.client_type || sessionClientType;
          if (uId) {
            try {
              const sessionRes = await getFormSession("sil-support-plan", uuid as string, String(uId), String(cType));
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
        if (response.data.decision_makers) {
          setDecisionMakers(response.data.decision_makers);
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
  }, [uuid]);

  useEffect(() => {
    fetchSignatureMode();
  }, [fetchSignatureMode]);

  useEffect(() => {
    if (authenticated) {
      fetchFormData();
    }
  }, [authenticated, fetchFormData]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword) return;

    try {
      setLoading(true);
      const res = await verifyFormOtp(
        uuid as string,
        enteredPassword
      );
      if (res.success) {
        setAuthenticated(true);
        if (res.client_name) {
          setClientName(res.client_name);
        }
        setPasswordError("");
      } else {
        setPasswordError(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || err.message || "An error occurred during verification");
    } finally {
      setLoading(false);
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

      if (uuid) data.append("uuid", uuid);
      if (isSignatureOnly) {
        data.append("signature_only", "1");
      }

      const response = await update("sil-support-plan", data);
      if (response.success) {
        window.alert("Form submitted successfully.");
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

  const completionBarStyle = { width: `${completionPercentage}%` };

  if (!authenticated && !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={140} height={60} className="h-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Protected</h2>
          <p className="text-sm text-gray-600 mb-6">Please enter the security password to view or sign this document.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center focus:border-blue-500 focus:outline-none"
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-2 font-medium">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1976d2] text-white font-medium py-2 px-6 rounded transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
      <div className="flex justify-end gap-4 items-start">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            {clientName && clientName !== "Unknown" ? clientName : "N/A"}
          </h1>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={180} height={80} className="h-auto" />
      </div>

      <div className="text-center mb-4 min-h-[56px]">
        {uuid ? (
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

      {isSignatureOnly && !isAdmin && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 max-w-6xl mx-auto rounded">
          <p className="text-blue-700 font-medium">
            This form is currently in "Signature Only" mode. All content fields are read-only for review. Please complete your signature below.
          </p>
        </div>
      )}

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
          uuid={uuid}
          isReadOnly={isReadOnly}
        />

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="submit_final"
            name="submit_final"
            checked={formData.submit_final === 1 || formData.form_status === 'completed'}
            onChange={(e) => handleChange(e)}
            disabled={isReadOnly}
            className="mr-2"
          />
          <label className="font-medium text-gray-700">Final Submit (Tick to generate PDF)</label>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button type="submit" disabled={loading} className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
