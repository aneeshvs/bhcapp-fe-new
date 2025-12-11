"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import { ParticipantSignature } from "@/src/components/ParticipantSignature/ApiResponse";
import ParticipantSignatures from "@/src/components/ParticipantSignature/FormData";
import { mapApiResponseToFormData } from "@/src/components/ParticipantSignature/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/ParticipantSignature/SectionsConfig";
// import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { ParticipantResponse } from "@/src/components/ParticipantSignature/types";
// import { Participant } from "@/src/components/ParticipantSignature/FormTracker";
import Image from "next/image";

const SECTION_NAMES = [
  "ParticipantSignature"
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof ParticipantSignatures;

// Utility functions
const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = true;
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function SupportCarePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<SupportFormaDataType>(ParticipantSignatures);
  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

  

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const form = "multiple-supports";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        // pass form, form_token, form_client_type, and form-uuid to API
        const { token,client_name, uuid } = await getFormSession(
          form,
          formUuid,
          sessionUserId,
          sessionClientType
        );

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ type: "client" }));
        }

        // setSessionUserId(userid ?? "");
        // setSessionClientType(client_type ?? "");
        setClientName(client_name ?? "");

        if (uuid) setSessionUuid(uuid);
        setFlag(true);
      } catch (e) {
        console.error("Failed to get form session", e);
      }
    })();
  }, [searchParams]);

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid;
      if (!effectiveUuid) {
        console.log("No UUID - skipping initial data fetch");
        return;
      }

      const response = await show<ParticipantSignature>(
        "multiple-supports",
        effectiveUuid || ""
      );
      console.log(response);

      if (response.data?.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (!response?.data) {
        console.log("No service agreement data found");
        return;
      }

      // Set form data from API response
      setFormData(
        mapApiResponseToFormData(response.data) as SupportFormaDataType
      );
     

     
    } catch (error) {
      console.error("Error fetching service agreement data:", error);
    }
  }, [sessionUuid]);

  // Fetch data effect
  useEffect(() => {
    const effectiveUuid = sessionUuid;
    if (effectiveUuid) {
      fetchFormData();
    }
  }, [sessionUuid, fetchFormData]);

  // Memoized change handler
  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | { target: { name: string; value: string | number | boolean } }
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Memoized tracker click handler
  const handleTrackerClick = useCallback(
    (key: SectionKey) => {
      setOpenSections((prev) => {
        if (prev[key]) {
          return { ...prev, [key]: true };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({
            ...acc,
            [sectionKey]: true,
          }),
          {} as Record<SectionKey, boolean>
        );

        return { ...newState, [key]: true };
      });

      // Delay scroll until after DOM updates
      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [sectionRefs]
  );

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
      setLoading(true);

      try {
        const data = new FormData();

        if (formData.submit_final === 1) {
            data.append('submit_final', '1');
        }

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("multiple-supports/update", data);
        let response: ParticipantResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              participantSignature: { uuid: string; id: number };
            },
          };
          window.alert("Form submitted successfully.");
        } else {
          response = {
            success: false,
            data: apiResponse.data as Record<string, string>,
            message: apiResponse.message,
          };
        }

        if (
          !sessionUuid &&
          response.success &&
          response.data?.participantSignature?.uuid
        ) {
          const newUuid = response.data.participantSignature.uuid;
          setSessionUuid(newUuid);
          // Push the UUID to the URL as a query parameter
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        }
        await fetchFormData();
      } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred while submitting the form");
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      sessionUserId,
      sessionClientType,
      sessionUuid,
      fetchFormData,
      router,
    ]
  );

  useEffect(() => {
    const userId = searchParams.get("userid");
    const clientType = searchParams.get("client_type");

    if (userId) setSessionUserId(userId);
    if (clientType) setSessionClientType(clientType);
  }, [searchParams]);

  // Memoized completion percentage style
  const completionBarStyle = { width: `${completionPercentage}%` };

//   const trackerSteps = useMemo(() => {
//     return Participant.map((step) => step);
//   }, []);

  return (
    <>
      {flag ? (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
          <div className="flex justify-end">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                {clientName || "N/A"}
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
            {/* Reserve height */}
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

          <div className="flex justify-center mb-6">
            <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              Service Agreement <br/> Appendix A - Multiple Supports
            </h1>
          </div>

          {/* Informational Text Section - Added before the accordion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-6xl mx-auto">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>For participants who receive dual supports that may present as a conflict of interest.</strong>
              </p>
              <p className="text-gray-700 mb-4">
                If you receive the following services, you must not at any time feel obligated to seek further support provision from Best of Homecare.
              </p>
              
              <p className="text-gray-700 mb-4">
                This includes participants that may receive support as well as any of the following:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Support Coordination</li>
                <li>Other supports</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Communication regarding conflicting service provision:
              </h3>
              <p className="text-gray-700 mb-4">
                Where you are receiving one of the above listed services and require additional supports that are available within Best of Homecare scope of provision, Best of Homecare staff members will provide you with three options of providers. You will be provided information about accessing an advocate to support you in the decision-making process and will be assured of no retribution.
              </p>
              <p className="text-gray-700 mb-4">
                You will be regularly reminded of your options and can choose to change supports at any time.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Documentation
              </h3>
              <p className="text-gray-700 mb-4">
                These options will be documented on your files and will be explained in a format, terms or mode of communication that best suits your needs.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Service Provision
              </h3>
              <p className="text-gray-700">
                Where a service and a support is provided to you, Best of Homecare ensures that separate staff members undertake the functions to ensure the clarity of distinction between the roles.
              </p>
            </div>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            {/* <Tracker
              steps={trackerSteps}
              onStepClick={(key) => handleTrackerClick(key as SectionKey)}
            /> */}

            {sectionsConfig.map(({ key, title, Component }) => (
              <AccordianPlanSection
                key={key}
                sectionRef={sectionRefs[key as SectionKey]}
                title={title}
                isOpen={openSections[key as SectionKey]}
                onToggle={() => handleTrackerClick(key as SectionKey)}
              >
                <Component
                  formData={formData}
                  handleChange={handleChange}
                  uuid={sessionUuid || undefined}
                />
              </AccordianPlanSection>
            ))}

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
            onChange={e =>
              handleChange({
                target: {
                  name: 'submit_final',
                  value: e.target.checked ? 1 : 0,
                },
              })
            }
            className="mr-2"
          />
          <label className="font-medium text-gray-700">
            Final Submit (Tick to confirm all information is correct)
          </label>
        </div>
          </form>
        </div>
      ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}