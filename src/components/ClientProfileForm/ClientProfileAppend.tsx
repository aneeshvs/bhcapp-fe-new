// src/utils/clientProfileUtils.ts
import { ClientApiResponse } from '@/src/components/ClientProfileForm/ApiResponse';

// Define interfaces for the different data structures
export interface CareEntry {
  type_of_service: string;
  primary_task_list: string;
  secondary_task_list: string;
  goal_key: string; // Add goal_key to track submitted entries
}

export interface NdisGoal {
  goal_description: string;
  goal_key: string;
}

export interface HealthProfessional {
  role: string;
  name: string;
  contact_number: string;
}

export interface HealthInformation {
  health_conditions: string[];
}

export const prepareClientProfileFormData = (
  formData: ClientApiResponse,
  user_id: string | null,
  client_type: string | null,
  careEntries: CareEntry[],
  ndisGoals: NdisGoal[],
  healthProfessionals: HealthProfessional[],
  healthInformation: HealthInformation,
  submitFinal: boolean = false
): FormData => {
  const data = new FormData();

  if (submitFinal) {
    data.append('submit_final', '1');
  }

  // Initial Enquiry
  data.append('user_id', user_id || '');
  data.append('client_type', client_type || '');
  data.append('full_name', formData.full_name || '');
  data.append('preferred_name', formData.preferred_name || '');
  data.append('gender', formData.gender || '');
  data.append('date_of_birth', formData.date_of_birth || '');
  data.append('address', formData.address || '');
  data.append('postcode', formData.postcode || '');
  data.append('phone_number', formData.phone_number || '');
  data.append('mobile_number', formData.mobile_number || '');
  data.append('email', formData.email || '');
  data.append('need_support_person', String(formData.need_support_person ?? 0));
  data.append('support_person_details', formData.support_person_details || '');

  // Funding
  data.append('type_of_funding', formData.funding?.type_of_funding || '');
  data.append('funding_contact_person', formData.funding?.funding_contact_person || '');
  data.append('ndis_plan_attached', String(formData.funding?.ndis_plan_attached ?? 0));
  data.append('ndis_plan_start_date', formData.funding?.ndis_plan_start_date || '');
  data.append('ndis_plan_end_date', formData.funding?.ndis_plan_end_date || '');
  data.append('plan_manager_name', formData.funding?.plan_manager_name || '');
  data.append('plan_manager_email', formData.funding?.plan_manager_email || '');
  data.append('plan_manager_phone', formData.funding?.plan_manager_phone || '');

  // Emergency Contacts
  data.append('emergency_contact_name', formData.emergency_contact?.name || '');
  data.append('emergency_contact_relationship', formData.emergency_contact?.relationship || '');
  data.append('emergency_contact_phone', formData.emergency_contact?.phone || '');
  data.append('emergency_contact_mobile', formData.emergency_contact?.mobile || '');
  data.append('emergency_contact_work', formData.emergency_contact?.work_contact || '');

  // Schedule of Care
  data.append('schedule_of_cares', JSON.stringify(careEntries));

  // Cultural Background
  data.append('has_children_under_18', String(formData.cultural_background?.has_children_under_18 ?? 0));
  data.append('country_of_birth', formData.cultural_background?.country_of_birth || '');
  data.append('preferred_language', formData.cultural_background?.preferred_language || '');
  data.append('religion', formData.cultural_background?.religion || '');
  data.append('other_languages', formData.cultural_background?.other_languages || '');
  data.append('cultural_needs', formData.cultural_background?.cultural_needs || '');
  data.append('interpreter_required', String(formData.cultural_background?.interpreter_required ?? 0));
  data.append('auslan_required', String(formData.cultural_background?.auslan_required ?? 0));

  // NDIS Goals
  data.append('ndis_goals_onboarding', JSON.stringify(ndisGoals));

  // Health Professionals
  data.append('health_professional_details', JSON.stringify(healthProfessionals));

  // Diagnosis Summary
  data.append('primary_diagnosis', formData.diagnosis_summary?.primary_diagnosis || '');
  data.append('secondary_diagnosis', formData.diagnosis_summary?.secondary_diagnosis || '');

  // Health Information
  data.append('health_conditions', JSON.stringify(healthInformation.health_conditions || []));

  // Healthcare Support Details
  data.append('medicare', formData.healthcare_support_detail?.medicare || '');
  data.append('health_fund', formData.healthcare_support_detail?.health_fund || '');
  data.append('pension_card_number', formData.healthcare_support_detail?.pension_card_number || '');
  data.append('health_care_card', formData.healthcare_support_detail?.health_care_card || '');
  data.append('dva_type', formData.healthcare_support_detail?.dva_type || '');
  data.append('dva_number', formData.healthcare_support_detail?.dva_number || '');
  data.append('companion_card', formData.healthcare_support_detail?.companion_card || '');
  data.append('preferred_hospital', formData.healthcare_support_detail?.preferred_hospital || '');
  data.append('ambulance_number', formData.healthcare_support_detail?.ambulance_number || '');
  data.append('disabled_parking', formData.healthcare_support_detail?.disabled_parking || '');

  // Behaviour Support
  data.append('plan_copy_received', String(formData.behaviour_support?.plan_copy_received ?? 0));
  data.append('has_support_plan', String(formData.behaviour_support?.has_support_plan ?? 0));

  // Medical Alerts
  data.append('epilepsy', String(formData.medical_alert?.epilepsy ?? 0));
  data.append('asthma', String(formData.medical_alert?.asthma ?? 0));
  data.append('diabetes', String(formData.medical_alert?.diabetes ?? 0));
  data.append('allergies', formData.medical_alert?.allergies || '');
  data.append('medical_info', formData.medical_alert?.medical_info || '');
  data.append('diagnosis', formData.medical_alert?.diagnosis || '');
  data.append('other_description', formData.medical_alert?.other_description || '');
  data.append('medication_taken', formData.medical_alert?.medication_taken || '');
  data.append('medication_purpose', formData.medical_alert?.medication_purpose || '');
  data.append('staff_administer_medication', String(formData.medical_alert?.staff_administer_medication ?? 0));
  data.append('self_administered', String(formData.medical_alert?.self_administered ?? 0));
  data.append('guardian', String(formData.medical_alert?.guardian ?? 0));
  data.append('support_worker', String(formData.medical_alert?.support_worker ?? 0));

  // Preventive Health Summary
  data.append('medical_checkup_status', formData.preventive_health_summary?.medical_checkup_status || '');
  data.append('last_dental_check', formData.preventive_health_summary?.last_dental_check || '');
  data.append('last_hearing_check', formData.preventive_health_summary?.last_hearing_check || '');
  data.append('last_vision_check', formData.preventive_health_summary?.last_vision_check || '');
  data.append('requires_vaccination_assistance', String(formData.preventive_health_summary?.requires_vaccination_assistance ?? 0));
  data.append('communication_assistance_required', String(formData.support_information?.communication_assistance_required ?? 0));
  data.append('mealtime_plan', formData.support_information?.mealtime_plan || '');
  data.append('likes', formData.support_information?.likes || '');
  data.append('dislikes', formData.support_information?.dislikes || '');
  data.append('interests', formData.support_information?.interests || '');
  data.append('male', String(formData.support_information?.male ?? 0));
  data.append('female', String(formData.support_information?.female ?? 0));
  data.append('no_preference', String(formData.support_information?.no_preference ?? 0));
  data.append('special_request', formData.support_information?.special_request || '');

  return data;
};