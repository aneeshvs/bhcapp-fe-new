import { OnboardingResponse } from "@/src/components/OnboardingPacking/ApiResponse";

export function mapApiResponseToFormData(responseData: OnboardingResponse) {
  return {
    form_status: responseData.form_status || '',
    submit_final: responseData.submit_final ?? 0,
    service_agreement_provided: responseData.service_agreement_provided || 0,
    service_agreement_date: responseData.service_agreement_date || "",
    participant_handbook_provided: responseData.participant_handbook_provided || 0,
    participant_handbook_date: responseData.participant_handbook_date || "",
    support_care_plan_offered: responseData.support_care_plan_offered || 0,
    support_care_plan_date: responseData.support_care_plan_date || "",
    consent_form_signed: responseData.consent_form_signed || 0,
    consent_form_date: responseData.consent_form_date || "",
    feedback_form_provided: responseData.feedback_form_provided || 0,
    feedback_form_date: responseData.feedback_form_date || "",
    home_safety_check_conducted: responseData.home_safety_check_conducted || 0,
    home_safety_check_date: responseData.home_safety_check_date || "",
    medication_consent_form: responseData.medication_consent_form || 0,
    medication_consent_date: responseData.medication_consent_date || "",
    onboarding_form_completed: responseData.onboarding_form_completed || 0,
    onboarding_form_date: responseData.onboarding_form_date || "",
    risk_assessment_completed: responseData.risk_assessment_completed || 0,
    risk_assessment_date: responseData.risk_assessment_date || "",
    behaviour_support_plan_obtained: responseData.behaviour_support_plan_obtained || 0,
    behaviour_support_plan_date: responseData.behaviour_support_plan_date || "",
    high_intensity_support_plan_obtained: responseData.high_intensity_support_plan_obtained || 0,
    high_intensity_support_plan_date: responseData.high_intensity_support_plan_date || "",
    mealtime_plan_obtained: responseData.mealtime_plan_obtained || 0,
    mealtime_plan_date: responseData.mealtime_plan_date || "",
    sil_occupancy_agreement_provided: responseData.sil_occupancy_agreement_provided || 0,
    sil_occupancy_agreement_date: responseData.sil_occupancy_agreement_date || "",
    external_provider_agreement_completed: responseData.external_provider_agreement_completed || 0,
    external_provider_agreement_date: responseData.external_provider_agreement_date || "",
    sda_residency_agreement_provided: responseData.sda_residency_agreement_provided || 0,
    sda_residency_agreement_date: responseData.sda_residency_agreement_date || "",
    sda_welcome_pack_provided: responseData.sda_welcome_pack_provided || 0,
    sda_welcome_pack_date: responseData.sda_welcome_pack_date || "",
    sda_residency_statement_provided: responseData.sda_residency_statement_provided || 0,
    sda_residency_statement_date: responseData.sda_residency_statement_date || "",









    clarify_services_provided:
      responseData.disability_act_discussion?.clarify_services_provided ?? 0,
    verbal_information_intake_process:
      responseData.disability_act_discussion?.verbal_information_intake_process ?? 0,
    cost_of_services:
      responseData.disability_act_discussion?.cost_of_services ?? 0,
    participant_rights_handbook:
      responseData.disability_act_discussion?.participant_rights_handbook ?? 0,



    participant_name: responseData.participant_declaration?.participant_name || "",
    relationship_to_participant:
      responseData.participant_declaration?.relationship_to_participant || "",
    participant_signature:
      responseData.participant_declaration?.participant_signature || "",
    signed_date: responseData.participant_declaration?.signed_date || "",
  };
}