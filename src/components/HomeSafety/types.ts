export interface HomeSafetyChecklistFormData {
  participant_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_new_participant?: number;
  is_review_existing?: number;
  does_participant_agree?: number;
  entry_door?: string;
  entry_door_other?: string;
}

interface HomeSafetySuccess {
  success: true;
  data: {
    homeSafetyChecklistAssessment: {
      uuid: string;
      id: number;
    };
  };
}

interface HomeSafetyError {
  success: false;
  data: Record<string, string>;
  message?: string;
  status?: number;
  alert?: boolean;
}


export interface HomeSafetyOutsideEntriesFormData {
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
export interface InsideResidencesFormData {
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


export interface HallwaysChecksFormData {
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


export interface KitchenAssessmentsFormData {
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

export type HomeSafetyResponse = HomeSafetySuccess | HomeSafetyError;