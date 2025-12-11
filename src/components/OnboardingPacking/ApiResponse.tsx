export interface OnboardingResponse {
    form_status: string;
    submit_final: number;
    staff_id: number;
    uuid: string;
    completion_percentage?: number;
    client_name: string;
    service_agreement_provided: number;
    service_agreement_date: string;
    participant_handbook_provided: number;
    participant_handbook_date: string;
    support_care_plan_offered: number;
    support_care_plan_date: string;
    consent_form_signed: number;
    consent_form_date: string;
    feedback_form_provided: number;
    feedback_form_date: string;
    home_safety_check_conducted: number;
    home_safety_check_date: string;
    medication_consent_form: number;
    medication_consent_date: string;
    onboarding_form_completed: number;
    onboarding_form_date: string;
    risk_assessment_completed: number;
    risk_assessment_date: string;
    behaviour_support_plan_obtained: number;
    behaviour_support_plan_date: string;
    high_intensity_support_plan_obtained: number;
    high_intensity_support_plan_date: string;
    mealtime_plan_obtained: number;
    mealtime_plan_date: string;
    sil_occupancy_agreement_provided: number;
    sil_occupancy_agreement_date: string;
    external_provider_agreement_completed: number;
    external_provider_agreement_date: string;
    sda_residency_agreement_provided: number;
    sda_residency_agreement_date: string;
    sda_welcome_pack_provided: number;
    sda_welcome_pack_date: string;
    sda_residency_statement_provided: number;
    sda_residency_statement_date: string;
    disability_act_discussion?: DisabilityActDiscussionsResponse;
    participant_declaration?: ParticipantDeclaration;
}

export interface DisabilityActDiscussionsResponse {
  id?: number;
  uuid?: string;
  clarify_services_provided: number;
  verbal_information_intake_process: number;
  cost_of_services: number;
  participant_rights_handbook: number;
  created_at?: string;
  updated_at?: string;
  completion_percentage?: number;
}

export interface ParticipantDeclaration {
  participant_name?: string;
  relationship_to_participant?: string;
  participant_signature?: string; // Can be binary data URL or base64 string
  signed_date?: string;
}