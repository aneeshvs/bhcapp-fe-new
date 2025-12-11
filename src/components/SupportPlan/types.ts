export interface SupportPlan {
  effective_date: string | null;
  review_date: string | null;
  confirmation_date: string | null;
  developed_by: string | null;
  invited_but_not_participated: string | null;
  form_status: string | null;
  submit_final: number | 0;
}

export interface KeepInTouch {
  need_help_to_communicate: number;
  type_of_difficulty: string;
  contact_first_instance?: number | null;
  details?: string | null;
  language_spoken?: string | null;
  use_nrs?: number | null;
  require_interpreter?: number | null;
  written?: string | null;
  verbal?: string | null;
  schedule_change_notification?: string | null;
  interpreter_arrangement?: string | null;
  financial_statement_method?: string | null;
  feedback_survey_method?: string | null;
  marketing_material_method?: string | null;
  preferred_communication_method?: string | null;
  join_cab?: number | null;

}

export interface NonResponsive {
  telephone_home_or_mobile?: number | null;
  telephone_details?: string | null;

  contact_emergency_contact?: number | null;
  emergency_contact_details?: string | null;

  access_spare_key?: number | null;
  enter_home_with_spare_key?: number | null;
  spare_key_details?: string | null;

  contact_other_persons?: number | null;
  other_persons_details?: string | null;

  contact_police_if_no_key?: number | null;
  police_contact_details?: string | null;

  
  access_key_lock?: number | null;
  key_lock_code?: string | null;
  key_lock_details?: string | null;

}

export interface Participant {
  first_name?: string | null;
  surname?: string | null;
  preferred_name: string | null;
  date_of_birth: string | null;
  country_of_birth: string | null;
  identify_as_aboriginal_or_torres_strait: number | 0,
  gender: string | null;
}

export interface SupportContactDetails {
  phone?: string | null;
  address?: string | null;
  is_rural_area?: number | null;
  mailing_address?: string | null;
  email?: string | null;
}

export interface SecondaryContactDetails {
  secondary_role?: string | null;
  secondary_phone?: string | null;
  secondary_email?: string | null;
  secondary_address?: string | null;
  secondary_best_time_to_contact?: string | null;
  secondary_is_mac_registered?: number | null;
  secondary_list_documents?: string | null;
  secondary_legal_documentation_stored?: number | null;
  secondary_date_legal_orders_end: string | null;
  secondary_participants_agreed_contact?: number | null;
  secondary_participants_agreed_contact_date: string | null;
  secondary_decision_making_approval_for?: string | null;
}


export interface SupportPlanFundings {
  aged_care_id?: string | null;
  pension_status?: string | null;
  pension_card_details?: string | null;
  card_number?: string | null;
  card_expiry: string | null; // Date string in ISO format
  approved_funding_level?: string | null;
  awaiting_package_upgrade?: number | null; // 1 = true, 0 = false
  upgrade_details?: string | null;
  has_chsp_referral_codes?: number | null; // 1 = true, 0 = false
  chsp_referral_details?: string | null;
  war_veteran_or_widow?: number | null; // 1 = true, 0 = false
  dva_number?: string | null;
  medicare_number?: string | null;
  private_health_insurance?: string | null;
  hcp_funding_level?: string | null;
  has_companion_card?: number | null; // 1 = true, 0 = false
}



interface SupportPlanSuccess {
  success: true;
  data: {
    supportPlan: {
      uuid: string;
      id: number;
    };
  };
}

interface SupportPlanError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}


export interface SupportPlanService {
  name: string;
  service_provided: string;
  funded_by: string;
  duration_frequency: string;
  support_to_implement_by_us: number;
  goal_key?: string; 
}

export interface EmployeeMatchingNeeds {
  cultural_considerations: string;
  specific_training_required: string;
  common_interests: string;
}

export interface SupportPlanMyGoal {
  goal: string;
  measure_progress: string;
  success_look_like: string;
  who_will_support: string;
  participant_support: string;
  target_date: string;
  goal_key?: string;
}
export interface SupportPlanLivingArrangements {
  reside_in: string;
  reside_with: string;
  home_safety_assessment_date: string;
  is_home_suitable: number; // 1 = Yes, 0 = No
  home_suitable_details: string;
  at_risk_of_homelessness: number; // 1 = Yes, 0 = No
  homelessness_details: string;
}

export interface CulturalDiversities {
  is_lgbti: number; // 1 = Yes, 0 = No
  lgbti_details: string;
  is_separated_family: number; // 1 = Yes, 0 = No
  separated_family_details: string;
  has_cultural_events: number; // 1 = Yes, 0 = No
  cultural_events_details: string;
  has_past_events: number; // 1 = Yes, 0 = No
  past_events_details: string;
  has_non_disclosure_items: number; // 1 = Yes, 0 = No
  non_disclosure_details: string;
}
export interface SupportPlanGeneralHealth {
  gp_visit_frequency?: string | null;
  admitted_hospital_last12months?: number | null;
  admitted_hospital_details?: string | null;
  preferred_hospital?: number | null;
  preferred_hospital_details?: string | null;
  diagnosis_medication_conditions?: string | null;
  previous_surgeries?: string | null;
  has_allergies?: number | null;
  allergy_details?: string | null;
  health_impact_scale?: number | null;
  painful_day_to_day?: number | null;
  painful_day_to_day_details?: string | null;
  weight_loss_last3months?: number | null;
  weight_loss_details?: string | null;
  nutritional_concerns?: number | null;
  nutritional_concerns_details?: string | null;
  current_weight?: string | null;
  annual_vaccinations?: number | null;
  annual_vaccination_details?: string | null;
  last_influenza_vaccine: string | null;
  last_covid19_vaccine: string | null;
  last_pneumonia_vaccine: string | null;
  sleep_difficulties?: number | null;
  sleep_difficulties_details?: string | null;
  sleep_routine?: string | null;
  sleep_routine_worries?: number | null;
  sleep_routine_worries_details?: string | null;
  alcohol_smoke_drug_use?: number | null;
  alcohol_smoke_drug_details?: string | null;
  alcohol_smoke_drug_worries?: number | null;
  alcohol_smoke_drug_worries_details?: string | null;
  referral_required?: number | null;
  referral_required_details?: string | null;
}

export interface SupportPlanMedicationManagement {
  takes_regular_medications?: number | null;
  medication_details?: string | null;
  medication_form?: string | null;
  medication_packaging?: string | null;
  medications_locked?: number | null;
  medications_locked_details?: string | null;
  specific_storage_requirements?: string | null;
  scheduled_4_or_8_medications?: number | null;
  scheduled_medications_details?: string | null;
  chemical_restraint_medications?: number | null;
  takes_more_than_prescribed?: number | null;
  takes_more_than_prescribed_details?: string | null;
  at_risk_of_missing_medication?: number | null;
  missing_medication_details?: string | null;
  able_to_explain_purpose?: number | null;
  last_medication_review_date: string | null;
  medication_collection_delivery_details?: string | null;
  needs_support_with_medication?: number | null;
  support_with_medication_details?: string | null;
  medication_management_worries?: number | null;
  medication_management_worries_details?: string | null;
  medication_service_required?: number | null;
  support_worker_prompt?: number | null;
}

export interface SupportPlanMobilityTransfers {
  can_walk_independently?: number | null;
  walk_independently_details?: string | null;
  needs_transfer_support?: number | null;
  primary_equipment_used?: string | null;
  can_climb_stairs?: number | null;
  climb_stairs_details?: string | null;
  has_stairs_at_home?: number | null;
  stairs_at_home_details?: string | null;
  can_transfer_self?: number | null;
  can_transfer_in_other_envs?: number | null;
  uses_bed_pole_or_rails?: number | null;
  bed_pole_prescribed_by_ot?: number | null;
  can_access_places_outside_walking_distance?: number | null;
  access_places_details?: string | null;
  safe_to_mobilise_in_yard?: number | null;
  mobilise_yard_details?: string | null;
  community_access?: string | null;
  drives?: number | null;
  medications_or_conditions_risk?: number | null;
  driving_risk_details?: string | null;
  mobility_equipment?: string | null;
  equipment_purchase_type?: string | null;
  uses_four_wheel_walker?: number | null;
  four_wheel_walker_details?: string | null;
  wheelchair_type?: string | null;
  wheelchair_operation?: string | null;
  wheelchair_ot_recommended?: number | null;
  can_charge_wheelchair?: number | null;
  last_wheelchair_service_date: string | null;
  can_carry_5kg?: number | null;
  carry_5kg_details?: string | null;
  foot_problems?: number | null;
  foot_problems_details?: string | null;
  mobility_worries?: number | null;
  mobility_worries_details?: string | null;
  last_ot_assessment_date: string | null;
  new_ot_referral_required?: number | null;
  demmi_assessment_required?: number | null;
  demmi_assessment_result?: string | null;
}

export interface SupportPlanFallsRisks {
  recent_falls?: number | null;
  recent_falls_details?: string | null;
  strategies_to_reduce_risk?: number | null;
  strategies_details?: string | null;
  has_safety_pendant?: number | null;
  safety_pendant_details?: string | null;
  worried_about_falling?: number | null;
  worried_details?: string | null;
  referral_falls_clinic?: number | null;
  referral_falls_clinic_details?: string | null;
  referral_ot?: number | null;
  fallrisk_referral_ot_details?: string | null;
  referral_physio?: number | null;
  referral_physio_details?: string | null;
}


export interface SupportPlanCognitions {
  cognitive_concerns?: number | null;
  cognitive_concerns_details?: string | null;
  diagnosis_dementia?: number | null;
  diagnosis_dementia_details?: string | null;
  capable_of_decisions?: number | null;
  capable_of_decisions_details?: string | null;
  has_power_of_attorney?: number | null;
  power_of_attorney_details?: string | null;
  becomes_confused?: number | null;
  becomes_confused_details?: string | null;
  experienced_delirium?: number | null;
  experienced_delirium_details?: string | null;
  anxious_or_worry?: number | null;
  anxious_or_worry_details?: string | null;
  short_term_memory_loss?: number | null;
  short_term_memory_loss_details?: string | null;
  long_term_memory_loss?: number | null;
  long_term_memory_loss_details?: string | null;
  atsi_kica_cog_required?: number | null;
  atsi_kica_cog_file?: string | null;
  atsi_kica_carer_required?: number | null;
  atsi_kica_carer_file?: string | null;
  gpcog_required?: number | null;
  gpcog_file?: string | null;
  health_literacy_support?: number | null;
  health_literacy_support_details?: string | null;
  gds_required?: number | null;
  gds_file?: string | null;
  referral_geriatrician?: number | null;
  referral_geriatrician_details?: string | null;
  referral_psychologist?: number | null;
  referral_psychologist_details?: string | null;
  referral_psychiatrist?: number | null;
  referral_psychiatrist_details?: string | null;
}

export interface SupportPlanBehaviourSupports {
  feeling_agitation?: number | null;
  feeling_agitation_details?: string | null;
  delusions_hallucinations?: number | null;
  delusions_hallucinations_details?: string | null;
  personality_changes?: number | null;
  personality_changes_details?: string | null;
  wandering_purpose?: number | null;
  wandering_purpose_details?: string | null;
  absconding_concerns?: number | null;
  absconding_concerns_details?: string | null;
  verbal_threats?: number | null;
  verbal_threats_details?: string | null;
  physical_assault?: number | null;
  physical_assault_details?: string | null;
  restrictive_interventions?: number | null;
  restrictive_interventions_details?: string | null;
  restrictive_physical?: number | null;
  restrictive_approved_by_practitioner?: number | null;
  restrictive_practitioner_details?: string | null;
  current_strategies?: string | null;
  referral_positive_behaviour_practitioner?: number | null;
  referral_positive_behaviour_practitioner_details?: string | null;
  behaviour_support_plan_required?: number | null;
  behaviour_support_plan_expiry: string | null;
}

export interface SupportPlanPersonalCares {
  support_daily_personal_care?: number | null;
  daily_personal_care_details?: string | null;
  support_showering?: number | null;
  showering_type?: string | null;
  showering_details?: string | null;
  personal_care_routine?: string | null;
  support_dressing?: number | null;
  dressing_details?: string | null;
  dressing_routine?: string | null;
  equipment_in_bathroom?: number | null;
  equipment_details?: string | null;
  support_shaving?: number | null;
  shaving_details?: string | null;
  support_haircuts?: number | null;
  haircuts_details?: string | null;
  task_at_home?: number | null;
  wears_dentures?: number | null;
  dentures_details?: string | null;
  support_teeth_brushing?: number | null;
  teeth_brushing_details?: string | null;
  ot_bathroom_assessment?: number | null;
  ot_assessment_type?: string | null;
  ot_assessment_details?: string | null;
  referral_ot_required?: number | null;
  plancare_referral_ot_details?: string | null;
}


export interface SupportPlanContinences {
  identified_needs?: number | null;
  identified_needs_details?: string | null;

  identify_toilet_needs?: number | null;
  identify_toilet_needs_details?: string | null;

  require_prompting?: number | null;
  require_prompting_details?: string | null;

  wears_continence_aids?: number | null;
  continence_aids_details?: string | null;

  ruis_required?: number | null;
  ruis_details?: string | null;

  rfis_required?: number | null;
  rfis_details?: string | null;

  funding_for_products?: number | null;
  funding_for_products_details?: string | null;

  nurse_assessment?: number | null;
  nurse_assessment_details?: string | null;

  worry_about_continence?: number | null;
  worry_about_continence_details?: string | null;
}
export interface SupportPlanVisions {
  wears_glasses_or_contacts?: number | null;
  glasses_or_contacts_type?: string | null;
  vision_when_worn?: string | null;
  last_optometrist_appointment: string | null;
  vision_worry?: number | null;
  vision_worry_details?: string | null;
}

export interface SupportPlanHearings {
  wears_hearing_devices?: number | null;
  hearing_devices_details?: string | null;
  when_worn?: string | null;
  last_audiologist_appointment?: string | null;
  hearing_worry?: number | null;
  hearing_worry_details?: string | null;
}


export interface SupportPlanSkinConditions {
  has_skin_condition?: number | null;
  skin_condition_type?: string | null;
  impacts_daily_activities?: number | null;
  impact_date: string | null;
  pain_discomfort_level?: string | null;
  pain_level_score?: number | null;
  management_strategies?: string | null;
  skin_condition_worry?: number | null;
  worry_date: string | null;
  referral_nursing_required?: number | null;
  referral_nursing_date: string | null;
}

export interface SupportPlanDietaries {
  intolerances?: number | null;
  intolerances_details?: string | null;
  dysphagia_concerns?: number | null;
  dysphagia_details?: string | null;
  speech_pathologist_recommendations?: number | null;
  iddsi_food_category?: string | null;
  iddsi_liquid_category?: string | null;
  prepares_meals?: number | null;
  prepares_meals_details?: string | null;
  needs_meal_support?: number | null;
  meal_support_details?: string | null;
  diet_meets_needs?: number | null;
  diet_meets_needs_details?: string | null;
  needs_cutting_support?: number | null;
  cutting_support_details?: string | null;
  needs_feeding_support?: number | null;
  feeding_support_details?: string | null;
  dietician_referral_required?: number | null;
  dietician_referral_details?: string | null;
  needs_shopping_support?: number | null;
  shopping_support_details?: string | null;
}

export interface SupportPlanPain {
  ongoing_pain?: number | null;
  pain_details?: string | null;
  pain_location?: string | null;
  pain_frequency?: string | null;
  pain_scale?: number | null;
  supported_for_pain?: number | null;
  supported_pain_details?: string | null;
  pain_management_strategies?: string | null;
  abbey_pain_scale_required?: number | null;
  pain_worry?: number | null;
  pain_worry_details?: string | null;
}

export interface SupportPlanHomeMaintenances {
  needs_domestic_assistance?: number | null;
  domestic_assistance_type?: string | null;
  domestic_assistance_details?: string | null;
  needs_help_with_cleaning_products?: number | null;
  cleaning_products_details?: string | null;
  needs_garden_support?: number | null;
  garden_support_details?: string | null;
  trouble_navigating_at_night?: number | null;
  navigating_at_night_details?: string | null;
  home_maintenance_worries?: number | null;
  home_maintenance_worries_details?: string | null;
  last_home_safety_assessment: string | null;
  home_safety_focus_areas?: string | null;
}

export interface SupportPlanSocialConnections {
  feels_lonely?: number | null;
  feels_lonely_details?: string | null;

  has_informal_supports?: number | null;
  informal_supports_details?: string | null;

  wants_more_community_engagement?: number | null;
  community_engagement_details?: string | null;

  wants_support_for_community_engagement?: number | null;
  support_for_community_engagement_details?: string | null;

  needs_community_access_support?: number | null;
  community_access_support_details?: string | null;

  has_taxi_card?: number | null;
  taxi_card_details?: string | null;

  interested_in_visitors_program?: number | null;
  visitors_program_details?: string | null;

  has_hobbies_activities?: number | null;
  hobbies_activities_details?: string | null;

  needs_duke_index?: number | null;
  duke_index_details?: string | null;

  social_connections_needs_feeding_support?: number | null;
  social_connections_feeding_support_details?: string | null;

  social_connections_wants_dietician_referral?: number | null;
  social_connections_dietician_referral_details?: string | null;

  social_connections_needs_shopping_support?: number | null;
  social_connections_shopping_support_details?: string | null;
}

export interface SupportPlanFinancialSupports {
  financial_has_power_of_attorney?: number | null;
  financial_power_of_attorney_details?: string | null;

  has_access_to_money?: number | null;
  access_to_money_details?: string | null;

  at_risk_of_abuse?: number | null;
  risk_of_abuse_details?: string | null;

  needs_support_for_bills?: number | null;
  support_for_bills_details?: string | null;

  not_enough_money?: number | null;
  not_enough_money_details?: string | null;

  support_financial_counsellor?: number | null;
  financial_counsellor_details?: string | null;

  support_government_initiatives?: number | null;
  government_initiatives_details?: string | null;
}

export interface SupportPlanInformalSupports {
  is_primary_caregiver?: number | null;
  primary_caregiver_details?: string | null;
  receiving_help?: number | null;
  receiving_help_details?: string | null;
  carer_lives_with_you?: number | null;
  carer_lives_with_you_details?: string | null;
  carer_receives_pension?: number | null;
  carer_pension_details?: string | null;
  factors_affecting_care?: number | null;
  factors_affecting_care_details?: string | null;
  caregiver_strain_index_required?: number | null;
  carer_gateway_referral?: number | null;
  carer_gateway_referral_details?: string | null;
  primary_caregiver_receives_allowance?: number | null;
}

export interface SupportPlanEmergencyReadiness {
  at_risk_of_abuse?: number | null;
  abuse_details?: string | null;
  opan_referral_required?: number | null;
  opan_referral_details?: string | null;
  risk_of_declining_services?: number | null;
  declining_services_details?: string | null;
  neglect_indicators?: number | null;
  neglect_indicators_details?: string | null;
  emergency_accessible?: number | null;
  emergency_accessible_details?: string | null;
  emergency_support_available?: number | null;
  emergency_support_details?: string | null;
  vpr_required?: number | null;
  vpr_details?: string | null;
}

export interface SupportPlanFireHeatReadiness {
  home_preparation_support?: number | null;
  home_preparation_details?: string | null;
  hydration_access?: number | null;
  hydration_details?: string | null;
  home_cooling?: number | null;
  home_cooling_details?: string | null;
  multiple_exit_points?: number | null;
  exit_points_details?: string | null;
  identify_fire_risk?: number | null;
  fire_risk_details?: string | null;
  can_evacuate_independently?: number | null;
  evacuate_independently_details?: string | null;
  support_from_family_or_neighbour?: number | null;
  support_from_family_or_neighbour_details?: string | null;
}

export interface SupportPlanStormFlooding {
  storm_home_preparation_support?: number | null;
  storm_home_preparation_details?: string | null;

  storm_multiple_exit_points?: number | null;
  storm_multiple_exit_points_details?: string | null;

  identify_flood_risk?: number | null;
  identify_flood_risk_details?: string | null;

  storm_can_evacuate_independently?: number | null;
  storm_evacuate_independently_details?: string | null;

  storm_support_from_family_or_neighbour?: number | null;
  storm_support_from_family_or_neighbour_details?: string | null;
}

export interface SupportPlanTelecommunicationOutages {
  independent_leave_home?: number | null;
  independent_leave_home_details?: string | null;
  has_support_checkin?: number | null;
  has_support_checkin_details?: string | null;
  welfare_check_required?: number | null;
  welfare_check_required_details?: string | null;
}

export interface SupportPlanPowerOutages {
  has_medical_equipment?: number | null;
  has_backup_power?: number | null;
  backup_power_details?: string | null;
  registered_life_support?: number | null;
  life_support_hours_supply?: string | null;
  life_support_provider?: string | null;
  power_independent_leave_home?: number | null;
  power_independent_leave_home_details?: string | null;
  power_has_support_checkin?: number | null;
  power_has_support_checkin_details?: string | null;
  power_welfare_check_required?: number | null;
  power_welfare_check_required_details?: string | null;
}

export interface SupportPlanEndOfLifeAdvancedCare {
  receiving_palliative_care?: number | null;
  receiving_palliative_care_details?: string | null;
  support_to_initiate_palliative_care?: number | null;
  support_to_initiate_palliative_care_details?: string | null;
  has_advanced_care_plan?: number | null;
  advanced_care_plan_details?: string | null;
  support_to_complete_advanced_care_plan?: number | null;
  support_to_complete_advanced_care_plan_details?: string | null;
  has_dnr?: number | null;
  dnr_details?: string | null;
}


export type SupportPlanResponse = SupportPlanSuccess | SupportPlanError;