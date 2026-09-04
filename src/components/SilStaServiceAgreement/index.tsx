"use client";

import React, { useState, useEffect, useMemo, Suspense, createRef, RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IconLoader } from "@tabler/icons-react";

import { fetchSilStaServiceAgreement, saveSilStaServiceAgreement, generateSilStaServiceAgreementPdf, fetchSilStaServiceAgreementUuid } from "@/src/components/SilStaServiceAgreement/api";
import { sectionsConfig } from "@/src/components/SilStaServiceAgreement/sectionsConfig";
import { SilStaServiceAgreementData, SilStaScheduleOfSupport } from "@/src/components/SilStaServiceAgreement/types";
import AccordianPlanSection from "@/src/components/AccordianSection";
import Tracker from "@/src/components/Tracker";
import StaticTermsContent from "@/src/components/SilStaServiceAgreement/StaticTermsContent";
import { getFormSession, index, show } from "@/src/services/crud";

const emptySchedule: SilStaScheduleOfSupport = {
  support_services: "",
  ndis_funded_support: "",
  how_support_provided: "",
  non_funded_support: "",
  travel: "",
  program_of_supports: "",
  support_times: "",
  total: "",
};

const defaultFormData: SilStaServiceAgreementData = {
  uuid: "",
  user_id: "",
  client_type: "",
  submit_final: 0,
  ndis_plan_start_date: "",
  ndis_plan_end_date: "",
  service_agreement_start_date: "",
  service_agreement_end_date: "",
  client_name: "",
  client_address: "",
  client_email: "",
  client_phone: "",
  client_ndis_number: "",
  client_funding_type: "",
  rep_name: "",
  rep_address: "",
  rep_legal_authority: "",
  rep_email: "",
  rep_phone: "",
  board_and_lodging_contributions: "",
  payment_terms: "",
  provider_signature_name: "",
  provider_signature: "",
  provider_signature_date: "",
  client_signature_name: "",
  client_signature: "",
  client_signature_date: "",
  witness_name: "",
  witness_signature: "",
  witness_signature_date: "",
  schedule_of_supports: [{ ...emptySchedule }],
};

interface SilStaServiceAgreementFormProps {
  uuid?: string;
  userid?: string;
  client_type?: string;
  isClientView?: boolean;
  clientName?: string;
  isSignatureOnly?: boolean;
}

export default function SilStaServiceAgreementForm({
  uuid = "",
  userid = "",
  client_type = "",
  isClientView = false,
  clientName = "",
  isSignatureOnly = false,
}: SilStaServiceAgreementFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SilStaServiceAgreementData>({
    ...defaultFormData,
    uuid,
    user_id: userid,
    client_type,
  });

  const [loading, setLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  // Accordion state handling
  const sectionKeys = useMemo(() => sectionsConfig.map(s => s.key), []);
  const initialOpenSections = useMemo(() => {
    return sectionKeys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }, [sectionKeys]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialOpenSections);
  const [isExpandedAll, setIsExpandedAll] = useState(false);

  const sectionRefs = useMemo(() => {
    return sectionKeys.reduce((acc, section) => {
      acc[section] = createRef<HTMLDivElement | null>();
      return acc;
    }, {} as Record<string, RefObject<HTMLDivElement | null>>);
  }, [sectionKeys]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let formClientName = "";
        let effectiveUuid = uuid;
        
        // If uuid is missing from URL, try to fetch the latest for this user
        if (!effectiveUuid && userid && client_type) {
          try {
            const uuidResponse = await fetchSilStaServiceAgreementUuid(userid, client_type);
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
          // getFormSession helps populate basic details for a new form
          const session = await getFormSession("sil-sta-service-agreement", effectiveUuid || "", userid, client_type);
          if (session?.client_name) {
            formClientName = session.client_name;
          }
        } catch (sessionError) {
          console.error("getFormSession failed", sessionError);
        }

        // Fetch basic details for autofill if userid is available
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
          const response = await show<SilStaServiceAgreementData>("sil-sta-service-agreement", effectiveUuid);
          if (response.success && response.data) {
            setFormData((prev) => ({
              ...prev,
              ...response.data,
              client_name: response.data.client_name || formClientName || basicDetails?.participant_name || prev.client_name,
              client_address: response.data.client_address || basicDetails?.address || prev.client_address,
              client_email: response.data.client_email || basicDetails?.email || prev.client_email,
              client_phone: response.data.client_phone || basicDetails?.contact || prev.client_phone,
              client_ndis_number: response.data.client_ndis_number || basicDetails?.ndis_number || prev.client_ndis_number,
              client_funding_type: response.data.client_funding_type || basicDetails?.type_of_funding || prev.client_funding_type,
              ndis_plan_start_date: response.data.ndis_plan_start_date || basicDetails?.ndis_plan_start_date || prev.ndis_plan_start_date,
              ndis_plan_end_date: response.data.ndis_plan_end_date || basicDetails?.ndis_plan_end_date || prev.ndis_plan_end_date,
              rep_name: response.data.rep_name || basicDetails?.representative_name || prev.rep_name,
              rep_legal_authority: response.data.rep_legal_authority || basicDetails?.representative_relationship || prev.rep_legal_authority,
              rep_phone: response.data.rep_phone || basicDetails?.representative_contact || prev.rep_phone,
              rep_email: response.data.rep_email || basicDetails?.representative_email || prev.rep_email,
              schedule_of_supports: response.data.schedule_of_supports?.length > 0 
                  ? response.data.schedule_of_supports 
                  : [{ ...emptySchedule }]
            }));
            if (response.data.completion_percentage !== undefined) {
               setCompletionPercentage(response.data.completion_percentage);
            }
            return;
          }
        }
        
        // If no effectiveUuid or fetch failed, fill from basicDetails / formClientName
        setFormData((prev) => ({
          ...prev,
          client_name: formClientName || basicDetails?.participant_name || prev.client_name || '',
          client_address: basicDetails?.address || prev.client_address || '',
          client_email: basicDetails?.email || prev.client_email || '',
          client_phone: basicDetails?.contact || prev.client_phone || '',
          client_ndis_number: basicDetails?.ndis_number || prev.client_ndis_number || '',
          client_funding_type: basicDetails?.type_of_funding || prev.client_funding_type || '',
          ndis_plan_start_date: basicDetails?.ndis_plan_start_date || prev.ndis_plan_start_date || '',
          ndis_plan_end_date: basicDetails?.ndis_plan_end_date || prev.ndis_plan_end_date || '',
          rep_name: basicDetails?.representative_name || prev.rep_name || '',
          rep_legal_authority: basicDetails?.representative_relationship || prev.rep_legal_authority || '',
          rep_phone: basicDetails?.representative_contact || prev.rep_phone || '',
          rep_email: basicDetails?.representative_email || prev.rep_email || '',
        }));
      } catch (error) {
        console.error("Error loading agreement:", error);
      }
    };
    
    loadData();
  }, [uuid, userid, client_type]);

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

  const handleTrackerClick = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the clicked section
    }));
    
    // Smooth scroll to the section
    const ref = sectionRefs[key];
    if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleScheduleChange = (index: number, field: keyof SilStaScheduleOfSupport, value: string) => {
    const newSchedule = [...formData.schedule_of_supports];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData((prev) => ({ ...prev, schedule_of_supports: newSchedule }));
  };

  const addScheduleRow = () => {
    setFormData((prev) => ({
      ...prev,
      schedule_of_supports: [...prev.schedule_of_supports, { ...emptySchedule }],
    }));
  };

  const removeScheduleRow = (index: number) => {
    const newSchedule = [...formData.schedule_of_supports];
    newSchedule.splice(index, 1);
    setFormData((prev) => ({ ...prev, schedule_of_supports: newSchedule }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = { ...formData };
      if (isSignatureOnly) {
        dataToSave.signature_only = 1;
      }
      const response = await saveSilStaServiceAgreement(dataToSave);
      
      if (response.success) {
        if (response.data?.agreement?.completion_percentage !== undefined) {
          setCompletionPercentage(response.data.agreement.completion_percentage);
        } else if (response.data?.completion_percentage !== undefined) {
          setCompletionPercentage(response.data.completion_percentage);
        }
        
        if (!uuid && response.data?.agreement?.uuid && !isClientView) {
          router.push(`?form-uuid=${response.data.agreement.uuid}&userid=${userid}&client_type=${client_type}&admin=1`, { scroll: false });
        }

        window.alert(formData.submit_final ? "Agreement submitted successfully!" : "Agreement saved successfully!");
      } else {
        window.alert("Failed to save agreement.");
      }
    } catch (error) {
      console.error("Save error:", error);
      window.alert("Error saving agreement.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    try {
      await handleSave(); // save before PDF generation
      const response = await generateSilStaServiceAgreementPdf(formData.uuid);
      
      if (response.success) {
        window.alert("PDF generated successfully!");
      } else {
        window.alert("Failed to generate PDF.");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      window.alert("Error generating PDF.");
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

  const trackerSteps = useMemo(() => {
    return sectionsConfig.map(s => ({ key: s.key, label: s.title.replace(/^\d+\.\s*/, '') }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
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
              {clientName || formData.client_name || "N/A"}
            </h1>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/BHC LOGO_SMALL.png"
            alt="Company Logo"
            width={180}
            height={80}
            className="h-auto"
          />
        </div>

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

        <div className="flex justify-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
            Supported Independent Living (SIL)/Short-term Accommodation/STA Service Agreement
          </h1>
        </div>

        <form
          className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          onSubmit={handleSave}
        >
          <div className="flex justify-end items-center gap-4 mb-4">
             <div 
               className="bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium py-1 px-3 rounded shadow-sm text-sm cursor-pointer"
               onClick={() => {
                   setOpenSections((prev) => ({
                       ...prev,
                       SignatureSection: true,
                   }));
                   const ref = sectionRefs["SignatureSection"];
                   if (ref && ref.current) {
                       ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

          <Tracker
              steps={trackerSteps}
              onStepClick={handleTrackerClick}
          />

          <div className="space-y-4 mt-8">
            {sectionsConfig.map((section, index) => {
              const { Component, key, title } = section;
              const isOpen = openSections[key];

              const componentProps = {
                formData,
                handleChange,
                uuid: formData.uuid,
                handleScheduleChange,
                addScheduleRow,
                removeScheduleRow
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
                    <fieldset disabled={isSignatureOnly && key !== "SignatureSection"} className={isSignatureOnly && key !== "SignatureSection" ? "opacity-75 pointer-events-none" : ""}>
                      <Component {...componentProps} />
                    </fieldset>
                  </AccordianPlanSection>

                  {key === "GeneralDetailsSection" && (
                    <StaticTermsContent />
                  )}
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

