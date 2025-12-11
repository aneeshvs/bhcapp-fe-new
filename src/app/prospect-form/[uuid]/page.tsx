'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import AccommodationSupport from '@/src/components/ProspectForm/AccommodationSupport';
import ClientAndGuardianDetails from '@/src/components/ProspectForm/ClientAndGuardianDetails';
import PersonMakingReferral from '@/src/components/ProspectForm/PersonMakingReferral';
import PreviousServiceProviders from '@/src/components/ProspectForm/PreviousServiceProvider';
import BHCServices from '@/src/components/ProspectForm/BHCServices';
import ClientNdisDetails from '@/src/components/ProspectForm/ClientNdisDetails';
import AccordionItem from '@/src/components/AccordionItem';
import ClientMedicalInfo from '@/src/components/ProspectForm/ClientMedicalInfo';
import HouseHistories from '@/src/components/ProspectForm/HouseHistories';
import RosterOfCare from '@/src/components/ProspectForm/RosterOfCare';
import NdisPlan from '@/src/components/ProspectForm/NdisPlan';
import IndependentLiving from '@/src/components/ProspectForm/IndependentLiving';
import FinalDeclaration from '@/src/components/ProspectForm/FinalDeclaration';
import { update,show,index } from '@/src/services/crud'
import type {ClientFormResponse} from '@/src/types/type'
import type {ServiceProvider} from '@/src/components/ProspectForm/PreviousServiceProvider'
import type {NdisGoals} from '@/src/components/ProspectForm/NdisPlan'
import type {ServiceRequired} from '@/src/components/ProspectForm/BHCServices'



export default function FormPage() {
  const params = useParams();
  const rawUuid = params?.uuid;
  const uuid = Array.isArray(rawUuid) ? rawUuid[0] : rawUuid ?? "";
  const [loading,setLoading] = useState<null | 'save' | 'submit'>(null);
  const [formStatus, setFormStatus] = useState(0);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    // Accommodation Support

    type_of_accommodation: [] as string[],
    requested_support: [] as string[],
    worker_preference: '',
    date_of_referral: '',

    // Client and Guardian Details

    full_name: '',
    date_of_birth: '',
    gender: '',
    residential_address: '',
    mobile: '',
    work_phone: '',
    home_phone: '',
    email: '',
    atsi_status: '',
    cultural_background: '',
    language_spoken: '',
    interpreter_required: 0,
    guardian_name: '',
    is_public_guardian: '',
    guardian_relationship: '',
    guardian_mobile: '',
    guardian_email: '',
    guardian_address: '',   
    guardian_contact_method: '',

    // Person Making Referral

    agency: '',
    contact_name: '',
    job_title: '',
    work_contact: '',
    referral_mobile: '',
    referral_email: '',
    has_consent: 0,

    //client ndis details
    ndis_plan_approved: '',
    ndis_number: '',
    ndis_plan_start_date: '',
    ndis_plan_end_date: '',
    plan_manager_name: '',
    plan_manager_contact_mobile: '',
    plan_manager_contact_email: '',
    plan_type: '',
    copy_of_plan_provided: '',
    reason_plan_not_provided: '',
    engagement_concerns: '',
    engagement_concerns_description: '',

    // Client Medical Details

    primary_disability: '',
    secondary_disability: '',
    requires_high_intensity_support: 0,
    complex_bowel_care: 0,
    enteral_feeding: 0,
    tracheostomy_care: 0,
    urinary_catheters: 0,
    ventilation: 0,
    subcutaneous_injection: 0,
    communication_method: '',
    communication_assessment: '',
    occupational_therapy_assessment: '',
    hoisting: 0,
    assisted_devices: 0,
    mobility_other: '',
    hospital_bed: 0,
    pressure_mattresses: 0,
    equipment_other: '',
    challenging_behaviours: '',
    pbsp_attached: 0,
    pbsp_required: 0,
    pbsp_review_requested: 0,
    behaviour_support_practitioner_contact: '',
    other: 0,


    // House History

    most_recent_housing: '',
    prior_housing: '',
    mental_health_service: 0,
    aboriginal_service: 0,
    communities_and_justice: 0,
    family_violence: 0,
    correctional_service: 0,
    child_protection: 0,
    drug_alcohol_rehabilitation: 0,
    other_services_involved: 0,
    other_services_description: '',
    services_background_info: '',
    services_contact_details: '',
    issue_mental_health: 0,
    issue_drug_alcohol: 0,
    issue_family_violence: 0,
    issue_police_involvement: 0,
    issue_child_protection: 0,
    issue_child_custody: 0,
    issue_other_description: '',

    //Roster

    need_bhc_community_support: 0,
    comments: '',
    transport_funding: 0,

    //Independant house

    rent_per_week: 0,
    utilities_per_week: 0,
    needs_furnished: 0,
    owns_furniture: 0,
    lease_duration: '',
    can_pay_bond_upfront: 0,
    preferred_location: '',
    living_preference: '',
    share_preferences: '',

    //final declaration

    referrer_date: '',
    referrer_name: '',
    referrer_signature: '',
    referrer_organisation: '',
    client_date: '',
    client_name: '',
    client_signature: '',
    guardian_date: '',
    declaration_guardian_name: '',
    guardian_signature: '',
  });
  const [serviceProviders, setServiceProviders] = useState([
    { provider: '', contact_details: '', length_of_support: '', reason_for_leaving: '' },
  ]);
  const [ndisPlans,setNdisPlans] = useState([
    {goal: '', barriers: ''},
  ]);
  const [serviceRequired, setServiceRequired] = useState([
    { service_name: ''},
  ]);
  const handleChange = (e:| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>| { target: { name: string; value: string | number | boolean  } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [passwordError, setPasswordError] = useState('');

const validatePassword = async (password: string) => {
  try {
    const response = await index("validate-password", {
      uuid,
      password
    });

    
    if (response?.success) {
      return true;
    } else {
      setPasswordError('Incorrect password');
      return false;
    }
  } catch (error) {
    console.error('Error validating password:', error);
    setPasswordError('Error validating password. Please try again.');
    return false;
  }
};

const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setPasswordError('');
  
  if (!enteredPassword) {
    setPasswordError('Please enter a password');
    return;
  }

  const isValid = await validatePassword(enteredPassword);
  
  if (isValid) {
    setAuthenticated(true);
    // Only fetch form data after successful authentication
    fetchFormData();
  }
};

// Remove the useEffect that automatically calls fetchFormData
// We'll now call it only after successful authentication

    const fetchFormData = async () => {
      try {
        const response = await show<ClientFormResponse>("form/data", uuid || "");
        if(response.data.form_status == 'completed'){
          setFormStatus(1);
        }
        if(response.data.form_status == 'in_progress'){
          setFormStatus(0);
        }
        

        if (!response?.data) {
          console.log('No form data found');
          return;
        }
        // Accommodation Support
        setFormData({
          ...formData,
          type_of_accommodation: typeof response.data?.accommodations?.[0]?.type_of_accommodation === 'string'
            ? response.data.accommodations[0].type_of_accommodation.split(',')
            : Array.isArray(response.data?.accommodations?.[0]?.type_of_accommodation)
              ? response.data.accommodations[0].type_of_accommodation
              : [],
          requested_support: typeof response.data?.accommodations?.[0]?.requested_support === 'string'
            ? response.data.accommodations[0].requested_support.split(',')
            : Array.isArray(response.data?.accommodations?.[0]?.requested_support)
              ? response.data.accommodations[0].requested_support
              : [],
          worker_preference: response.data?.accommodations?.[0]?.worker_preference || '',
          date_of_referral: response.data?.accommodations?.[0]?.date_of_referral || '',

          // Client and Guardian Details
          full_name: response.data?.full_name || '',
          date_of_birth: response.data?.date_of_birth || '',
          gender: response.data?.gender || '',
          residential_address: response.data?.residential_address || '',
          mobile: response.data?.mobile || '',
          work_phone: response.data?.work_phone || '',
          home_phone: response.data?.home_phone || '',
          email: response.data?.email || '',
          atsi_status: response.data?.atsi_status || '',
          cultural_background: response.data?.cultural_background || '',
          language_spoken: response.data?.language_spoken || '',
          interpreter_required: response.data?.interpreter_required ? 1 : 0,
          guardian_name: response.data?.guardian_name || '',
          is_public_guardian: response.data?.is_public_guardian  || 'No',
          guardian_relationship: response.data?.guardian_relationship || '',
          guardian_mobile: response.data?.guardian_mobile || '',
          guardian_email: response.data?.guardian_email || '',
          guardian_address: response.data?.guardian_address || '',
          guardian_contact_method: response.data?.guardian_contact_method || '',

          // Person Making Referral
          agency: response.data?.referrals?.[0]?.agency || '',
          contact_name: response.data?.referrals?.[0]?.contact_name || '',
          job_title: response.data?.referrals?.[0]?.job_title || '',
          work_contact: response.data?.referrals?.[0]?.work_contact || '',
          referral_mobile: response.data?.referrals?.[0]?.referral_mobile || '',
          referral_email: response.data?.referrals?.[0]?.referral_email || '',
          has_consent: response.data?.referrals?.[0]?.has_consent || 0,

          // client ndis details
          ndis_plan_approved: response.data?.client_ndis_detail?.ndis_plan_approved || '',
          ndis_number: response.data?.client_ndis_detail?.ndis_number || '',
          ndis_plan_start_date: response.data?.client_ndis_detail?.ndis_plan_start_date || '',
          ndis_plan_end_date: response.data?.client_ndis_detail?.ndis_plan_end_date || '',
          plan_manager_name: response.data?.client_ndis_detail?.plan_manager_name || '',
          plan_manager_contact_mobile: response.data?.client_ndis_detail?.plan_manager_contact_mobile || '',
          plan_manager_contact_email: response.data?.client_ndis_detail?.plan_manager_contact_email || '',
          plan_type: response.data?.client_ndis_detail?.plan_type || '',
          copy_of_plan_provided: response.data?.client_ndis_detail?.copy_of_plan_provided || '',
          reason_plan_not_provided: response.data?.client_ndis_detail?.reason_plan_not_provided || '',
          engagement_concerns: response.data?.client_ndis_detail?.engagement_concerns || '',
          engagement_concerns_description: response.data?.client_ndis_detail?.engagement_concerns_description || '',

          // Client Medical Details
          primary_disability: response.data?.medical_information?.primary_disability || '',
          secondary_disability: response.data?.medical_information?.secondary_disability || '',
          requires_high_intensity_support: response.data?.medical_information?.requires_high_intensity_support || 0,
          complex_bowel_care: response.data?.medical_information?.complex_bowel_care || 0,
          enteral_feeding: response.data?.medical_information?.enteral_feeding || 0,
          tracheostomy_care: response.data?.medical_information?.tracheostomy_care || 0,
          urinary_catheters: response.data?.medical_information?.urinary_catheters || 0,
          ventilation: response.data?.medical_information?.ventilation || 0,
          subcutaneous_injection: response.data?.medical_information?.subcutaneous_injection || 0,
          communication_method: response.data?.medical_information?.communication_method || '',
          communication_assessment: response.data?.medical_information?.communication_assessment || '',
          occupational_therapy_assessment: response.data?.medical_information?.occupational_therapy_assessment || '',
          hoisting: response.data?.medical_information?.hoisting || 0,
          assisted_devices: response.data?.medical_information?.assisted_devices || 0,
          mobility_other: response.data?.medical_information?.mobility_other || '',
          hospital_bed: response.data?.medical_information?.hospital_bed || 0,
          pressure_mattresses: response.data?.medical_information?.pressure_mattresses || 0,
          equipment_other: response.data?.medical_information?.equipment_other || '',
          challenging_behaviours: response.data?.medical_information?.challenging_behaviours || '',
          pbsp_attached: response.data?.medical_information?.pbsp_attached || 0,
          pbsp_required: response.data?.medical_information?.pbsp_required || 0,
          pbsp_review_requested: response.data?.medical_information?.pbsp_review_requested || 0,
          behaviour_support_practitioner_contact: response.data?.medical_information?.behaviour_support_practitioner_contact || '',
          // other: response.data?.medical_information?.other || 0, // Removed, property does not exist

          // House History
          most_recent_housing: response.data?.housing_history?.most_recent_housing || '',
          prior_housing: response.data?.housing_history?.prior_housing || '',
          mental_health_service: response.data?.housing_history?.mental_health_service || 0,
          aboriginal_service: response.data?.housing_history?.aboriginal_service || 0,
          communities_and_justice: response.data?.housing_history?.communities_and_justice || 0,
          family_violence: response.data?.housing_history?.family_violence || 0,
          correctional_service: response.data?.housing_history?.correctional_service || 0,
          child_protection: response.data?.housing_history?.child_protection || 0,
          drug_alcohol_rehabilitation: response.data?.housing_history?.drug_alcohol_rehabilitation || 0,
          other_services_involved: response.data?.housing_history?.other_services_involved || 0,
          other_services_description: response.data?.housing_history?.other_services_description || '',
          services_background_info: response.data?.housing_history?.services_background_info || '',
          services_contact_details: response.data?.housing_history?.services_contact_details || '',
          issue_mental_health: response.data?.housing_history?.issue_mental_health || 0,
          issue_drug_alcohol: response.data?.housing_history?.issue_drug_alcohol || 0,
          issue_family_violence: response.data?.housing_history?.issue_family_violence || 0,
          issue_police_involvement: response.data?.housing_history?.issue_police_involvement || 0,
          issue_child_protection: response.data?.housing_history?.issue_child_protection || 0,
          issue_child_custody: response.data?.housing_history?.issue_child_custody || 0,
          issue_other_description: response.data?.housing_history?.issue_other_description || '',

          // Roster
          need_bhc_community_support: response.data?.roster_of_care?.need_bhc_community_support || 0,
          comments: response.data?.roster_of_care?.comments || '',
          transport_funding: Number(response.data?.roster_of_care?.transport_funding) || 0,

          // Independent house
          rent_per_week: Number(response.data?.independent_living_option?.rent_per_week) || 0,
          utilities_per_week: Number(response.data?.independent_living_option?.utilities_per_week) || 0,
          needs_furnished: response.data?.independent_living_option?.needs_furnished || 0,
          owns_furniture: response.data?.independent_living_option?.owns_furniture || 0,
          lease_duration: response.data?.independent_living_option?.lease_duration || '',
          can_pay_bond_upfront: response.data?.independent_living_option?.can_pay_bond_upfront || 0,
          preferred_location: response.data?.independent_living_option?.preferred_location || '',
          living_preference: response.data?.independent_living_option?.living_preference || '',
          share_preferences: '', // Not in API, left blank

            // Final declaration
            referrer_date: response.data?.final_declaration?.referrer_date || '',
            referrer_name: response.data?.final_declaration?.referrer_name || '',
            referrer_signature: response.data?.final_declaration?.referrer_signature || '',
            referrer_organisation: response.data?.final_declaration?.referrer_organisation || '',
            client_date: response.data?.final_declaration?.client_date || '',
            client_name: response.data?.final_declaration?.client_name || '',
            client_signature: response.data?.final_declaration?.client_signature || '',
            guardian_date: response.data?.final_declaration?.guardian_date || '',
            declaration_guardian_name: response.data?.final_declaration?.declaration_guardian_name || '',
            guardian_signature: response.data?.final_declaration?.guardian_signature || '',
        });

        // Previous Service Providers
        setServiceProviders(
          Array.isArray(response.data?.previous_service_providers) && response.data?.previous_service_providers.length > 0
            ? response.data.previous_service_providers.map((p: ServiceProvider) => ({
          provider: p.provider || '',
          contact_details: p.contact_details || '',
          length_of_support: p.length_of_support || '',
          reason_for_leaving: p.reason_for_leaving || '',
          uuid: p.uuid || '',
              }))
            : [{ provider: '', contact_details: '', length_of_support: '', reason_for_leaving: '',uuid: ''}]
        );

        // NDIS Goals
        setNdisPlans(
          Array.isArray(response.data?.ndis_goals) && response.data?.ndis_goals.length > 0
            ? response.data.ndis_goals.map((g: NdisGoals) => ({
          goal: g.goal || '',
          barriers: g.barriers || '',
          uuid: g.uuid || '',
              }))
            : [{ goal: '', barriers: '', uuid: '' }]
        );

        // BHC Services
        setServiceRequired(
          Array.isArray(response.data?.selected_services) && response.data?.selected_services.length > 0
            ? response.data.selected_services.map((s: ServiceRequired) => ({
          service_name: s.service_name || '',
          uuid: s.uuid || '',
              }))
            : [{ service_name: '', uuid: '' }]
        );

      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    // if (uuid) {
    //   fetchFormData();
    // }


  const handleSubmit = async (e: React.FormEvent, submit_final: number = 1) => {
    e.preventDefault();
    try{
        const data = new FormData();
        if (submit_final === 1) {
          data.append('submit_final', '1');
        }
        
        // Accommodation Support

        data.append('type_of_accommodation', JSON.stringify(formData.type_of_accommodation));
        data.append('requested_support', JSON.stringify(formData.requested_support));
        data.append('worker_preference', formData.worker_preference);
        data.append('date_of_referral', formData.date_of_referral);

        // Client and Guardian Details

        data.append('full_name', formData.full_name);
        data.append('date_of_birth', formData.date_of_birth);
        data.append('gender', formData.gender);
        data.append('residential_address', formData.residential_address);
        data.append('mobile', formData.mobile);
        data.append('work_phone', formData.work_phone);
        data.append('home_phone', formData.home_phone); 
        data.append('email', formData.email);
        data.append('atsi_status', formData.atsi_status);
        data.append('cultural_background', formData.cultural_background);
        data.append('language_spoken', formData.language_spoken);
        data.append('interpreter_required', formData.interpreter_required.toString());
        data.append('guardian_name', formData.guardian_name);
        data.append('is_public_guardian', formData.is_public_guardian);
        data.append('guardian_relationship', formData.guardian_relationship);
        data.append('guardian_mobile', formData.guardian_mobile);
        data.append('guardian_email', formData.guardian_email);
        data.append('guardian_address', formData.guardian_address);
        data.append('guardian_contact_method', formData.guardian_contact_method);

        // Person Making Referral

        data.append('agency', formData.agency);
        data.append('contact_name', formData.contact_name);
        data.append('job_title', formData.job_title);
        data.append('work_contact', formData.work_contact);
        data.append('referral_mobile', formData.referral_mobile);
        data.append('referral_email', formData.referral_email);
        data.append('has_consent', formData.has_consent?.toString() || '0' );

        //Previous Service Providers

        data.append('previous_service_providers', JSON.stringify(serviceProviders));

        //bhc service

        data.append('selected_services', JSON.stringify(serviceRequired));


        //client ndis details

        data.append('ndis_plan_approved', formData.ndis_plan_approved || '');
        data.append('ndis_number', formData.ndis_number || '');
        data.append('ndis_plan_start_date', formData.ndis_plan_start_date || '');
        data.append('ndis_plan_end_date', formData.ndis_plan_end_date || '');
        data.append('plan_manager_name', formData.plan_manager_name || '');
        data.append('plan_manager_contact_mobile', formData.plan_manager_contact_mobile || '');
        data.append('plan_manager_contact_email', formData.plan_manager_contact_email || '');
        data.append('plan_type', formData.plan_type || '');
        data.append('copy_of_plan_provided', formData.copy_of_plan_provided || '');
        data.append('reason_plan_not_provided', formData.reason_plan_not_provided || '');
        data.append('engagement_concerns', formData.engagement_concerns || '');
        data.append('engagement_concerns_description', formData.engagement_concerns_description || '');


        // Client Medical Details

        data.append('primary_disability', formData.primary_disability);
        data.append('secondary_disability', formData.secondary_disability);
        data.append('requires_high_intensity_support', formData.requires_high_intensity_support.toString());
        data.append('complex_bowel_care', formData.complex_bowel_care.toString());
        data.append('enteral_feeding', formData.enteral_feeding.toString());
        data.append('tracheostomy_care', formData.tracheostomy_care.toString());
        data.append('urinary_catheters', formData.urinary_catheters.toString());
        data.append('ventilation', formData.ventilation.toString());
        data.append('subcutaneous_injection', formData.subcutaneous_injection.toString());
        data.append('communication_method', formData.communication_method);
        data.append('communication_assessment', formData.communication_assessment);
        data.append('occupational_therapy_assessment', formData.occupational_therapy_assessment);
        data.append('hoisting', formData.hoisting.toString());
        data.append('assisted_devices', formData.assisted_devices.toString());
        data.append('mobility_other', formData.mobility_other);
        data.append('hospital_bed', formData.hospital_bed.toString());
        data.append('pressure_mattresses', formData.pressure_mattresses.toString());
        data.append('other', formData.other.toString());
        data.append('equipment_other', formData.equipment_other);
        data.append('challenging_behaviours', formData.challenging_behaviours);
        data.append('pbsp_attached', formData.pbsp_attached.toString());
        data.append('pbsp_required', formData.pbsp_required.toString());
        data.append('pbsp_review_requested', formData.pbsp_review_requested.toString());
        data.append('behaviour_support_practitioner_contact', formData.behaviour_support_practitioner_contact);

        //house history

        data.append('most_recent_housing', formData.most_recent_housing);
        data.append('prior_housing', formData.prior_housing);
        data.append('mental_health_service', formData.mental_health_service.toString());
        data.append('aboriginal_service', formData.aboriginal_service.toString());
        data.append('communities_and_justice', formData.communities_and_justice.toString());
        data.append('family_violence', formData.family_violence.toString());
        data.append('correctional_service', formData.correctional_service.toString());
        data.append('child_protection', formData.child_protection.toString());
        data.append('drug_alcohol_rehabilitation', formData.drug_alcohol_rehabilitation.toString());
        data.append('other_services_involved', formData.other_services_involved.toString());
        data.append('other_services_description', formData.other_services_description);
        data.append('services_background_info', formData.services_background_info);
        data.append('services_contact_details', formData.services_contact_details);
        data.append('issue_mental_health', formData.issue_mental_health.toString());
        data.append('issue_drug_alcohol', formData.issue_drug_alcohol.toString());
        data.append('issue_family_violence', formData.issue_family_violence.toString());
        data.append('issue_police_involvement', formData.issue_police_involvement.toString());
        data.append('issue_child_protection', formData.issue_child_protection.toString());
        data.append('issue_child_custody', formData.issue_child_custody.toString());
        data.append('issue_other_description', formData.issue_other_description);

        //Roster of care

        data.append('need_bhc_community_support', formData.need_bhc_community_support?.toString() || '0');
        data.append('comments', formData.comments || '');
        data.append('transport_funding', formData.transport_funding?.toString() || '0');

        // ndis plan

        data.append('ndis_goals',JSON.stringify(ndisPlans));

        // independant house

        data.append('rent_per_week', formData.rent_per_week?.toString() || '0');
        data.append('utilities_per_week', formData.utilities_per_week?.toString() || '0');
        data.append('needs_furnished', formData.needs_furnished?.toString() || '0');
        data.append('owns_furniture', formData.owns_furniture?.toString() || '0');
        data.append('lease_duration', formData.lease_duration || '');
        data.append('can_pay_bond_upfront', formData.can_pay_bond_upfront?.toString() || '0');
        data.append('preferred_location', formData.preferred_location || '');
        data.append('living_preference', formData.living_preference || '');
        data.append('share_preferences', formData.share_preferences || '');


        //final declaration

        data.append('referrer_date', formData.referrer_date || '');
        data.append('referrer_name', formData.referrer_name || '');
        data.append('referrer_signature', formData.referrer_signature || '');
        data.append('referrer_organisation', formData.referrer_organisation || '');
        data.append('client_date', formData.client_date || '');
        data.append('client_name', formData.client_name || '');
        data.append('client_signature', formData.client_signature || '');
        data.append('guardian_date', formData.guardian_date || '');
        data.append('declaration_guardian_name', formData.declaration_guardian_name || '');
        data.append('guardian_signature', formData.guardian_signature || '');


        const response = await update(`form/submit/${uuid}`, data);
        if (submit_final === 1) {
          setFormStatus(1);
        }
        console.log(response);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      fetchFormData();
      setLoading(null); // Reset after operation
    }
    // router.push('/success'); 
  };
  if (!authenticated) {
    return (
      <div className="p-10 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Enter Password to Continue</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            placeholder="Enter password"
            className="border px-4 py-2 rounded mb-2 w-full"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mb-2">{passwordError}</p>
          )}
          <button
            type="submit"
            className="btn-primary px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
            disabled={!enteredPassword}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  // if (!authenticated) {
  //   const handlePasswordSubmit = (e: React.FormEvent) => {
  //     e.preventDefault(); // Prevent page reload
  //     if (enteredPassword === password) {
  //       setAuthenticated(true);
  //     } else {
  //       alert('Incorrect password');
  //     }
  //   };

  //   return (
  //     <div className="p-10 max-w-md mx-auto">
  //       <h2 className="text-xl font-semibold mb-4">Enter Password to Continue</h2>
  //       <form onSubmit={handlePasswordSubmit}>
  //         <input
  //           type="password"
  //           value={enteredPassword}
  //           onChange={(e) => setEnteredPassword(e.target.value)}
  //           placeholder="Enter password"
  //           className="border px-4 py-2 rounded mb-4 w-full"
  //         />
  //         <button
  //           type="submit"
  //           className="btn-primary px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
  //         >
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   );
  // }
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 mt-4">
      <div className="flex justify-center mb-4">
                  <Image
                    src="/assets/images/BHC LOGO_SMALL.png" 
                    alt="Company Logo"
                    width={200} 
                    height={100}
                    className="max-w-[200px] h-auto"
                  />
                </div>
      <form className="bg-gray-100 p-4 sm:p-6 rounded shadow max-w-7xl mx-auto">
        {/* Heading and Intro */}
        {/* <label className="font-bold text-center block mb-2 text-heading">
          Document Number:
          <span className="text-secondary ml-2 text-heading">Form F-28</span>
        </label> */}

        <h1 className="mb-4 text-center text-xl sm:text-2xl font-bold">Form-F28 New Client Referral Form</h1>

        <p className="text-sm sm:text-base text-muted text-justify mb-4">
          <strong>BHC</strong> is committed to ensuring that participant outcomes are optimal when being supported by us. 
          For this reason, all information about the potential incoming participant is required to ensure that the skill, 
          qualifications, and experience of our team are able to meet the needs of the client. Providing information about 
          other involved services will ensure that a collaborative approach is undertaken in supporting the clients 
          potential support/tenancy, thus providing a holistic model of care.
        </p>

        {/* Accordion Sections */}
        <AccordionItem title="ACCOMMODATION & SUPPORT">
          <AccommodationSupport
            type_of_accommodation={formData.type_of_accommodation}
            requested_support={formData.requested_support}
            worker_preference={formData.worker_preference}
            date_of_referral={formData.date_of_referral}
            onFieldChange={(field, value) => 
              setFormData(prev => ({ ...prev, [field]: value }))
            }
          />
        </AccordionItem>

        <AccordionItem title="CLIENT DETAILS">
          <ClientAndGuardianDetails formData={formData} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem title="PERSON MAKING REFERRAL (IF APPLICABLE)">
          <PersonMakingReferral formData={formData} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem title="PREVIOUS SERVICE PROVIDERS (SIL OR OTHER)">
          <PreviousServiceProviders serviceProviders={serviceProviders} setServiceProviders={setServiceProviders} />
        </AccordionItem>

        <AccordionItem title="SERVICES REQUIRED FROM BHC">
          <BHCServices serviceRequired={serviceRequired} setServiceRequired={setServiceRequired} />
        </AccordionItem>

        <AccordionItem title="CLIENT NDIS DETAILS">
          <ClientNdisDetails formData={formData} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem title="CLIENT MEDICAL INFORMATION">
          <ClientMedicalInfo formData={formData} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem title="HOUSING HISTORY AND OTHER PROVIDER/GOVT SERVICE INVOLVEMENT">
          <HouseHistories formData={formData} handleChange={handleChange} />
        </AccordionItem>

        {/* Info Note */}
        <div className="mt-3 rounded bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 text-sm">
          <strong>Note:</strong> Section 6 and 8 do not have to be completed if Accommodation is not required for this Participant.
          However, if In-Home Supports are required, please complete the entire form.
        </div>

        <AccordionItem title="ROSTER OF CARE (SIL OR OTHER)">
          <RosterOfCare formData={formData} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem title="NDIS PLAN – CURRENT GOALS">
          <NdisPlan ndisPlans={ndisPlans} setNdisPlans={setNdisPlans} />
        </AccordionItem>

        <AccordionItem title="INDEPENDENT LIVING OPTIONS (ILO)">
          <IndependentLiving formData={formData} handleChange={handleChange} />
        </AccordionItem>

        {/* Final Declaration */}
        <FinalDeclaration formData={formData} handleChange={handleChange} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="button"
            onClick={(e) => {
              setLoading('save');
              handleSubmit(e as React.FormEvent, 0);
            }}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition"
            disabled={loading !== null || formStatus === 1}
          >
            {loading === 'save' ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={async (e) => {
              if (window.confirm('Are you sure you want to submit the form?')) {
                setLoading('submit');
                await handleSubmit(e as React.FormEvent, 1);
              }
            }}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition"
            disabled={loading !== null || formStatus === 1}
          >
            {loading === 'submit' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}