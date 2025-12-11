export interface RiskAssessmentResponse {
  form_status: string;
  submit_final: number;
  staff_id: number;
  uuid: string;
  completion_percentage: number;
  participant_name: string;
  client_name: string;
  site_address: string;
  assessment_date: string;
  planned_review_date: string;
  details: AssessmentDetailsFormData;
  communications: AssessmentCommunicationsFormData;
  cognitions?: AssessmentCognitionsFormData;
  mobilities?: AssessmentMobilitiesFormData;
  personal_care_support?: AssessmentPersonalCareFormData;
  manual_handlings?: PlanManualHandlingsFormData[];
  violence_risk?: AssessmentViolenceRisksFormData;
}

export interface AssessmentDetailsFormData {
  vulnerability?: string;
  review_frequency?: string
  dependent_on_homecare?: number; // 0 or 1 for boolean
}

export interface AssessmentCommunicationsFormData {
  hearing_impairment?: number; // 0 or 1 for boolean
  hearing_hazards?: string;
  hearing_management_plan?: string;
  speech_impairment?: number; // 0 or 1 for boolean
  speech_hazards?: string;
  speech_management_plan?: string;
}


export interface AssessmentCognitionsFormData {
  oriented_in_time_place?: number; // 0 or 1 for boolean
  oriented_hazards?: string;
  oriented_management_plan?: string;
  accepts_direction?: number; // 0 or 1 for boolean
  direction_hazards?: string;
  direction_management_plan?: string;
  short_term_memory_issues?: number; // 0 or 1 for boolean
  memory_hazards?: string;
  memory_management_plan?: string;
}

export interface AssessmentMobilitiesFormData {
  // Walking and mobility
  walk_unaided?: number;
  accessibility_required?: number;
  walk_hazards?: string;
  walk_management_plan?: string;

  manages_stairs?: number;
  stairs_hazards?: string;
  stairs_management_plan?: string;

  uses_walking_aid?: number;
  walking_aid_hazards?: string;
  walking_aid_management_plan?: string;

  uses_wheelchair?: number;
  wheelchair_hazards?: string;
  wheelchair_management_plan?: string;

  // Transfers
  bed_transfer?: number;
  bed_transfer_hazards?: string;
  bed_transfer_management_plan?: string;

  vehicle_transfer?: number;
  vehicle_transfer_hazards?: string;
  vehicle_transfer_management_plan?: string;

  toilet_transfer?: number;
  toilet_transfer_hazards?: string;
  toilet_transfer_management_plan?: string;
}


export interface AssessmentPersonalCareFormData {
  // Personal care fields
  showering?: number;
  showering_hazards?: string;
  showering_management_plan?: string;

  meal?: number;
  meal_hazards?: string;
  meal_management_plan?: string;

  toileting?: number;
  toileting_hazards?: string;
  toileting_management_plan?: string;

  grooming?: number;
  grooming_hazards?: string;
  grooming_management_plan?: string;

  repositioning_bed?: number;
  repositioning_bed_hazards?: string;
  repositioning_bed_management_plan?: string;

  repositioning_chair?: number;
  repositioning_chair_hazards?: string;
  repositioning_chair_management_plan?: string;

  mouthcare?: number;
  mouthcare_hazards?: string;
  mouthcare_management_plan?: string;

  skin_care?: number;
  skin_care_hazards?: string;
  skin_care_management_plan?: string;
}

export interface PlanManualHandlingsFormData {
  // Manual handling fields
  goal_key: string;
  training_provided?: number;
  training_hazards?: string;
  training_management_plan?: string;

  tasks_safe?: number;
  tasks_hazards?: string;
  tasks_management_plan?: string;
}

export interface AssessmentViolenceRisksFormData {
  // Physical Aggression
  physical_aggression?: number;
  physical_hazards?: string;
  physical_management_plan?: string;
  physical_bsp_plan?: number;

  // Verbal Aggression
  verbal_aggression?: string;
  verbal_aggression_notes?: string;
  verbal_hazards?: string;
  verbal_management_plan?: string;
  verbal_bsp_plan?: number;
  

  // Client Aggression
  client_aggression?: number;
  client_hazards?: string;
  client_management_plan?: string;
  client_bsp_plan?: number;

  // Self Harm
  self_harm?: number;
  self_harm_hazards?: string;
  self_harm_management_plan?: string;
  self_harm_bsp_plan?: number;

  // Drug & Alcohol Use
  drug_alcohol_use?: number;
  drug_alcohol_hazards?: string;
  drug_alcohol_management_plan?: string;
  drug_alcohol_bsp_plan?: number;

  // Sexual Abuse History
  sexual_abuse_history?: number;
  sexual_abuse_hazards?: string;
  sexual_abuse_management_plan?: string;
  sexual_abuse_bsp_plan?: number;

  // Emotional Manipulation
  emotional_manipulation?: number;
  emotional_hazards?: string;
  emotional_management_plan?: string;
  emotional_bsp_plan?: number;

  // Other Known Risks
  other_known_risks?: number;
  other_risks_hazards?: string;
  other_risks_management_plan?: string;
  other_risks_bsp_plan?: number;

  // Finance Management
  finance_management?: string;
  finance_management_notes?: string;
  finance_hazards?: string;
  finance_management_plan?: string;
  finance_bsp_plan?: number;
}