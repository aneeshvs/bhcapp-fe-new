"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import Tracker from "@/src/components/Tracker";
import { mapApiResponseToFormData } from "@/src/components/ServiceAgreement/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/ServiceAgreement/sectionsConfig";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { ServiceAgreementResponse } from "@/src/components/ServiceAgreement/ApiResponse";
import { ServiceResponse } from "@/src/components/ServiceAgreement/types";
import AgreementFormaData from "@/src/components/ServiceAgreement/AgreementFormData";
import Image from "next/image";

const SECTION_NAMES = [
  "ParticipantRepresentative",
  "ServiceAgreementConsent",
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];

type AgreementFormaDataType = typeof AgreementFormaData;

type ValidationErrors = Record<string, string[]>;

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

export default function ServiceAgreementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");




  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [isInvalidSession, setIsInvalidSession] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<AgreementFormaDataType>(AgreementFormaData);



  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        // 👇 get form name from URL query (e.g. ?form=support-plan)
        const form = "service-agreement";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        // 👇 pass form and form-uuid to API
        const { token, client_name, uuid } = await getFormSession(form, formUuid, sessionUserId, sessionClientType);

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ type: "client" }));
          setFlag(true);
        } else {
          setIsInvalidSession(true);
        }

        // setSessionUserId(userid ?? "");
        // setSessionClientType(client_type ?? "");
        setClientName(client_name ?? "");
        if (uuid) setSessionUuid(uuid);
        // 👇 also keep track of the form type
      } catch (e) {
        console.error("Failed to get form session", e);
      }
    })();
  }, [searchParams]);

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
      if (!effectiveUuid) {
        console.log("No UUID - skipping initial data fetch");
        return;
      }

      const response = await show<ServiceAgreementResponse>(
        "service-agreement",
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
        mapApiResponseToFormData(response.data) as AgreementFormaDataType
      );
    } catch (error) {
      console.error("Error fetching service agreement data:", error);
    }
  }, [sessionUuid, searchParams]);

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
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");

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
        const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("service-agreement/update", data);
        let response: ServiceResponse;

        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              serviceAgreement: { uuid: string; id: number };
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

        if (!sessionUuid && !searchParams.get("form-uuid") && !searchParams.get("uuid") && response.success && response.data?.serviceAgreement?.uuid) {
          const newUuid = response.data.serviceAgreement.uuid;
          setSessionUuid(newUuid);
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        } else if (sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid")) {
          await fetchFormData();
        }
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
    [formData, sessionUserId, sessionClientType, sessionUuid, fetchFormData, searchParams, router]
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
    return [
      { key: "ParticipantRepresentative", label: "Participant Details" },
      { key: "ServiceAgreementConsent", label: "Service Agreement" },
    ];
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
            {" "}
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
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              SA-01 Service Agreement
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

                {/* Add text content after the first accordion (ParticipantRepresentative) */}
                {index === 0 && (
                  <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-gray-700 space-y-3">
                      <h1 className="text-2xl font-semibold text-gray-800 text-center mt-6">
                        The Provider
                      </h1>
                      <div className="flex justify-center mt-6">
                        <table className="border border-gray-300 rounded-lg w-auto">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="px-6 py-3 font-medium text-gray-700">
                                Company Name
                              </td>
                              <td className="px-6 py-3 text-gray-600">
                                Best of Homecare
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="px-6 py-3 font-medium text-gray-700">
                                ABN
                              </td>
                              <td className="px-6 py-3 text-gray-600">
                                63691624877
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="px-6 py-3 font-medium text-gray-700">
                                Contact
                              </td>
                              <td className="px-6 py-3 text-gray-600">
                                1300 513 309
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="px-6 py-3 font-medium text-gray-700">
                                Email
                              </td>
                              <td className="px-6 py-3 text-gray-600">
                                admin@bestofhomecare.com
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-3 font-medium text-gray-700">
                                Address
                              </td>
                              <td className="px-6 py-3 text-gray-600">
                                1/43 Rainier Crescent, Clyde North. VIC 3978
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        1. Purpose of this Agreement
                      </h2>
                      <p className="text-gray-600 mb-4">
                        The purpose of this Agreement is to document the arrangement
                        between and best of homecare. Any changes to the services
                        and/or support listed in this Agreement will require prior
                        authorisation from all parties. The parties agree that any
                        changes to this Service Agreement requires a 14-day notice
                        period. The notice must be in writing, signed and dated by
                        all parties and a copy of the amendments must be provided to
                        the Participant.
                      </p>
                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        2. Terms of Agreement
                      </h2>
                      <p className="text-gray-600 mb-4">
                        The Agreement will start and end on dates specified on page
                        2 of this Agreement unless the Agreement is terminated
                        earlier under Clause 12 - Termination. There will be a
                        service review date completed every 12 months.
                      </p>

                      {/* Section 3 */}
                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        3. Description of Services
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Best of Homecare offers a range of service types that can be
                        used as a single service or as a combination of services and
                        supports to suit the Participant. Best of Homecare provide a
                        minimum of 2 hours per service under one service request.
                        The Provider’s details of services and costs are detailed in
                        Schedule 1 – Service Fees.
                      </p>
                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        4. Billing Method
                      </h2>
                      <p className="text-gray-600 mb-2">
                        You agree to giving Best of Homecare consent to transfer the
                        budget within Core budgets as required (as core budget is
                        flexible, we may transfer funds to claims the invoices as
                        required). The NDIS Service Provider will request payment
                        after support services have been delivered in the following
                        ways:{" "}
                      </p>
                      <ul className="list-disc list-inside text-gray-600 mb-4">
                        <li>
                          <strong>Self-Managed:</strong> An invoice will be provided
                          to the Participant following the service. Full payment of
                          the invoice is required within 7 days, via direct
                          deposit/transfer.
                        </li>
                        <li>
                          <strong>NDIA Managed:</strong> The NDIA will pay your
                          invoice on your behalf. The invoice will be sent to the
                          NDIA following the service. Full payment of the invoice is
                          required within 7 days, via direct deposit/transfer.
                        </li>
                        <li>
                          <strong>Plan Managed:</strong> Your Plan Manager will be
                          issued the invoice following the service. Full payment of
                          the invoice within 7 days, via direct deposit/transfer.
                        </li>
                      </ul>
                      <p className="text-gray-600 mb-4">
                        Fees for support: Fees will be charged for the services set
                        out in Schedule 1 – Service Fees, based on the NDIS Price
                        Guide rate applicable to the date on which the service is
                        provided. NDIS Price Guide for Support Service Costing:
                        https://www.ndis.gov.au/providers/price-guides-and-pricing.
                      </p>
                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        5. Payment
                      </h2>
                      <p className="text-gray-600 mb-4">
                        The NDIS Service Provider will seek payment for their
                        provision of supports and services after the Participant
                        and/or their representative confirms satisfactory delivery,
                        and/or fees pertinent to the Cancellation requirements. The
                        Participant or their nominee manages the funding supports
                        provided under this Service Agreement. After Providing
                        supports and services, the NDIS Service Provider will send
                        the Participant/Participant’s Nominee an invoice for those
                        supports and services for the Participant/Participant’s
                        Nominee to pay. The Participant/Participant’s Nominee will
                        pay the invoice by EFT or credit-card within 14 days.
                        Non-payment of monies owed will result in the automatic
                        termination of this Agreement.
                      </p>
                      <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                        6. Goods and Services Tax (GST)
                      </h2>
                      <p className="text-gray-600 mb-4">
                        For the purposes of GST legislation, the Parties confirm
                        that a supply of supports under this Agreement is a supply
                        of one or more reasonable and necessary supports specified
                        in the statement of supports, under subsection 33(2) of the
                        National Disability Insurance scheme Act 2013 (Cth), in the
                        Participant’s NDIS Plan currently in effect under Section 37
                        of the National Disability Insurance scheme Act 2013 (Cth).
                      </p>
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        7. Participant/Participant’s Nominee Rights and
                        Responsibilities
                      </h2>
                      <p className="text-gray-700 mb-2">
                        Whilst accessing services outlined in this Agreement as a
                        Participant/Participant’s Nominee, I have:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>
                          The right to nominate, in writing, an Advocate or Nominee,
                          who will act in my interests and accept the
                          responsibilities imposed under this Agreement.
                        </li>
                        <li>
                          The right to determine the type and range of
                          activities/services that I wish to participate in.
                        </li>
                        <li>
                          The right to review and alter this Agreement according to
                          Clause 1 Purpose of this Agreement.
                        </li>
                        <li>
                          The right to privacy and confidentiality and in keeping
                          with the Health Records Legislation to request access to
                          any health information kept by the Provider.
                        </li>
                      </ul>
                      <p className="text-gray-700 mb-2">
                        As a Participant/Participant’s Nominee, I will:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>
                          Sign and return to this Service Agreement within 14 days
                          (Service will not be provided without a signed Agreement
                          or written acknowledgement from the Participant).
                        </li>
                        <li>
                          Treat staff and other Participants with courtesy, respect,
                          and consideration at all times.
                        </li>
                        <li>
                          Keep the Provider updated with any personal changes such
                          as my address, medication, and medical history as well as
                          health and/or behaviour support plans. Work cooperatively
                          with the Provider regarding issues arising with the
                          development and delivery of support and service covered in
                          this Agreement.
                        </li>
                        <li>
                          Provide information as requested by the Provider in a
                          timely manner. Ensure I am home at the agreed time and
                          date to receive the services.
                        </li>
                        <li>
                          Ensure my home/residence is a safe environment for the
                          Provider’s Employees.
                        </li>
                        <li>
                          Give the Provider 7 days’ notice, if I cannot make a
                          scheduled appointment, to avoid a late cancellation fee of
                          up to 100% of service fee costs.
                        </li>
                        <li>
                          Provide 1 months written notice if I wish to terminate
                          this Agreement as detailed in the Cancellation Policy of
                          this Agreement.
                        </li>
                        <li>
                          Notify the Provider immediately if my NDIS plan is
                          suspended or replaced by a new NDIS Plan or if I stop
                          being a Participant in the NDIS.
                        </li>
                      </ul>

                      {/* Section 8 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        8. Provider Responsibilities
                      </h2>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>
                          Respect the rights and encourage the Participant to
                          determine the range and types of activities they wish to
                          participate in.
                        </li>
                        <li>
                          Communicate with the Participant in an open, honest, and
                          timely manner. Treat the Participant with courtesy,
                          respect, and consideration at all times.
                        </li>
                        <li>
                          Work cooperatively with the Participant/Participant’s
                          nominee regarding issues arising with the development and
                          delivery of support and service covered in this
                          Agreement...
                        </li>
                        <li>
                          Will prepare a support plan with the
                          Participant/Participant’s Nominee outlining the
                          activities/supports they will undertake...
                        </li>
                        <li>
                          Will treat information about the Participant and their
                          activities as private and confidential online with the
                          Participant’s wishes and with privacy legislation...
                        </li>
                        <li>
                          Will provide the Participant with 1 months’ notice of
                          intention to cease service provisions.
                        </li>
                        <li>
                          Will provide information in a language of the Participants
                          choice, including use of interpreters and Auslan
                          requirements.
                        </li>
                        <li>
                          Review the Support Plan at least annually with the
                          Participants Representative...
                        </li>
                        <li>
                          Provide support that meets the Participants needs at the
                          Participants preferred times.
                        </li>
                        <li>
                          Give the Participant a minimum of 24 hours’ notice if the
                          Provider needs to change a scheduled appointment to
                          provide supports.
                        </li>
                        <li>
                          Provide 1 Month written notice to terminate this Agreement
                          and/or as detailed in the Termination section of this
                          Agreement.
                        </li>
                        <li>
                          Provide appropriately trained and accredited support staff
                          including absenteeism of staff.
                        </li>
                        <li>
                          Charge according to the NDIS Price Guide and Participants
                          assessed needs.
                        </li>
                        <li>
                          Issue regular invoices and statements of the supports
                          delivered to the Participant.
                        </li>
                      </ul>

                      {/* Section 9 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        9. Cancellation Policy
                      </h2>
                      <p className="text-gray-700 mb-4">
                        If a Participant, or their Nominated Participant fails to
                        provide reasonable notice (at least 7 days’ notice) in
                        advance, prior to the cancellation of a scheduled
                        support/service, or agreed appointment, then the Provider
                        will seek recompense by way of charging 100% of the fee
                        foregone for that session.
                      </p>

                      {/* Section 10 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        10. Additional NDIS Expenses
                      </h2>
                      <p className="text-gray-700 mb-2 font-semibold">
                        a) Travel / Transport Costs
                      </p>
                      <p className="text-gray-700 mb-4">
                        Where a staff member is required to travel to the
                        participant, the participant may be invoiced for either 0.5
                        hours of provider travel per visit or the accompanied travel
                        cost According to the price guide related to the service we
                        are providing. Please refer to the schedule of Support.
                        Additional expenses that are not included as part of the
                        participants NDIS supports are the responsibility of the
                        client and are not included in the cost of the support this
                        includes but not limited to, meals, parking, entry costs etc
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        b) Non-face-to-face supports
                      </p>
                      <p className="text-gray-700 mb-4">
                        Non-face-to-face activities Best of Homecare may deliver
                        that are specifically related to your disability and your
                        NDIS goals will be claimed accordingly from your NDIS
                        funding. Activities include but are not limited to; reports
                        for co-workers and provider reports relating to your skill
                        development. Best of Homecare will explain activities
                        completed and how these will bring value to you prior to
                        claiming.
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        c) NDIA Requested reports
                      </p>
                      <p className="text-gray-700 mb-4">
                        Where the NDIA requests a report that outlines plan
                        objectives, goals, ongoing needs etc Best of Homecare will
                        claim the time taken to collate these reports from your NDIS
                        funding.
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        d) Establishment Fee
                      </p>
                      <p className="text-gray-700 mb-4">
                        Where Best of Homecare provides you with a minimum of 20
                        hours of support per month in either personal care or
                        participation supports, we will charge a one-time fee,
                        across all plans, accordingly.
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        e) Consumables
                      </p>
                      <p className="text-gray-700 mb-4">
                        Any cost or additional expenses related to your disability
                        that needs to be purchased, we can assist and help you to do
                        so. These requested purchases will be claimed against your
                        consumables funding within your plan. We will let you and
                        your representative know the details and costs before
                        proceeding with any claims.
                      </p>

                      {/* Section 11 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        11. Emergency and Disaster Management
                      </h2>
                      <p className="text-gray-700 mb-4">
                        Best of Homecare will assess your reliance on the service
                        provided to you during an emergency or natural disaster.
                        Where it is determined that disruption to your service would
                        impact your health and wellbeing, we will develop an
                        emergency and disaster plan to ensure continued service
                        provision.
                      </p>

                      {/* Section 12 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        12. Termination
                      </h2>
                      <p className="text-gray-700 mb-4">
                        Should either Party wishes to end this Agreement they must
                        give 1 months’ notice, without cause. If either party is in
                        breach of this Agreement, the party in breach will remedy
                        the breach within thirty (30) days of that party receiving
                        written notice requiring it to fix the breach. 100% of
                        rostered supports will be claimed if appropriate notice is
                        not provided. If notice has been given and the breach is not
                        satisfactorily remedied within thirty (30) days, the party
                        who gave the notice may immediately terminate this Agreement
                        by giving written notice. Note: In some instances, support
                        may be withdrawn for valid reasons, however access to
                        supports required by the participant will not be withdrawn
                        or denied solely on the basis of a dignity of risk choice
                        that has been made by the participant.
                      </p>

                      {/* Section 13 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        13. Feedback, Complaints and Disputes
                      </h2>
                      <p className="text-gray-700 mb-4">
                        The Provider recognises that Participants/Participants
                        Nominee and their carers have a right to provide feedback to
                        our staff, management and Board of Directors to raise
                        suggestions, resolve grievances and commend good performance
                        and encourages all Participants to speak up when they are
                        not happy. Any individual, stakeholder or agency wishing to
                        lodge a complaint against the organisation’s services,
                        management or staff will be provided with information
                        regarding the organisation’s Feedback, Compliments and
                        Complaints Policy and Process and contact our office via our
                        participant handbook. Complaints and feedback can be lodged
                        using the Compliments, complaints and feedback form and/or
                        contacting Senior Management at our office. Any complaint
                        will be heard respectfully and a willingness to assist
                        complainant. If you wish to direct your complaint
                        externally, you can contact the NDIS Quality and Safeguards
                        Commission on 1800 035 544 or seek independent assistance
                        through an advocate.
                      </p>

                      {/* Section 14 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        14. Advocacy
                      </h2>
                      <p className="text-gray-700 mb-4">
                        The Participant has a right to be represented by an advocate
                        at any time and we encourage the use of advocates during the
                        assessment and planning process. Advocates can be a family
                        member, friend, medical practitioner or from an advocacy
                        body. The Provider staff can assist you to access the
                        services of an advocacy body. Please see the Advocacy
                        Services List available on the Office of Public Advocate
                        website
                        www.disabilityadvocacyfinder.dss.gov.au/disability/ndap/
                      </p>

                      {/* Section 15 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        15. Day Program Services Only
                      </h2>
                      <p className="text-gray-700 mb-2 font-semibold">
                        a) Materials Fees
                      </p>
                      <p className="text-gray-700 mb-2">
                        Best of Homecare will cover the costs of resources used in
                        these programs. If additional resources are requested, then
                        you will need to cover the costs of these supplies outside
                        of your NDIS funding. Best of Homecare offers excellent,
                        well-resourced programs at each of our sites to help our
                        clients build skills. Best of Homecare will charge a
                        material fee per day, per person, to cover resources used in
                        these programs. Specific costs that this fee covers include,
                        but are not limited to, printing, stationery and art
                        supplies. This fee will be invoiced on a regular basis and
                        calculated based on each client’s attendance. Refer to the
                        quote for the current per day fee.
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        b) Additional Activities
                      </p>
                      <p className="text-gray-700 mb-2">
                        Activities that incur an entry cost (i.e. swimming entry
                        fee) or specific resources to undertake, outside of the
                        standard materials and resources maybe covered by Best of
                        Homecare however this will need to be discussed in advance
                        and notice provided to negotiate personal contributions you
                        can make outside of your NDIS funding.{" "}
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        c) In Program Transport
                      </p>
                      <p className="text-gray-700 mb-2">
                        Best of Homecare will charge Participants for transport
                        costs incurred within programs per day when the program
                        involves Best of Homecare organised transport, i.e. buses
                        and taxis. This fee will be invoiced on a regular basis and
                        calculated based on each Participant’s attendance. Refer to
                        the quote for the current per day fee. When a Participant
                        uses public transport, they will be required to bring their
                        myki card (Participant responsible for having credit) and
                        will not be charged the in-program transport fee.
                      </p>
                      <p className="text-gray-700 mb-2 font-semibold">
                        d) Centre Capital Costs
                      </p>
                      <p className="text-gray-700 mb-4">
                        Centre Capital Costs will be claimed from your plan to cover
                        our costs of running and maintaining the centre during the
                        time you we are providing support to you in our Day Program,
                        within this centre. Costs will be claimed per hour according
                        to the NDIS Price Guide{" "}
                      </p>

                      {/* Section 16 */}
                      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                        16. SIL/SDA Service Provision
                      </h2>
                      <p className="text-gray-700 mb-2">
                        Where supported independent living supports to participants
                        in specialist disability accommodation dwellings, documented
                        arrangements are in place with each participant and each
                        specialist disability accommodation provider. At a minimum,
                        the arrangements will outline the party or parties
                        responsible and their roles (where applicable) for the
                        following matters:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>
                          How a Participant’s concerns about the dwelling will be
                          communicated and addressed;
                        </li>
                        <li>
                          How potential conflicts involving participant(s) will be
                          managed;
                        </li>
                        <li>
                          How changes to participant circumstances and/or support
                          needs will be agreed and communicated;
                        </li>
                        <li>
                          In shared living, how vacancies will be filled, including
                          each participant’s right to have their needs, preferences
                          and situation taken into account;
                        </li>
                        <li>
                          How behaviours of concern which may put tenancies at risk
                          will be managed;
                        </li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        Please refer to your SIL residency agreement in relation to
                        the following areas:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-8">
                        <li>Ending your SIL Supports</li>
                        <li>Property Maintenance</li>
                        <li>Filling Vacancies</li>
                        <li>Participant and Households Expense Contributions</li>
                        <li>House Rules</li>
                      </ul>

                      <p className="text-gray-800 font-semibold text-center mt-6">
                        Agreement accepted and signed on behalf of Best of Homecare
                      </p>
                    </div>
                  </div>
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
      ) : isInvalidSession ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-red-500 font-bold">Unauthorized Please login again</span>
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
