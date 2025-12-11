
export interface CarePlanResponse {
    form_status: string;
    submit_final: number;
    staff_id: number;
    uuid: string;
    completion_percentage?: number;
    consents_participant_first_name?: string;
    consents_participant_surname?: string;
    consents_participant_dob?: string;
    consents_goal_plan_start_date?: string;
    consents_goal_plan_review_date?: string;
    alternate_decision_maker?: AlternativeDecisionMake
    sil_goals?: SilGoals[];
    homecare_goals?: HomeCares[];
    support_coordination_goals?: SupportCoordination[];
    communication_plans?: CommunicationPlan[];
    emergency_disaster_plan?: Emergency;
    emergency_contacts?: EmergencyContact[];
    important_contacts?: ImportantContactsFormData;
    local_services_contact?: LocalServiceContact;
    emergency_scenario?: SupportPlanEmergencyScenarios;
}

interface AlternativeDecisionMake{
    type: string;
    first_name: string;
    surname: string;
    notes: string;

}

export interface SilGoals {
  category?: string,
  goal_key?: string,
  goal_title?: string;
  goals_of_support?: string;
  steps?: string;
  organisation_steps?: string;
  risk?: string;
  risk_management_strategies?: string;
}

export interface HomeCares {
  category?: string,
  goal_key?: string,
  goal_title?: string;
  goals_of_support?: string;
  steps?: string;
  organisation_steps?: string;
  risk?: string;
  risk_management_strategies?: string;
}

export interface SupportCoordination {
  category?: string,
  goal_key?: string,
  goal_title?: string;
  goals_of_support?: string;
  steps?: string;
  organisation_steps?: string;
  risk?: string;
  risk_management_strategies?: string;
}

export interface CommunicationPlan {
  id?: number;
  support_care_plan_id?: number;
  status_id?: number;
  helps_me_talk?: string[];
  helps_me_understand?: string[];
  please_communicate_by?: string[];
  emergency_communication?: string | null;
}

export interface Emergency{
  participant_name?: string;
  date?: string;
  review_date?: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  location?: string;
  goal_key?: string;
}

export interface ImportantContactsFormData {
  advocate: string;
  childcare_school_contact: string;
  power_of_attorney_guardian: string;
  workplace_volunteer_contact: string;
  landlord_sda_provider: string;
  doctor: string;
  specialist_practitioner: string;
  solicitor: string;
  insurer_home_contents: string;
  private_health_cover: string;
  insurer_vehicle: string;
}

export interface LocalServiceContact{
  council?: string;
  hospital?: string;
  electricity?: string;
  water?: string;
}

export interface SupportPlanEmergencyScenarios{
  admitted_to_hospital?: number;
  admitted_to_hospital_action?: string;
  medical_emergencies?: number;
  medical_emergencies_action?: string;
  other_likely_medical_emergency?: number;
  other_likely_medical_emergency_action?: string;
  natural_disaster?: number;
  natural_disaster_action?: string;
}



