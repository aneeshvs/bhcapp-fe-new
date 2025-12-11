export interface ClientFormResponse {
  id: number;
  prospect_uuid: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  residential_address: string;
  contact_type: string | null;
  mobile: string;
  home_phone: string;
  work_phone: string;
  email: string | null;
  atsi_status: string;
  cultural_background: string | null;
  language_spoken: string | null;
  interpreter_required: boolean;
  guardian_name: string | null;
  is_public_guardian: string | null;
  guardian_relationship: string | null;
  guardian_mobile: string | null;
  guardian_email: string | null;
  guardian_address: string | null;
  guardian_contact_method: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
  uuid: string;
  password: string;
  form_status: string;

  referrals: Referral[];
  accommodations: Accommodation[];
  selected_services: ServiceRequired[];
  previous_service_providers: ServiceProvider[];
  client_ndis_detail: ClientNDISDetail;
  medical_information: MedicalInformation;
  housing_history: HousingHistory;
  roster_of_care: RosterOfCare;
  ndis_goals: NDISGoal[];
  independent_living_option: IndependentLivingOption;
  final_declaration: FinalDeclaration;
}


export interface ServiceProvider {
  provider: string;
  contact_details: string;
  length_of_support: string;
  reason_for_leaving: string;
  uuid?: string;
}

export interface ServiceRequired {
  service_name: string;
}
export interface Referral {
  id: number;
  client_id: number;
  has_consent: number;
  agency: string | null;
  contact_name: string | null;
  job_title: string | null;
  work_contact: string | null;
  referral_mobile: string | null;
  referral_email: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface Accommodation {
  id: number;
  client_id: number;
  type_of_accommodation: string;
  requested_support: string;
  worker_preference: string;
  date_of_referral: string;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface ClientNDISDetail {
  id: number;
  client_id: number;
  ndis_plan_approved: string | null;
  ndis_number: string | null;
  ndis_plan_start_date: string | null;
  ndis_plan_end_date: string | null;
  plan_manager_name: string | null;
  plan_manager_contact_mobile: string | null;
  plan_manager_contact_email: string | null;
  plan_type: string | null;
  copy_of_plan_provided: string | null;
  reason_plan_not_provided: string | null;
  engagement_concerns: string | null;
  engagement_concerns_description: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface MedicalInformation {
  id: number;
  client_id: number;
  primary_disability: string | null;
  secondary_disability: string | null;
  requires_high_intensity_support: number;
  complex_bowel_care: number;
  enteral_feeding: number;
  tracheostomy_care: number;
  urinary_catheters: number;
  ventilation: number;
  subcutaneous_injection: number;
  communication_method: string | null;
  communication_assessment: string | null;
  occupational_therapy_assessment: string | null;
  hoisting: number;
  assisted_devices: number;
  mobility_other: string | null;
  hospital_bed: number;
  pressure_mattresses: number;
  equipment_other: string | null;
  challenging_behaviours: string | null;
  pbsp_attached: number;
  pbsp_required: number;
  pbsp_review_requested: number;
  behaviour_support_practitioner_contact: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface HousingHistory {
  id: number;
  client_id: number;
  most_recent_housing: string | null;
  prior_housing: string | null;
  mental_health_service: number;
  aboriginal_service: number;
  communities_and_justice: number;
  family_violence: number;
  correctional_service: number;
  child_protection: number;
  drug_alcohol_rehabilitation: number;
  other_services_involved: number;
  other_services_description: string | null;
  services_background_info: string | null;
  services_contact_details: string | null;
  issue_mental_health: number;
  issue_drug_alcohol: number;
  issue_family_violence: number;
  issue_police_involvement: number;
  issue_child_protection: number;
  issue_child_custody: number;
  issue_other_description: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface RosterOfCare {
  id: number;
  client_id: number;
  need_bhc_community_support: number;
  comments: string | null;
  transport_funding: string;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface NDISGoal {
  id: number;
  client_id: number;
  goal: string;
  barriers: string;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface IndependentLivingOption {
  id: number;
  client_id: number;
  rent_per_week: string;
  utilities_per_week: string;
  needs_furnished: number;
  owns_furniture: number;
  lease_duration: string | null;
  can_pay_bond_upfront: number;
  preferred_location: string | null;
  living_preference: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  uuid: string;
}

export interface FinalDeclaration {
  referrer_date?: string;
  referrer_name?: string;
  referrer_signature?: string;
  referrer_organisation?: string;
  client_date?: string;
  client_name?: string;
  client_signature?: string;
  guardian_date?: string;
  declaration_guardian_name?: string;
  guardian_signature?: string;
}
