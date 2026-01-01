"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import { ScheduleOfSupportsFormData } from "@/src/components/SupportSchedule/ApiResponse";
import SupportScheduleFormData from "@/src/components/SupportSchedule/FormData";
import { mapApiResponseToFormData } from "@/src/components/SupportSchedule/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SupportSchedule/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { ScheduleResponse } from "@/src/components/SupportSchedule/types";
import { SupportScheduleTracker } from "@/src/components/SupportSchedule/SupportScheduleTracker";
import { FundedSupportsFormData, UnfundedSupportsFormData } from "@/src/components/SupportSchedule/ApiResponse";

import Image from "next/image";

const SECTION_NAMES = [
  "ScheduleOfSupports", "FundedSupports", "UnfundedSupports", "AgreementSignatures"
] as const;

const FundedSupport: FundedSupportsFormData[] =
  [{
    support_name: "",
    description: "",
    price: null,
    unit: null,
    payment_information: "",
    delivery_details: "",
    invoicing_details: "",
    grand_total: null,
    goal_key: "",
  }];


const UnfundedSupport: UnfundedSupportsFormData[] = [];

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof SupportScheduleFormData;

type ValidationErrors = Record<string, string[]>;

// Utility functions
const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = false;
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
    useState<SupportFormaDataType>(SupportScheduleFormData);
  const [fundedSupportData, setFundedSupportData] =
    useState<FundedSupportsFormData[]>(FundedSupport);
  const [unfundedSupportData, setUnfundedSupportData] =
    useState<UnfundedSupportsFormData[]>(UnfundedSupport);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);


  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "FundedSupports":
          return { fundedSupports: fundedSupportData, setFundedSupports: setFundedSupportData };
        case "UnfundedSupports":
          return { unfundedSupports: unfundedSupportData, setUnfundedSupports: setUnfundedSupportData };
        default:
          return {};
      }
    },
    [fundedSupportData, unfundedSupportData]
  );



  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const form = "schedule-of-support";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        // pass form, form_token, form_client_type, and form-uuid to API
        const { token, client_name, uuid } = await getFormSession(
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

      const response = await show<ScheduleOfSupportsFormData>(
        "schedule-of-supports",
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

      // Map transport array to fundedSupportData
      if (response.data?.transport && Array.isArray(response.data.transport)) {
        setFundedSupportData(response.data.transport);
      }

      // Map unfunded_support array to unfundedSupportData
      if (response.data?.unfunded_support && Array.isArray(response.data.unfunded_support) && response.data.unfunded_support.length > 0) {
        setUnfundedSupportData(response.data.unfunded_support);
      } else {
        // If no unfunded supports from API, keep the initial state (one empty entry)
        // Don't reset to empty array
      }


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
          return { ...prev, [key]: false };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({
            ...acc,
            [sectionKey]: false,
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

  // Function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("Current unfundedSupportData state:", unfundedSupportData);
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");


      // Check for token and refresh if missing
      // localStorage.removeItem("token");
      if (!localStorage.getItem("token") || localStorage.getItem("token") === "null") {
        try {
          const form = "service-agreement";
          const formUuid = searchParams.get("form-uuid");
          const sessUserId = sessionUserId || searchParams.get("userid") || "";
          const sessClientType = sessionClientType || searchParams.get("client_type") || "";

          const { token } = await getFormSession(form, formUuid, sessUserId, sessClientType);
          if (token) {
            localStorage.setItem("token", token);
          } else {
            // Token is still null/invalid
            alert("Login credentials mismatch");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to refresh session before submit", e);
          alert("Login credentials mismatch");
          setLoading(false);
          return;
        }
      }


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

        // Filter out empty funded supports before submitting
        const validFundedSupports = fundedSupportData.filter(support =>
          support.support_name || support.description || support.price || support.unit || support.grand_total
        );
        data.append("funded_supports", JSON.stringify(validFundedSupports));

        // Filter out empty unfunded supports before submitting
        const validUnfundedSupports = unfundedSupportData.filter(support =>
          support.unfunded_support_name || support.unfunded_description ||
          support.unfunded_price || support.unfunded_unit || support.unfunded_grand_total ||
          support.unfunded_price_information || support.unfunded_delivery_details
        );
        console.log("Submitting unfunded supports:", validUnfundedSupports);
        console.log("Raw unfundedSupportData:", unfundedSupportData);
        data.append("unfunded_supports", JSON.stringify(validUnfundedSupports));

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("schedule-of-support/update", data);
        let response: ScheduleResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              scheduleOfSupport: { uuid: string; id: number };
            },
          };
          window.alert("Form submitted successfully.");
          setValidationErrors({});
          setFormSubmissionError("");
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
          response.data?.scheduleOfSupport?.uuid
        ) {
          const newUuid = response.data.scheduleOfSupport.uuid;
          setSessionUuid(newUuid);
          // Push the UUID to the URL as a query parameter
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        }
        await fetchFormData();

      } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        console.error("Submission error:", error);

        if (error.response && error.response.status === 422 && error.response.data?.errors) {
          const newErrors: ValidationErrors = {};
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            newErrors[field] = messages;
          });
          setValidationErrors(newErrors);
          setFormSubmissionError("Please correct the errors below.");
        } else {
          setFormSubmissionError("An error occurred while submitting the form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      fundedSupportData,
      unfundedSupportData,
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

  const trackerSteps = useMemo(() => {
    return SupportScheduleTracker.map((step) => step);
  }, []);

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
              Service Agreement <br />   Appendix B <br />Schedule of Supports
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <Tracker
              steps={trackerSteps}
              onStepClick={(key) => handleTrackerClick(key as SectionKey)}
            />

            {sectionsConfig.map(({ key, title, Component }, index) => (
              <React.Fragment key={key}>
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
                    {...getComponentProps(key)}
                    uuid={sessionUuid || undefined}
                  />
                </AccordianPlanSection>
                {index === 0 && (
                  <div className="section">
                    <div className="font-semibold text-lg mb-4">Transport</div>

                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                      <tbody>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Fully funded for transport</td>
                          <td className="p-3 align-top">Funding meets participant transport needs</td>
                          <td className="p-3 align-top">
                            Participant only uses KM funded for $. This figure should be based on _____ cents per kilometre and does not include GST.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                          <td className="p-3 align-top">
                            Indicate core support $ to be converted. Funding does not meet transport needs. Participant converts support hours to pay for KM.
                          </td>
                          <td className="p-3 align-top">
                            Conversion of core support funding into transport must not negatively impact goals and outcomes.
                            Conversion of supports can only occur where participant has transport within their plan,
                            and Core Daily Activity & Transport are managed by Best of Homecare.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                          <td className="p-3 align-top">Indicate core support $ to be converted</td>
                          <td className="p-3 align-top">
                            *Funding does not meet transport needs. Participant converts support hours to pay for KM.<br />
                            *Conversion must not negatively impact goals and outcomes.<br />
                            *Supports can only be converted where the participant has transport within their plan and both Core Daily Activity & Transport are managed by Best of Homecare.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Not funded for transport within NDIS plan</td>
                          <td className="p-3 align-top">Participant is not funded for transport</td>
                          <td className="p-3 align-top">
                            Participant uses public transport or will be invoiced for KM at the rate of _____ cents per KM + GST
                          </td>
                        </tr>

                        <tr>
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">No transport costs</td>
                          <td className="p-3 align-top">
                            Participant has not authorised Best of Homecare to charge for transport
                          </td>
                          <td className="p-3 align-top">
                            Participant uses public transport or does not require transport. If transport is required,
                            costs will be negotiated in advance.
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                      <strong>Note:</strong><br />
                      Amounts will be listed in the funded and unfunded schedules.<br />
                      Additional transport costs will be invoiced at _____ cents per KM directly to the participant or family monthly. GST will be added where transport costs exceed the amount approved in the funding plan or where there is no transport funding in the plan.<br />
                      Transport may include the use of a staff member vehicle, Best of Homecare vehicle or via public transport.<br />
                      Participant or family to cover any out-of-pocket public transport costs, if required.<br />
                      Where a staff member travels from one participant appointment to another (providing personal care and community access), up to 20 minutes of time can be claimed against the next appointment at the hourly rate for the relevant support item. This will be discussed with you, if it is relevant to the services that you receive from Best of Homecare.
                    </div>
                  </div>
                )}
                {key === "UnfundedSupports" && (
                  <>
                    <div className="section mt-8">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sil_section_flag"
                          name="sil_section_flag"
                          checked={!!formData.sil_section_flag}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "sil_section_flag",
                                value: e.target.checked ? 1 : 0,
                              },
                            })
                          }
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="sil_section_flag" className="font-medium text-gray-700">
                          Include Supported Independent Living Accommodation (SIL/SDA)
                        </label>
                      </div>
                    </div>
                    {!!formData.sil_section_flag && (
                      <div className="section mt-8">
                        <div className="font-semibold text-lg mb-4">Supported Independent Living Accommodation - Fortnightly Participants Contribution (SIL/SDA Only)</div>
                        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50 border-b border-gray-300">
                            <tr>
                              <th className="p-3 text-left font-semibold" style={{ width: '70%' }}>Description</th>
                              <th className="p-3 text-left font-semibold" style={{ width: '30%' }}>Amount (Per Fortnight)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">Rent Charges (Rental cost and Commonwealth rent assistance)</td>
                              <td className="p-3">$390.20</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">
                                33% of the total cost of utilities such as electricity, gas, water, and internet
                                <br />
                                <small className="text-gray-500">(Above rates are based on the total cost of utilities for a Year)</small>
                              </td>
                              <td className="p-3">$204.80</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">
                                Food/Groceries
                                <br />
                                <small className="text-gray-500">(Based on the total cost of the food purchase currently in our SIL accommodation per person)</small>
                              </td>
                              <td className="p-3">$200.00</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="p-3"><strong>Total Cost</strong></td>
                              <td className="p-3"><strong>$795.00 / Fortnight</strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

            {/* Display validation errors */}
            {(Object.keys(validationErrors).length > 0 || formSubmissionError) && (
              <div className="mt-8 p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Please fix the following errors:
                </h3>

                {formSubmissionError && (
                  <p className="text-red-600 mb-3">{formSubmissionError}</p>
                )}

                <ul className="space-y-2">
                  {Object.entries(validationErrors).map(([field, errors]) => (
                    <li key={field} className="text-red-600">
                      <strong className="font-medium">{formatFieldName(field)}:</strong>{" "}
                      {errors.map((error, index) => (
                        <span key={index}>
                          {error}
                          {index < errors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
