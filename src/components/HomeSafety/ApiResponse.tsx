export interface HomeSafetyChecklistFormData {
    form_status: string;
    submit_final: number;
    staff_id: number;
    uuid: string;
    completion_percentage: number;
    client_name: string;
    participant_name?: string;
    address?: string;
    phone?: string;
    email?: string;
    is_new_participant?: number;
    is_review_existing?: number;
    does_participant_agree?: number;
    entry_door?: string;
    entry_door_other?: string;
    outside_entry?: HomeSafetyOutsideEntriesFormData;
    inside_residence?: InsideResidencesFormData;
    hallways?: HallwaysChecksFormData;
    hallways_safety_assessment?: KitchenAssessmentsFormData;
    outside_residence_assessment?: OutsideAssessmentsFormData;
    miscellaneous?: HomeMiscellaneousFormData;
    residence_type?: HomeResidenceTypesFormData;
}

interface HomeSafetyOutsideEntriesFormData {
  parking_adequate?: string;
  parking_adequate_strategy?: string;
  pathway_surface?: string;
  pathway_surface_strategy?: string;
  gates_entry_easy?: string;
  gates_entry_easy_strategy?: string;
  lighting_adequate?: string;
  lighting_adequate_strategy?: string;
  outdoor_fire_hazards?: string;
  outdoor_fire_hazards_strategy?: string;
}

interface InsideResidencesFormData {
  exit_doors_unobstructed?: string;
  exit_doors_unobstructed_strategy?: string;
  heaters_suitable?: string;
  heaters_suitable_strategy?: string;
  aids_equipment_condition?: string;
  aids_equipment_condition_strategy?: string;
  evidence_of_pests?: string;
  evidence_of_pests_strategy?: string;
  participant_open_door?: string;
  participant_open_door_strategy?: string;
  fire_hazards?: string;
  fire_hazards_strategy?: string;
  vacuum_cleaner_ok?: string;
  vacuum_cleaner_ok_strategy?: string;
  mop_bucket_ok?: string;
  mop_bucket_ok_strategy?: string;
  step_ladder_ok?: string;
  step_ladder_ok_strategy?: string;
  cleaning_substances_ok?: string;
  cleaning_substances_ok_strategy?: string;
}

interface HallwaysChecksFormData {
  hallways_lounge_dining_bedroom?: string;
  hallways_lounge_dining_bedroom_strategy?: string;
  pests_evidence?: string;
  pests_evidence_strategy?: string;
  lighting_workspace?: string;
  lighting_workspace_strategy?: string;
  furniture_stable?: string;
  furniture_stable_strategy?: string;
  bed_adjustable?: string;
  bed_adjustable_strategy?: string;
  electrical_switches?: string;
  electrical_switches_strategy?: string;
  private_sleep_space?: string;
  private_sleep_space_strategy?: string;
  hallways_fire_hazards?: string;
  hallways_fire_hazards_strategy?: string;
}
interface KitchenAssessmentsFormData {
  floor_condition?: string;
  floor_condition_strategy?: string;
  electrical_condition?: string;
  electrical_condition_strategy?: string;
  ventilation_condition?: string;
  ventilation_condition_strategy?: string;
  bench_condition?: string;
  bench_condition_strategy?: string;
  stove_condition?: string;
  stove_condition_strategy?: string;
  fridge_condition?: string;
  fridge_condition_strategy?: string;
  bath_access?: string;
  bath_access_strategy?: string;
  toilet_access?: string;
  toilet_access_strategy?: string;
  privacy_condition?: string;
  privacy_condition_strategy?: string;
  laundry_condition?: string;
  laundry_condition_strategy?: string;
  ironing_condition?: string;
  ironing_condition_strategy?: string;
  manual_handling_risks?: string;
  manual_handling_strategy?: string;
  kitchen_fire_hazards?: string;
  kitchen_fire_hazards_strategy?: string;
}


interface OutsideAssessmentsFormData {
  outside_paths_veranda_steps?: string;
  outside_paths_veranda_steps_strategy?: string;
  outside_pets_restrained?: string;
  outside_pets_restrained_strategy?: string;
  outside_lighting_adequate?: string;
  outside_lighting_adequate_strategy?: string;
  outside_door_easy_open?: string;
  outside_door_easy_open_strategy?: string;
  outside_lawn_mower_condition?: string;
  outside_lawn_mower_condition_strategy?: string;
  outside_electrical_condition?: string;
  outside_electrical_condition_strategy?: string;
  outside_fire_hazards?: string;
  outside_fire_hazards_strategy?: string;
}


interface HomeMiscellaneousFormData {
  misc_children_living_at_home?: string;
  misc_children_living_at_home_strategy?: string;
  misc_weapons_stored_appropriately?: string;
  misc_weapons_stored_appropriately_strategy?: string;
  misc_smoking_outside_only?: string;
  misc_smoking_outside_only_strategy?: string;
  misc_mobility_issues?: string;
  misc_mobility_issues_strategy?: string;
  misc_equipment_good_condition?: string;
  misc_equipment_good_condition_strategy?: string;
  misc_ppe_requirements?: string;
  misc_ppe_requirements_strategy?: string;
  misc_personal_threats?: string;
  misc_personal_threats_strategy?: string;
  misc_safe_neighbourhood?: string;
  misc_safe_neighbourhood_strategy?: string;
  misc_aggression_in_home?: string;
  misc_aggression_in_home_strategy?: string;
}


interface HomeResidenceTypesFormData {
  residence_house_type?: string;
  residence_other_type?: string;
  assessment_completed_with?: string;
  name?: string;
  position?: string;
  review_date?: string;
  care_facility?: string;
}