'use client';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Image from 'next/image';
import AccordionItem from '@/src/components/AccordionItem';

import clientProfileFormData from '@/src/components/ClientProfileForm/ClientProfileFormData';
import IntialEnquiry from '@/src/components/ClientProfileForm/IntialEnquiry';
import Funding from '@/src/components/ClientProfileForm/Funding';
import Emergency from '@/src/components/ClientProfileForm/Emergency';
import ScheduleOfCare from '@/src/components/ClientProfileForm/ScheduleOfCare';
import ReligiousCulturalBackground from '@/src/components/ClientProfileForm/Culture';
import NdisGoals from '@/src/components/ClientProfileForm/NdisGoals';
import HealthProffessional from '@/src/components/ClientProfileForm/HealthProffessional';
import DiagnosisSummary from '@/src/components/ClientProfileForm/DiagnosisSummary';
import HealthInformation from '@/src/components/ClientProfileForm/HealthInformation';
import HealthcareSupport from '@/src/components/ClientProfileForm/HealthCareSupport';
import Behaviour from '@/src/components/ClientProfileForm/BehaviorSupport';
import MedicalAlerts from '@/src/components/ClientProfileForm/MedicalAlerts';
import HealthSummaries from '@/src/components/ClientProfileForm/HealthSummaries';
import SupportInformation from '@/src/components/ClientProfileForm/SupportInformation';
import { update, show, getFormSession } from '@/src/services/crud';
import { useSearchParams } from 'next/navigation';
import { ClientApiResponse } from '@/src/components/ClientProfileForm/ApiResponse';
interface OnboardSubmitSuccess {
  success: true;
  data: {
    initial: {
      uuid: string;
      id: number;
    };
  };
}
interface NdisGoals {
  goal_description: string;
  goal_key: string;
}

interface OnboardSubmitError {
  success: false;
  data: Record<string, string>; // email, phone, etc.
  message?: string;
  status?: number;
  alert?: boolean;
}

type OnboardSubmitResponse = OnboardSubmitSuccess | OnboardSubmitError;
export default function ClientProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(clientProfileFormData);
  const [careEntries, setCareEntries] = useState([{ type_of_service: '', primary_task_list: '', secondary_task_list: '', goal_key: '' }]);
  const [ndisGoals, setNdisGoals] = useState<NdisGoals[]>([{
    goal_description: '',
    goal_key: '' // Provide empty string as default
  }]);
  const [healthProffessional, setHealthProffessional] = useState([{ role: '', name: '', contact_number: '' }]);
  const [healthInformation, setHealthInformation] = useState({ health_conditions: [] as string[] });
  const [loading, setLoading] = useState<null | 'save' | 'submit'>(null);
  const [flag, setFlag] = useState(false);
  const [isInvalidSession, setIsInvalidSession] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  // const [activeSection, setActiveSection] = useState<keyof typeof sectionRefs | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    clientDetails: false, // Default to open the first section
    funding: false,
    emergency: false,
    schedule: false,
    culture: false,
    goals: false,
    healthPro: false,
    diagnosis: false,
    healthInfo: false,
    healthcareSupport: false,
    behaviour: false,
    medicalAlerts: false,
    healthSummaries: false,
    supportInfo: false
  });


  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});



  const sectionRefs = {
    clientDetails: useRef<HTMLDivElement>(null),
    funding: useRef<HTMLDivElement>(null),
    emergency: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    culture: useRef<HTMLDivElement>(null),
    goals: useRef<HTMLDivElement>(null),
    healthPro: useRef<HTMLDivElement>(null),
    diagnosis: useRef<HTMLDivElement>(null),
    healthInfo: useRef<HTMLDivElement>(null),
    healthcareSupport: useRef<HTMLDivElement>(null),
    behaviour: useRef<HTMLDivElement>(null),
    medicalAlerts: useRef<HTMLDivElement>(null),
    healthSummaries: useRef<HTMLDivElement>(null),
    supportInfo: useRef<HTMLDivElement>(null),
  };
  const fetchFormData = async () => {
    try {
      const effectiveUuid = sessionUuid || searchParams.get('uuid');
      if (!effectiveUuid) {
        console.log('No UUID - skipping initial data fetch');
        return;
      }
      const response = await show<ClientApiResponse>("form-data", effectiveUuid || "");
      console.log(response);
      if (!response?.data) {
        console.log('No client profile data found');
        return;
      }

      if (response.data.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      // Set form data from API response
      setFormData({
        ...formData,
        // Initial Enquiry
        full_name: response.data?.full_name || '',
        preferred_name: response.data?.preferred_name || '',
        gender: response.data?.gender || '',
        date_of_birth: response.data?.date_of_birth || '',
        address: response.data?.address || '',
        post_code: response.data?.postcode || '',
        phone: response.data?.phone_number || '',
        mobile: response.data?.mobile_number || '',
        email: response.data?.email || '',
        agreement: response.data?.need_support_person ? 1 : 0,
        description: response.data?.support_person_details || '',
        form_status: response.data?.form_status || '',


        // Funding
        fundingType: response.data?.funding.type_of_funding || '',
        fundingContactPerson: response.data?.funding.funding_contact_person || '',
        ndisPlanAttached: response.data?.funding.ndis_plan_attached ? 1 : 0,
        ndisPlanStartDate: response.data?.funding.ndis_plan_start_date || '',
        ndisPlanEndDate: response.data?.funding.ndis_plan_end_date || '',
        planManagerName: response.data?.funding.plan_manager_name || '',
        planManagerMobile: response.data?.funding.plan_manager_phone || '',
        planManagerEmail: response.data?.funding.plan_manager_email || '',

        // Emergency Contact
        emergencyContactName: response.data?.emergency_contact.name || '',
        emergencyContactRelationship: response.data?.emergency_contact.relationship || '',
        emergencyPhone: response.data?.emergency_contact.phone || '',
        emergencyMobile: response.data?.emergency_contact.mobile || '',
        emergencyWork: response.data?.emergency_contact.work_contact || '',

        // Cultural Background
        has_children_under_18: response.data?.cultural_background.has_children_under_18 ? 1 : 0,
        countryOfBirth: response.data?.cultural_background.country_of_birth || '',
        preferredLanguage: response.data?.cultural_background.preferred_language || '',
        religion: response.data?.cultural_background.religion || '',
        otherLanguages: response.data?.cultural_background.other_languages || '',
        culturalNeeds: response.data?.cultural_background.cultural_needs || '',
        interpreterRequired: response.data?.cultural_background.interpreter_required ? 1 : 0,
        auslanRequired: response.data?.cultural_background.auslan_required ? 1 : 0,

        // Healthcare
        primaryDiagnosis: response.data?.diagnosis_summary.primary_diagnosis || '',
        secondaryDiagnosis: response.data?.diagnosis_summary.secondary_diagnosis || '',

        medicare: response.data?.healthcare_support_detail.medicare || '',
        healthFund: response.data?.healthcare_support_detail.health_fund || '',
        pension_card_number: response.data?.healthcare_support_detail.pension_card_number || '',
        healthCareCard: response.data?.healthcare_support_detail.health_care_card || '',
        dvaType: response.data?.healthcare_support_detail.dva_type || '',
        dvaNumber: response.data?.healthcare_support_detail.dva_number || '',
        companionCard: response.data?.healthcare_support_detail.companion_card || '',
        preferredHospital: response.data?.healthcare_support_detail.preferred_hospital || '',
        ambulanceNumber: response.data?.healthcare_support_detail.ambulance_number || '',
        disabledParking: response.data?.healthcare_support_detail.disabled_parking || '',

        // Behaviour Support
        has_support_plan: response.data?.behaviour_support.has_support_plan ? 1 : 0,
        plan_copy_received: response.data?.behaviour_support.plan_copy_received ? 1 : 0,

        // Medical Alerts
        epilepsy: response.data?.medical_alert.epilepsy ? 1 : 0,
        asthma: response.data.medical_alert.asthma ? 1 : 0,
        diabetes: response.data?.medical_alert.diabetes ? 1 : 0,
        allergies: response.data?.medical_alert.allergies || '',
        medicalHealthInfo: response.data?.medical_alert.medical_info || '',
        diagnosis: response.data?.medical_alert.diagnosis || '',
        otherDescription: response.data?.medical_alert.other_description || '',
        medicationsTaken: response.data?.medical_alert.medication_taken || '',
        medicationPurpose: response.data?.medical_alert.medication_purpose || '',
        staffAdministerMedication: response.data?.medical_alert.staff_administer_medication ? 1 : 0,
        self_administered: response.data?.medical_alert.self_administered ? 1 : 0,
        guardian: response.data?.medical_alert.guardian ? 1 : 0,
        support_worker: response.data?.medical_alert.support_worker ? 1 : 0,

        // Health Summaries
        medicalImmunisationStatus: response.data?.preventive_health_summary.medical_checkup_status || '',
        lastDentalCheck: response.data?.preventive_health_summary.last_dental_check || '',
        lastHearingCheck: response.data?.preventive_health_summary.last_hearing_check || '',
        lastVisionCheck: response.data?.preventive_health_summary.last_vision_check || '',
        vaccineAssistance: response.data?.preventive_health_summary.requires_vaccination_assistance ? 1 : 0,
        communicationAssist: response.data?.support_information.communication_assistance_required ? 1 : 0,
        mealtimePlan: response.data?.support_information.mealtime_plan || '',
        likes: response.data?.support_information.likes || '',
        dislikes: response.data?.support_information.dislikes || '',
        interests: response.data?.support_information.interests || '',
        male: response.data?.support_information.male ? 1 : 0,
        female: response.data?.support_information.female ? 1 : 0,
        no_preference: response.data?.support_information.no_preference ? 1 : 0,
        specialRequest: response.data?.support_information.special_request || '',
      });

      // Set array data from API response
      if (response.data?.schedule_of_cares) {
        setCareEntries(response.data.schedule_of_cares);
      }

      if (response.data?.ndis_goals) {
        setNdisGoals(
          response.data.ndis_goals.map(goal => ({
            goal_description: goal.goal_description ?? '',
            goal_key: goal.goal_key ?? ''
          }))
        );
      }

      if (response.data?.health_professional_details) {
        setHealthProffessional(response.data.health_professional_details);
      }

      if (response.data?.health_information?.health_conditions) {
        setHealthInformation({
          health_conditions: Array.isArray(response.data.health_information.health_conditions)
            ? response.data.health_information.health_conditions
            : [response.data.health_information.health_conditions]
        });
      }

    } catch (error) {
      console.error('Error fetching client profile data:', error);
    }
  };
  useEffect(() => {
    const effectiveUuid = sessionUuid || searchParams.get('uuid');
    if (effectiveUuid) {
      fetchFormData();
    }
  }, [sessionUuid, searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | number | boolean } }
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    (async () => {
      try {
        // 👇 get form name from URL query (e.g. ?form=support-plan)
        const form = "client-profile";

        // 👇 pass form to API
        const formUuid = searchParams.get('form-uuid');
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    try {
      const data = new FormData();
      setErrors({}); // Reset errors before submission
      if (formData.submit_final === 1) {
        data.append('submit_final', '1');
      }

      // Intial Enquiry
      data.append('user_id', sessionUserId || '');
      data.append('client_type', sessionClientType || '');
      data.append('full_name', formData.full_name || '');
      data.append('preferred_name', formData.preferred_name || '');
      data.append('gender', formData.gender || '');
      data.append('date_of_birth', formData.date_of_birth || '');
      data.append('address', formData.address || '');
      data.append('postcode', formData.post_code || '');
      data.append('phone_number', formData.phone || '');
      data.append('mobile_number', formData.mobile || '');
      data.append('email', formData.email || '');
      data.append('need_support_person', String(formData.agreement ?? 0));
      data.append('support_person_details', formData.description || '');

      // Funding
      data.append('type_of_funding', formData.fundingType || '');
      data.append('funding_contact_person', formData.fundingContactPerson || '');
      data.append('ndis_plan_attached', String(formData.ndisPlanAttached ?? 0));
      data.append('ndis_plan_start_date', formData.ndisPlanStartDate || '');
      data.append('ndis_plan_end_date', formData.ndisPlanEndDate || '');
      data.append('plan_manager_name', formData.planManagerName || '');
      data.append('plan_manager_email', formData.planManagerEmail || '');
      data.append('plan_manager_phone', formData.planManagerMobile || '');

      // Emgergenct Contacts
      data.append('name', formData.emergencyContactName || '');
      data.append('relationship', formData.emergencyContactRelationship || '');
      data.append('phone', formData.emergencyPhone || '');
      data.append('mobile', formData.emergencyMobile || '');
      data.append('work_contact', formData.emergencyWork || '');

      // Schedule of Care
      data.append('schedule_of_cares', JSON.stringify(careEntries));

      // Culture
      data.append('has_children_under_18', String(formData.has_children_under_18 ?? 0));
      data.append('country_of_birth', formData.countryOfBirth || '');
      data.append('preferred_language', formData.preferredLanguage || '');
      data.append('religion', formData.religion || '');
      data.append('other_languages', formData.otherLanguages || '');
      data.append('cultural_needs', formData.culturalNeeds || '');
      data.append('interpreter_required', String(formData.interpreterRequired ?? 0));
      data.append('auslan_required', String(formData.auslanRequired ?? 0));

      // Ndis goals
      data.append('ndis_goals_onboarding', JSON.stringify(ndisGoals));

      // Health Proffessional
      data.append('health_professional_details', JSON.stringify(healthProffessional));

      // DiagnosisSummary
      data.append('primary_diagnosis', formData.primaryDiagnosis || '');
      data.append('secondary_diagnosis', formData.secondaryDiagnosis || '');

      // Health Info
      data.append('health_conditions', JSON.stringify(healthInformation.health_conditions || ''));

      // Health care
      data.append('medicare', formData.medicare || '');
      data.append('health_fund', formData.healthFund || '');
      data.append('pension_card_number', formData.pension_card_number || '');
      data.append('health_care_card', formData.healthCareCard || '');
      data.append('dva_type', formData.dvaType || '');
      data.append('dva_number', formData.dvaNumber || '');
      data.append('companion_card', formData.companionCard || '');
      data.append('preferred_hospital', formData.preferredHospital || '');
      data.append('ambulance_number', formData.ambulanceNumber || '');
      data.append('disabled_parking', formData.disabledParking || '');

      // Behaviour support
      data.append('plan_copy_received', String(formData.plan_copy_received ?? 0));
      data.append('has_support_plan', String(formData.has_support_plan ?? 0));

      // MEdiacal alerts
      data.append('epilepsy', String(formData.epilepsy ?? 0));
      data.append('asthma', String(formData.asthma ?? 0));
      data.append('diabetes', String(formData.diabetes ?? 0));
      data.append('allergies', formData.allergies || '');
      data.append('medical_info', formData.medicalHealthInfo || '');
      data.append('diagnosis', formData.diagnosis || '');
      data.append('other_description', formData.otherDescription || '');
      data.append('medication_taken', formData.medicationsTaken || '');
      data.append('medication_purpose', formData.medicationPurpose || '');
      data.append('staff_administer_medication', String(formData.staffAdministerMedication ?? 0));
      data.append('self_administered', String(formData.self_administered ?? 0));
      data.append('guardian', String(formData.guardian ?? 0));
      data.append('support_worker', String(formData.support_worker ?? 0));

      // Prevent health summaries
      data.append('medical_checkup_status', formData.medicalImmunisationStatus || '');
      data.append('last_dental_check', formData.lastDentalCheck || '');
      data.append('last_hearing_check', formData.lastHearingCheck || '');
      data.append('last_vision_check', formData.lastVisionCheck || '');
      data.append('requires_vaccination_assistance', String(formData.vaccineAssistance ?? 0));
      data.append('communication_assistance_required', String(formData.communicationAssist ?? 0));
      data.append('mealtime_plan', formData.mealtimePlan || '');
      data.append('likes', formData.likes || '');
      data.append('dislikes', formData.dislikes || '');
      data.append('interests', formData.interests || '');
      data.append('male', String(formData.male ?? 0));
      data.append('female', String(formData.female ?? 0));
      data.append('no_preference', String(formData.no_preference ?? 0));
      data.append('special_request', formData.specialRequest || '');

      const apiResponse = await update('onboardsubmit', data);

      // Transform the API response to match OnboardSubmitResponse
      let response: OnboardSubmitResponse;
      console.log('API Response:', apiResponse);
      if (apiResponse.success) {
        response = {
          success: true,
          data: apiResponse.data as { initial: { uuid: string; id: number } },
        };
        window.alert("Form submitted successfully.");
      } else {
        response = {
          success: false,
          data: apiResponse.data as Record<string, string>,
          message: apiResponse.message,
        };
      }

      // Now use the properly typed response
      if (response.success === false) {
        setErrors(response.data || {});
        alert('Please fill the form in the correct format.');
        return;
      }

      console.log(response);
      if (!sessionUuid && !searchParams.get('form-uuid') && !searchParams.get('uuid') && response?.data?.initial.uuid) {
        const newUuid = response.data.initial.uuid;
        setSessionUuid(newUuid);
        router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
        await fetchFormData();
      } else if (sessionUuid || searchParams.get('form-uuid') || searchParams.get('uuid')) {
        await fetchFormData();
      }
      setLoading(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ data?: Record<string, string | string[]> }>;
      console.error('Form submission error:', error);
      if (error.response && error.response.status === 400 && error.response.data) {
        const responseData = error.response.data;
        if (responseData.data) {
          const newErrors: Record<string, string> = {};
          Object.entries(responseData.data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              newErrors[key] = value[0];
            } else {
              newErrors[key] = String(value);
            }
          });
          setErrors(newErrors);
        }
      }
      alert('An error occurred while submitting the form. Please check the errors at the bottom of the form.');
    } finally {
      setLoading(null);
    }
  };

  const handleTrackerClick = (key: keyof typeof sectionRefs) => {
    setOpenSections(prev => {
      if (prev[key]) {
        return { ...prev, [key]: false };
      }

      const newState = Object.keys(prev).reduce((acc, sectionKey) => ({
        ...acc,
        [sectionKey]: false
      }), {} as Record<string, boolean>);

      return { ...newState, [key]: true };
    });

    // Delay scroll until after DOM updates
    setTimeout(() => {
      sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // 100ms is usually enough
  };

  useEffect(() => {
    const userId = searchParams.get("userid");
    const clientType = searchParams.get("client_type");

    if (userId) setSessionUserId(userId);
    if (clientType) setSessionClientType(clientType);
  }, [searchParams]);

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
          {(sessionUuid || searchParams.get('uuid')) && (
            <div className="text-center mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="btn-primary h-4 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Form completion: {completionPercentage}%
              </p>
            </div>
          )}

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="text-center mb-6">
              {/* <p className="font-semibold text-base md:text-lg">
            Document Number:
            <span className="text-heading ml-2">Form F-28</span>
          </p> */}
              <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
                Form-F18 Client Profile (Onboarding)
              </h1>
            </div>
            <div className="flex overflow-x-auto space-x-4 py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {[
                { key: 'clientDetails', label: 'Intial Enquiry' },
                { key: 'funding', label: 'Funding' },
                { key: 'emergency', label: 'Emergency Contacts' },
                { key: 'schedule', label: 'Schedule of Care' },
                { key: 'culture', label: 'Religious & Culture' },
                { key: 'goals', label: 'Ndis Goals' },
                { key: 'healthPro', label: 'Health Proffessional Details' },
                { key: 'diagnosis', label: 'Diagnosis Summary' },
                { key: 'healthInfo', label: 'Health Information' },
                { key: 'healthcareSupport', label: 'Healthcare Details' },
                { key: 'behaviour', label: 'Behaviour Supports' },
                { key: 'medicalAlerts', label: 'Medical Alerts' },
                { key: 'healthSummaries', label: 'Preventive Health Summary' },
                { key: 'supportInfo', label: 'Support Information' },
              ].map((step, i) => (
                <div key={step.key} className="text-center flex-1 cursor-pointer" onClick={() => handleTrackerClick(step.key as keyof typeof sectionRefs)}>
                  <div className="w-8 h-8 mx-auto rounded-full btn-primary text-white flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </div>
                  <p className="text-xs mt-1 text-gray-600">{step.label}</p>
                </div>
              ))}
            </div>

            {/* Accordion Sections */}
            <div ref={sectionRefs.clientDetails}>
              <AccordionItem
                title="1. PART A - INITIAL ENQUIRY"
                isOpen={openSections.clientDetails}
                onToggle={() => handleTrackerClick('clientDetails')}
              >
                <IntialEnquiry formData={formData} handleChange={handleChange} errors={errors} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.funding}>
              <AccordionItem
                title="2. FUNDING"
                isOpen={openSections.funding}
                onToggle={() => handleTrackerClick('funding')}
              >
                <Funding formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.emergency}>
              <AccordionItem
                title="3. ALTERNATIVE / EMERGENCY CONTACTS"
                isOpen={openSections.emergency}
                onToggle={() => handleTrackerClick('emergency')}
              >
                <Emergency formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>


            <div ref={sectionRefs.schedule}>
              <AccordionItem
                title="4. SCHEDULE OF CARE"
                isOpen={openSections.schedule}
                onToggle={() => handleTrackerClick('schedule')}
              >
                <ScheduleOfCare careEntries={careEntries} setCareEntries={setCareEntries} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            {/* <div className="my-4 px-4">
          <label className="block font-semibold text-lg mb-2">
            Are there children under the age of 18 residing in the client’s home?
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_children_under_18"
                value={1}
                checked={formData.has_children_under_18 === 1}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'has_children_under_18',
                      value: Number(e.target.value),
                    },
                  })
                }
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_children_under_18"
                value={0}
                checked={formData.has_children_under_18 === 0}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'has_children_under_18',
                      value: Number(e.target.value),
                    },
                  })
                }
              />
              No
            </label>
          </div>
        </div> */}

            <div ref={sectionRefs.culture}>
              <AccordionItem
                title="5. RELIGIOUS / CULTURAL BACKGROUND"
                isOpen={openSections.culture}
                onToggle={() => handleTrackerClick('culture')}
              >
                <ReligiousCulturalBackground formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.goals}>
              <AccordionItem
                title="6. NDIS GOALS FOR BHC SUPPORT"
                isOpen={openSections.goals}
                onToggle={() => handleTrackerClick('goals')}
              >
                <NdisGoals ndisGoals={ndisGoals} setNdisGoals={setNdisGoals} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.healthPro}>
              <AccordionItem
                title="7. HEALTH PROFESSIONAL DETAILS"
                isOpen={openSections.healthPro}
                onToggle={() => handleTrackerClick('healthPro')}
              >
                <HealthProffessional healthProffessional={healthProffessional} setHealthProffessional={setHealthProffessional} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.diagnosis}>
              <AccordionItem
                title="8. DIAGNOSIS SUMMARY"
                isOpen={openSections.diagnosis}
                onToggle={() => handleTrackerClick('diagnosis')}
              >
                <DiagnosisSummary formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.healthInfo}>
              <AccordionItem
                title="9. HEALTH INFORMATION"
                isOpen={openSections.healthInfo}
                onToggle={() => handleTrackerClick('healthInfo')}
              >
                <HealthInformation healthInformation={healthInformation} setHealthInformation={setHealthInformation} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.healthcareSupport}>
              <AccordionItem
                title="10. HEALTHCARE AND SUPPORT DETAILS"
                isOpen={openSections.healthcareSupport}
                onToggle={() => handleTrackerClick('healthcareSupport')}
              >
                <HealthcareSupport formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.behaviour}>
              <AccordionItem
                title="11. BEHAVIOUR SUPPORTS"
                isOpen={openSections.behaviour}
                onToggle={() => handleTrackerClick('behaviour')}
              >
                <Behaviour formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.medicalAlerts}>
              <AccordionItem
                title="12. MEDICAL ALERTS / ALLERGIES"
                isOpen={openSections.medicalAlerts}
                onToggle={() => handleTrackerClick('medicalAlerts')}
              >
                <MedicalAlerts formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.healthSummaries}>
              <AccordionItem
                title="13. PREVENTIVE HEALTH SUMMARY"
                isOpen={openSections.healthSummaries}
                onToggle={() => handleTrackerClick('healthSummaries')}
              >
                <HealthSummaries formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>

            <div ref={sectionRefs.supportInfo}>
              <AccordionItem
                title="14. SUPPORT INFORMATION"
                isOpen={openSections.supportInfo}
                onToggle={() => handleTrackerClick('supportInfo')}
              >
                <SupportInformation formData={formData} handleChange={handleChange} uuid={sessionUuid} />
              </AccordionItem>
            </div>




            {/* Action Buttons */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-4 mb-6">
                <p className="font-bold">Please correct the following errors:</p>
                <ul className="list-disc ml-5">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>
                      <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={async (e) => {
                  if (window.confirm('Are you sure you want to submit the form?')) {
                    setLoading('submit');
                    await handleSubmit(e as React.FormEvent);
                  }
                }}
                className="btn-primary btn-primary:hover text-white font-medium py-2 px-6 rounded-lg transition"
              >
                {loading === 'submit' ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {/* Checkbox for staff involvement */}
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
          {/* {uuid && (
        <div className="flex justify-end mt-4 mb-6">
          <button
            className="btn-primary btn-primary:hover text-white font-medium py-2 px-6 rounded-lg transition"
            type="button"
            onClick={() => window.location.href = `/client-profile-form/view-logs?uuid=${uuid ?? ''}`}
          >
            View Log
          </button>
        </div>
      )}       */}
        </div>) : isInvalidSession ? (
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
