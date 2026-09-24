"use client";

import React, { useState, useEffect, useMemo, createRef, RefObject } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconLoader } from "@tabler/icons-react";

import {
  fetchMedicineAdministrationConsent,
  saveMedicineAdministrationConsent,
  generateMedicineAdministrationConsentPdf,
  fetchMedicineAdministrationConsentUuid,
} from "./api";
import { sectionsConfig } from "./sectionsConfig";
import { MedicineAdministrationConsentData } from "./types";
import AccordianPlanSection from "@/src/components/AccordianSection";
import Tracker from "@/src/components/Tracker";
import { getFormSession, index } from "@/src/services/crud";

const defaultFormData: MedicineAdministrationConsentData = {
  uuid: "",
  user_id: "",
  client_type: "",
  submit_final: 0,
  participant_name: "",
  medication_support: false,
  medication_assistance: false,
  manage_medication_self: false,
  provider_signature_name: "Best Of Homecare",
  provider_signature: "",
  provider_signature_date: "",
  client_signer_type: "participant",
  client_signature_name: "",
  representative_relation: "",
  client_signature: "",
  client_signature_date: "",
  witness_name: "",
  witness_signature: "",
  witness_signature_date: "",
};

interface MedicineAdministrationConsentFormProps {
  uuid?: string;
  userid?: string;
  client_type?: string;
  isClientView?: boolean;
  clientName?: string;
  isSignatureOnly?: boolean;
}

export default function MedicineAdministrationConsentForm({
  uuid = "",
  userid = "",
  client_type = "",
  isClientView = false,
  clientName = "",
  isSignatureOnly = false,
}: MedicineAdministrationConsentFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<MedicineAdministrationConsentData>({
    ...defaultFormData,
    uuid,
    user_id: userid,
    client_type,
  });

  const [loading, setLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [isExpandedAll, setIsExpandedAll] = useState(false);

  const sectionKeys = useMemo(() => sectionsConfig.map((s) => s.key), []);
  const initialOpenSections = useMemo(() => {
    return sectionKeys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }, [sectionKeys]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialOpenSections);

  const sectionRefs = useMemo(() => {
    return sectionKeys.reduce((acc, section) => {
      acc[section] = createRef<HTMLDivElement | null>();
      return acc;
    }, {} as Record<string, RefObject<HTMLDivElement | null>>);
  }, [sectionKeys]);

  const trackerSteps = useMemo(() => {
    return sectionsConfig.map((s) => ({
      key: s.key,
      label: s.title.replace(/^\d+\.\s*/, ""),
    }));
  }, []);

  const handleTrackerClick = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    const ref = sectionRefs[key];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleExpandAll = () => {
    const nextState = !isExpandedAll;
    setIsExpandedAll(nextState);
    setOpenSections(
      sectionKeys.reduce((acc, key) => {
        acc[key] = nextState;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        let formClientName = "";
        let effectiveUuid = uuid;

        if (!effectiveUuid && userid && client_type) {
          try {
            const uuidResponse = await fetchMedicineAdministrationConsentUuid(userid, client_type);
            if (uuidResponse?.uuid) {
              effectiveUuid = uuidResponse.uuid;
              if (!isClientView) {
                router.push(`?form-uuid=${effectiveUuid}&userid=${userid}&client_type=${client_type}&admin=1`, { scroll: false });
              }
            }
          } catch (e) {
            console.error("Failed to fetch effective UUID", e);
          }
        }

        try {
          const session = await getFormSession("medicine-administration-consent", effectiveUuid || "", userid, client_type);
          if (session?.client_name) {
            formClientName = session.client_name;
          }
        } catch (sessionError) {
          console.error("getFormSession failed", sessionError);
        }

        let basicDetails: any = null;
        if (userid) {
          try {
            const basicRes = await index<any>("get-client-basic-details", { userid, client_type });
            if (basicRes.success && basicRes.data) {
              basicDetails = basicRes.data;
            }
          } catch (err) {
            console.error("Failed to load basic details:", err);
          }
        }

        if (effectiveUuid) {
          try {
            const response = await fetchMedicineAdministrationConsent(effectiveUuid, userid);
            if (response && response.success && response.data) {
              setFormData((prev) => ({
                ...prev,
                ...response.data,
                uuid: effectiveUuid,
                user_id: userid || response.data.user_id,
                client_type: client_type || response.data.client_type,
                participant_name: response.data.participant_name || response.data.client_name || formClientName || basicDetails?.participant_name || prev.participant_name,
                client_signature_name: response.data.client_signature_name || response.data.participant_name || formClientName || basicDetails?.participant_name || prev.client_signature_name,
              }));
              if (response.data.completion_percentage !== undefined) {
                setCompletionPercentage(response.data.completion_percentage);
              }
              return;
            }
          } catch (err) {
            console.error("Failed to load Medicine Administration Consent data:", err);
          }
        }

        setFormData((prev) => ({
          ...prev,
          uuid: effectiveUuid || prev.uuid,
          user_id: userid || prev.user_id,
          client_type: client_type || prev.client_type,
          participant_name: formClientName || basicDetails?.participant_name || prev.participant_name || "",
          client_signature_name: formClientName || basicDetails?.participant_name || prev.client_signature_name || "",
        }));
      } catch (error) {
        console.error("Error loading Medicine Administration Consent Form:", error);
      }
    };

    loadData();
  }, [uuid, userid, client_type, isClientView, router]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        isClientView,
        signature_only: isSignatureOnly ? 1 : 0,
      };

      const res = await saveMedicineAdministrationConsent(payload);

      if (res && res.success) {
        if (res.data?.completion_percentage !== undefined) {
          setCompletionPercentage(res.data.completion_percentage);
        } else if (res.completion_percentage !== undefined) {
          setCompletionPercentage(res.completion_percentage);
        }

        if (!uuid && res.data?.medicineAdministrationConsent?.uuid && !isClientView) {
          router.push(`?form-uuid=${res.data.medicineAdministrationConsent.uuid}&userid=${userid}&client_type=${client_type}&admin=1`, { scroll: false });
        }

        window.alert(formData.submit_final === 1 ? "Form submitted successfully!" : "Form saved successfully!");
      } else {
        window.alert(res?.message || "Failed to save form.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      window.alert(err.response?.data?.message || "Error saving form.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!formData.uuid) {
      window.alert("Please save the form before downloading PDF.");
      return;
    }
    try {
      setPdfGenerating(true);
      await generateMedicineAdministrationConsentPdf(formData.uuid);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const completionBarStyle = useMemo(
    () => ({
      width: `${completionPercentage}%`,
    }),
    [completionPercentage]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
        {/* Top Bar: Logout & Client Name Badge */}
        <div className="flex justify-end gap-4 items-start">
          {!isClientView && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition h-fit mt-2"
            >
              Logout
            </button>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-4 mb-6 text-center min-w-[12rem] whitespace-pre-line">
            <h1 className="text-xl md:text-2xl font-bold text-blue-800">
              {clientName || formData.participant_name || "N/A"}
            </h1>
          </div>
        </div>

        {/* Centered Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/BHC LOGO_SMALL.png"
            alt="Company Logo"
            width={180}
            height={80}
            className="h-auto"
          />
        </div>

        {/* Progress Bar & Completion % */}
        <div className="text-center mb-4 min-h-[56px]">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="btn-primary h-4 rounded-full transition-all duration-300"
              style={completionBarStyle}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Form completion: {completionPercentage}%
          </p>
        </div>

        {/* Main Title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
            Medicine Administration Consent Form (Form-F20)
          </h1>
        </div>

        {/* Main Form Card Container */}
        <form
          className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          onSubmit={handleSave}
        >
          <div className="flex flex-wrap justify-end items-center gap-3 mb-4">
            <div
              className="bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium py-1 px-3 rounded shadow-sm text-sm cursor-pointer"
              onClick={() => {
                setOpenSections((prev) => ({
                  ...prev,
                  signatures: true,
                }));
                const ref = sectionRefs["signatures"];
                if (ref && ref.current) {
                  ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              👉 Click here to participant signature
            </div>

            <button
              type="button"
              onClick={toggleExpandAll}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition border border-gray-300 shadow-sm text-sm"
            >
              {isExpandedAll ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* Section Tracker */}
          <Tracker steps={trackerSteps} onStepClick={handleTrackerClick} />

          {/* Accordion Sections Loop */}
          <div className="space-y-4 mt-8">
            {sectionsConfig.map((section, index) => {
              const { Component, key, title } = section;
              const isOpen = openSections[key];

              const componentProps = {
                formData,
                handleChange,
                uuid: formData.uuid,
              };

              return (
                <React.Fragment key={key}>
                  <AccordianPlanSection
                    sectionRef={sectionRefs[key]}
                    title={title}
                    isOpen={isOpen}
                    onToggle={() => handleTrackerClick(key)}
                    className={index === sectionsConfig.length - 1 ? "" : "mb-4"}
                  >
                    <fieldset
                      disabled={isSignatureOnly && key !== "signatures"}
                      className={isSignatureOnly && key !== "signatures" ? "opacity-75 pointer-events-none" : ""}
                    >
                      <Component {...componentProps} />
                    </fieldset>
                  </AccordianPlanSection>
                </React.Fragment>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-primary:hover text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Final Submit Checkbox */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="submit_final"
              name="submit_final"
              checked={formData.submit_final === 1}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "submit_final",
                    value: e.target.checked ? 1 : 0,
                  },
                })
              }
              className="mr-2 cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="font-medium text-gray-700 cursor-pointer" htmlFor="submit_final">
              Final Submit (Tick to confirm all information is correct)
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
