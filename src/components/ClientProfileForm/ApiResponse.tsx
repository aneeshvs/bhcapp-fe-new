export interface ClientApiResponse {
  staff_id: number;
  full_name: string | null;
  preferred_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  postcode: string | null;
  phone_number: string | null;
  mobile_number: string | null;
  email: string | null;
  form_status: string;
  need_support_person: number;
  support_person_details: string | null;
  completion_percentage?: number;
  funding: Funding;
  emergency_contact: EmergencyContact;
  cultural_background: CulturalBackground;
  diagnosis_summary: DiagnosisSummary;
  health_information: HealthInformation;
  healthcare_support_detail: HealthcareSupport;
  behaviour_support: BehaviourSupport;
  medical_alert: MedicalAlert;
  preventive_health_summary: PreventiveHealthSummary;
  support_information: SupportInformation;

  schedule_of_cares: ScheduleOfCare[];
  ndis_goals: NDISGoal[];
  health_professional_details: HealthProfessional[];

  staff: Staff;
}



export interface Funding {
    type_of_funding?: string;
    funding_contact_person?: string;
    ndis_plan_attached?: number;
    ndis_plan_start_date?: string;
    ndis_plan_end_date?: string;
    plan_manager_name?: string;
    plan_manager_phone?: string;
    plan_manager_email?: string;
}

export interface ScheduleOfCare {
  type_of_service: string;
  primary_task_list: string;
  secondary_task_list: string;
  goal_key: string; // Add goal_key to track submitted entries
}

export interface NDISGoal {
    goal_description: string;
    goal_key?: string;
}

export interface HealthProfessional {
  role: string;
  name: string;
  contact_number: string;
}

export interface EmergencyContact {
    name: string | null;
    relationship: string | null;
    phone: string | null;
    mobile: string | null;
    work_contact: string | null;
}

export interface CulturalBackground {
    country_of_birth: string | null;
    preferred_language: string | null;
    religion: string | null;
    other_languages: string | null;
    cultural_needs: string | null;
    interpreter_required: number | null;
    auslan_required: number | null;
    has_children_under_18: number | null;
}

export interface DiagnosisSummary {
    primary_diagnosis: string | null;
    secondary_diagnosis: string | null;
}

export interface HealthInformation {
    health_conditions: string[] | string;
}

export interface HealthcareSupport {
    medicare: string | null;
    health_fund: string | null;
    pension_card_number: string | null;
    health_care_card: string | null;
    dva_type: string | null;
    dva_number: string | null;
    companion_card: string | null;
    preferred_hospital: string | null;
    ambulance_number: string | null;
    disabled_parking: string | null;
}

export interface BehaviourSupport {
    has_support_plan: number | null;
    plan_copy_received: number | null;
}

export interface MedicalAlert {
    epilepsy: number | null;
    asthma: number | null;
    diabetes: number | null;
    allergies: string | null;
    medical_info: string | null;
    diagnosis: string | null;
    other_description: string | null;
    medication_taken: string | null;
    medication_purpose: string | null;
    staff_administer_medication: number | null;
    self_administered: number | null;
    guardian: number | null;
    support_worker: number | null;
}

export interface PreventiveHealthSummary {
    medical_checkup_status: string | null;
    last_dental_check: string | null;
    last_hearing_check: string | null;
    last_vision_check: string | null;
    requires_vaccination_assistance: number | null;
    communication_assistance_required: number | null;
    mealtime_plan: string | null;
    likes: string | null;
    dislikes: string | null;
    interests: string | null;
    male: number | null;
    female: number | null;
    no_preference: number | null;
    special_request: string | null;
}
export interface SupportInformation {
    communication_assistance_required?: number; // 1 = Yes, 0 = No
    mealtime_plan?: string;
    likes?: string;
    dislikes?: string;
    interests?: string;
    male?: number;
    female?: number; // e.g., ['Male', 'Female']
    no_preference?: number;
    special_request?: string;
}


export interface Staff {
  id: number;
  user_id: number;
  stafftype: number;
  name: string;
  email: string;
  phone: string;
  username: string | null;
  status_id: number;
  owner_id: number | null;
  owner_type: string | null;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
  uuid: string;
}