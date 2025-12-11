export interface SupportCarePlan {
  consents_participant_first_name?: string;
  consents_participant_surname?: string;
  consents_participant_dob?: string;
  consents_goal_plan_start_date?: string;
  consents_goal_plan_review_date?: string;
}

interface SupportSuccess {
  success: true;
  data: {
    supportCarePlan: {
      uuid: string;
      id: number;
    };
  };
}

interface SupportError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}

export interface AlternativeDecisionMakerFormData {
  type: string;
  first_name: string;
  surname: string;
  notes: string;
}


export interface SilGoal {
  category?: string;
  goal_key?: string;
  goal_title?: string;
  goals_of_support?: string;
  steps?: string;
  organisation_steps?: string;
  risk?: string;
  risk_management_strategies?: string;
}

export interface CommunicationPlan {
  helps_me_talk?: string[] | string;
  helps_me_understand?: string[] | string;
  please_communicate_by?: string[] | string;
  emergency_communication?: string[] | string;

}

export interface Emergency{
  participant_name?: string;
  date?: string;
  review_date?: string;
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

export type SupportResponse = SupportSuccess | SupportError;


