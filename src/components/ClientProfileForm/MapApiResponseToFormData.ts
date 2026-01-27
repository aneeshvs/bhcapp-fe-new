
import { ClientApiResponse } from '@/src/components/ClientProfileForm/ApiResponse';
import clientProfileFormData from '@/src/components/ClientProfileForm/ClientProfileFormData';

type ClientProfileFormDataType = typeof clientProfileFormData;

export const mapApiResponseToFormData = (data: ClientApiResponse): ClientProfileFormDataType => {
    return {
        ...clientProfileFormData,
        // Initial Enquiry
        full_name: data.full_name || '',
        preferred_name: data.preferred_name || '',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        post_code: data.postcode || '',
        phone: data.phone_number || '',
        mobile: data.mobile_number || '',
        email: data.email || '',
        agreement: data.need_support_person ? 1 : 0,
        description: data.support_person_details || '',
        form_status: data.form_status || '',

        // Funding
        fundingType: data.funding?.type_of_funding || '',
        fundingContactPerson: data.funding?.funding_contact_person || '',
        ndisPlanAttached: data.funding?.ndis_plan_attached ? 1 : 0,
        ndisPlanStartDate: data.funding?.ndis_plan_start_date || '',
        ndisPlanEndDate: data.funding?.ndis_plan_end_date || '',
        planManagerName: data.funding?.plan_manager_name || '',
        planManagerMobile: data.funding?.plan_manager_phone || '',
        planManagerEmail: data.funding?.plan_manager_email || '',

        // Emergency Contact
        emergencyContactName: data.emergency_contact?.name || '',
        emergencyContactRelationship: data.emergency_contact?.relationship || '',
        emergencyPhone: data.emergency_contact?.phone || '',
        emergencyMobile: data.emergency_contact?.mobile || '',
        emergencyWork: data.emergency_contact?.work_contact || '',

        // Cultural Background
        has_children_under_18: data.cultural_background?.has_children_under_18 ? 1 : 0,
        countryOfBirth: data.cultural_background?.country_of_birth || '',
        preferredLanguage: data.cultural_background?.preferred_language || '',
        religion: data.cultural_background?.religion || '',
        otherLanguages: data.cultural_background?.other_languages || '',
        culturalNeeds: data.cultural_background?.cultural_needs || '',
        interpreterRequired: data.cultural_background?.interpreter_required ? 1 : 0,
        auslanRequired: data.cultural_background?.auslan_required ? 1 : 0,

        // Healthcare
        primaryDiagnosis: data.diagnosis_summary?.primary_diagnosis || '',
        secondaryDiagnosis: data.diagnosis_summary?.secondary_diagnosis || '',

        medicare: data.healthcare_support_detail?.medicare || '',
        healthFund: data.healthcare_support_detail?.health_fund || '',
        pension_card_number: data.healthcare_support_detail?.pension_card_number || '',
        healthCareCard: data.healthcare_support_detail?.health_care_card || '',
        dvaType: data.healthcare_support_detail?.dva_type || '',
        dvaNumber: data.healthcare_support_detail?.dva_number || '',
        companionCard: data.healthcare_support_detail?.companion_card || '',
        preferredHospital: data.healthcare_support_detail?.preferred_hospital || '',
        ambulanceNumber: data.healthcare_support_detail?.ambulance_number || '',
        disabledParking: data.healthcare_support_detail?.disabled_parking || '',

        // Behaviour Support
        has_support_plan: data.behaviour_support?.has_support_plan ? 1 : 0,
        plan_copy_received: data.behaviour_support?.plan_copy_received ? 1 : 0,

        // Medical Alerts
        epilepsy: data.medical_alert?.epilepsy ? 1 : 0,
        asthma: data.medical_alert?.asthma ? 1 : 0,
        diabetes: data.medical_alert?.diabetes ? 1 : 0,
        allergies: data.medical_alert?.allergies || '',
        medicalHealthInfo: data.medical_alert?.medical_info || '',
        diagnosis: data.medical_alert?.diagnosis || '',
        otherDescription: data.medical_alert?.other_description || '',
        medicationsTaken: data.medical_alert?.medication_taken || '',
        medicationPurpose: data.medical_alert?.medication_purpose || '',
        staffAdministerMedication: data.medical_alert?.staff_administer_medication ? 1 : 0,
        self_administered: data.medical_alert?.self_administered ? 1 : 0,
        guardian: data.medical_alert?.guardian ? 1 : 0,
        support_worker: data.medical_alert?.support_worker ? 1 : 0,

        // Health Summaries
        medicalImmunisationStatus: data.preventive_health_summary?.medical_checkup_status || '',
        lastDentalCheck: data.preventive_health_summary?.last_dental_check || '',
        lastHearingCheck: data.preventive_health_summary?.last_hearing_check || '',
        lastVisionCheck: data.preventive_health_summary?.last_vision_check || '',
        vaccineAssistance: data.preventive_health_summary?.requires_vaccination_assistance ? 1 : 0,
        communicationAssist: data.support_information?.communication_assistance_required ? 1 : 0,
        mealtimePlan: data.support_information?.mealtime_plan || '',
        likes: data.support_information?.likes || '',
        dislikes: data.support_information?.dislikes || '',
        interests: data.support_information?.interests || '',
        male: data.support_information?.male ? 1 : 0,
        female: data.support_information?.female ? 1 : 0,
        no_preference: data.support_information?.no_preference ? 1 : 0,
        specialRequest: data.support_information?.special_request || '',
        health_other_description: data.health_information?.health_other_description || '',
    };
};
