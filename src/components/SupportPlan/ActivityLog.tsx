// components/ActivityLog.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { getFormSession } from "@/src/services/crud";
import { useSearchParams } from "next/navigation";
type LogEntry = {
  id: number;
  log_name: string;
  description: string;
  causer_id?: number;
  created_at?: string;
  user_id?: number | string;
  staff_id?: number;
  staff_name?: string;
  stafftype_name?: string;
  attributes?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

type LogProps = {
  logs: LogEntry[];
};

const ActivityLog: React.FC<LogProps> = ({ logs }) => {
  const isBase64Image = (value: unknown): value is string => {
      return typeof value === 'string' && value.startsWith('data:image');
    };
  
    const formatValue = (value: unknown): React.ReactNode => {
      if (isBase64Image(value)) {
        return (
          <div className="flex flex-col items-start gap-2">
            <div className="w-64 h-32 border rounded overflow-hidden relative">
              <Image 
                src={value} 
                alt="Signature" 
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
            <span className="text-xs text-gray-500">Signature Image</span>
          </div>
        );
      }
      return String(value);
    };
  
    const formatOldValue = (value: unknown): string => {
      if (isBase64Image(value)) {
        return 'Signature Image';
      }
      return String(value);
    };
  const searchParams = useSearchParams();
     const [flag, setFlag] = useState(false);
          const [checkingSession, setCheckingSession] = useState(true);
     
    useEffect(() => {
        (async () => {
          try {
            const form = "support-care-plan";
            const formUuid = searchParams.get("form-uuid");
    
            // pass form, form_token, form_client_type, and form-uuid to API
            const { token } = await getFormSession(
              form,
              formUuid
            );
    
            if (token) {
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify({ type: "client" }));
            }
            setFlag(true);
          } catch (e) {
            console.error("Failed to get form session", e);
          }finally {
            setCheckingSession(false);
          }
        })();
      }, [searchParams]);
  const tableFieldsMap: Record<string, string[]> = {
    SupportPlan: [
        'staff_id', 'uuid', 'completion_percentage', 'effective_date', 'review_date', 
        'confirmation_date', 'developed_by', 'invited_but_not_participated'
    ],
    Approval: [
        'participant_name', 'date_of_approval', 'signature'
    ],
    SupportPlanRepresentative: [
        'support_representative_name', 'role', 'date_of_approval'
    ],
    CarePartner: [
        'care_partner_name', 'care_partner_role', 'care_partner_contact_phone', 'care_partner_email'
    ],
    KeepInTouch: [
        'need_help_to_communicate', 'type_of_difficulty', 'contact_first_instance', 'details',
        'language_spoken', 'use_nrs', 'require_interpreter', 'written', 'verbal',
        'schedule_change_notification', 'interpreter_arrangement', 'financial_statement_method',
        'feedback_survey_method', 'marketing_material_method', 'preferred_communication_method',
        'join_cab'
    ],
    NonResponsive: [
        'telephone_home_or_mobile', 'telephone_details', 'contact_emergency_contact',
        'emergency_contact_details', 'access_spare_key', 'enter_home_with_spare_key',
        'spare_key_details', 'contact_other_persons', 'other_persons_details',
        'contact_police_if_no_key', 'police_contact_details', 'access_key_lock',
        'key_lock_code', 'key_lock_details'
    ],
    Participant: [
        'first_name', 'surname', 'preferred_name', 'date_of_birth', 'country_of_birth',
        'identify_as_aboriginal_or_torres_strait', 'gender'
    ],
    SupportContactDetails: [
        'phone', 'address', 'is_rural_area', 'mailing_address', 'email'
    ],
    SupportContactDetailsSecondary: [
        'secondary_role', 'secondary_phone', 'secondary_email', 'secondary_address',
        'secondary_best_time_to_contact', 'secondary_is_mac_registered', 'secondary_list_documents',
        'secondary_legal_documentation_stored', 'secondary_date_legal_orders_end',
        'secondary_participants_agreed_contact', 'secondary_participants_agreed_contact_date',
        'secondary_decision_making_approval_for'
    ],
    SupportPlanFundings: [
        'aged_care_id', 'pension_status', 'pension_card_details', 'card_number', 'card_expiry',
        'approved_funding_level', 'awaiting_package_upgrade', 'upgrade_details',
        'has_chsp_referral_codes', 'chsp_referral_details', 'war_veteran_or_widow',
        'dva_number', 'medicare_number', 'private_health_insurance', 'hcp_funding_level',
        'has_companion_card'
    ],
    SupportPlanService: [
        'name', 'service_provided', 'funded_by', 'duration_frequency', 'support_to_implement_by_us'
    ],
    EmployeeMatchingNeeds: [
        'cultural_considerations', 'specific_training_required', 'common_interests'
    ],
    SupportPlanMyGoal: [
        'goal', 'measure_progress', 'success_look_like', 'who_will_support', 'participant_support', 'target_date'
    ],
    SupportPlanLivingArrangements: [
        'reside_in', 'reside_with', 'home_safety_assessment_date', 'is_home_suitable',
        'home_suitable_details', 'at_risk_of_homelessness', 'homelessness_details'
    ],
    CulturalDiversities: [
        'is_lgbti', 'lgbti_details', 'is_separated_family', 'separated_family_details',
        'has_cultural_events', 'cultural_events_details', 'has_past_events', 'past_events_details',
        'has_non_disclosure_items', 'non_disclosure_details'
    ],
    SupportPlanGeneralHealth: [
        'gp_visit_frequency', 'admitted_hospital_last12months', 'admitted_hospital_details',
        'preferred_hospital', 'preferred_hospital_details', 'diagnosis_medication_conditions',
        'previous_surgeries', 'has_allergies', 'allergy_details', 'health_impact_scale',
        'painful_day_to_day', 'painful_day_to_day_details', 'weight_loss_last3months',
        'weight_loss_details', 'nutritional_concerns', 'nutritional_concerns_details',
        'current_weight', 'annual_vaccinations', 'annual_vaccination_details',
        'last_influenza_vaccine', 'last_covid19_vaccine', 'last_pneumonia_vaccine',
        'sleep_difficulties', 'sleep_difficulties_details', 'sleep_routine',
        'sleep_routine_worries', 'sleep_routine_worries_details', 'alcohol_smoke_drug_use',
        'alcohol_smoke_drug_details', 'alcohol_smoke_drug_worries', 'alcohol_smoke_drug_worries_details',
        'referral_required', 'referral_required_details'
    ],
    SupportPlanMedicationManagement: [
        'takes_regular_medications', 'medication_details', 'medication_form', 'medication_packaging',
        'medications_locked', 'medications_locked_details', 'specific_storage_requirements',
        'scheduled_4_or_8_medications', 'scheduled_medications_details', 'chemical_restraint_medications',
        'takes_more_than_prescribed', 'takes_more_than_prescribed_details', 'at_risk_of_missing_medication',
        'missing_medication_details', 'able_to_explain_purpose', 'last_medication_review_date',
        'medication_collection_delivery_details', 'needs_support_with_medication',
        'support_with_medication_details', 'medication_management_worries', 'medication_management_worries_details',
        'medication_service_required', 'support_worker_prompt'
    ],
    SupportPlanMobilityTransfers: [
        'can_walk_independently', 'walk_independently_details', 'needs_transfer_support',
        'primary_equipment_used', 'can_climb_stairs', 'climb_stairs_details', 'has_stairs_at_home',
        'stairs_at_home_details', 'can_transfer_self', 'can_transfer_in_other_envs',
        'uses_bed_pole_or_rails', 'bed_pole_prescribed_by_ot', 'can_access_places_outside_walking_distance',
        'access_places_details', 'safe_to_mobilise_in_yard', 'mobilise_yard_details',
        'community_access', 'drives', 'medications_or_conditions_risk', 'driving_risk_details',
        'mobility_equipment', 'equipment_purchase_type', 'uses_four_wheel_walker',
        'four_wheel_walker_details', 'wheelchair_type', 'wheelchair_operation',
        'wheelchair_ot_recommended', 'can_charge_wheelchair', 'last_wheelchair_service_date',
        'can_carry_5kg', 'carry_5kg_details', 'foot_problems', 'foot_problems_details',
        'mobility_worries', 'mobility_worries_details', 'last_ot_assessment_date',
        'new_ot_referral_required', 'demmi_assessment_required', 'demmi_assessment_result'
    ],
    SupportPlanFallsRisks: [
        'recent_falls', 'recent_falls_details', 'strategies_to_reduce_risk', 'strategies_details',
        'has_safety_pendant', 'safety_pendant_details', 'worried_about_falling', 'worried_details',
        'referral_falls_clinic', 'referral_falls_clinic_details', 'referral_ot', 'fallrisk_referral_ot_details',
        'referral_physio', 'referral_physio_details'
    ],
    SupportPlanCognitions: [
        'cognitive_concerns', 'cognitive_concerns_details', 'diagnosis_dementia', 'diagnosis_dementia_details',
        'capable_of_decisions', 'capable_of_decisions_details', 'has_power_of_attorney', 'power_of_attorney_details',
        'becomes_confused', 'becomes_confused_details', 'experienced_delirium', 'experienced_delirium_details',
        'anxious_or_worry', 'anxious_or_worry_details', 'short_term_memory_loss', 'short_term_memory_loss_details',
        'long_term_memory_loss', 'long_term_memory_loss_details', 'atsi_kica_cog_required', 'atsi_kica_cog_file',
        'atsi_kica_carer_required', 'atsi_kica_carer_file', 'gpcog_required', 'gpcog_file',
        'health_literacy_support', 'health_literacy_support_details', 'gds_required', 'gds_file',
        'referral_geriatrician', 'referral_geriatrician_details', 'referral_psychologist', 'referral_psychologist_details',
        'referral_psychiatrist', 'referral_psychiatrist_details'
    ],
    SupportPlanBehaviourSupports: [
        'feeling_agitation', 'feeling_agitation_details', 'delusions_hallucinations', 'delusions_hallucinations_details',
        'personality_changes', 'personality_changes_details', 'wandering_purpose', 'wandering_purpose_details',
        'absconding_concerns', 'absconding_concerns_details', 'verbal_threats', 'verbal_threats_details',
        'physical_assault', 'physical_assault_details', 'restrictive_interventions', 'restrictive_interventions_details',
        'restrictive_physical', 'restrictive_approved_by_practitioner', 'restrictive_practitioner_details',
        'current_strategies', 'referral_positive_behaviour_practitioner', 'referral_positive_behaviour_practitioner_details',
        'behaviour_support_plan_required', 'behaviour_support_plan_expiry'
    ],
    SupportPlanPersonalCares: [
        'support_daily_personal_care', 'daily_personal_care_details', 'support_showering', 'showering_type',
        'showering_details', 'personal_care_routine', 'support_dressing', 'dressing_details', 'dressing_routine',
        'equipment_in_bathroom', 'equipment_details', 'support_shaving', 'shaving_details', 'support_haircuts',
        'haircuts_details', 'task_at_home', 'wears_dentures', 'dentures_details', 'support_teeth_brushing',
        'teeth_brushing_details', 'ot_bathroom_assessment', 'ot_assessment_type', 'ot_assessment_details',
        'referral_ot_required', 'plancare_referral_ot_details'
    ],
    SupportPlanContinences: [
        'identified_needs', 'identified_needs_details', 'identify_toilet_needs', 'identify_toilet_needs_details',
        'require_prompting', 'require_prompting_details', 'wears_continence_aids', 'continence_aids_details',
        'ruis_required', 'ruis_details', 'rfis_required', 'rfis_details', 'funding_for_products',
        'funding_for_products_details', 'nurse_assessment', 'nurse_assessment_details', 'worry_about_continence',
        'worry_about_continence_details'
    ],
    SupportPlanVisions: [
        'wears_glasses_or_contacts', 'glasses_or_contacts_type', 'vision_when_worn', 'last_optometrist_appointment',
        'vision_worry', 'vision_worry_details'
    ],
    SupportPlanHearings: [
        'wears_hearing_devices', 'hearing_devices_details', 'when_worn', 'last_audiologist_appointment',
        'hearing_worry', 'hearing_worry_details'
    ],
    SupportPlanSkinConditions: [
        'has_skin_condition', 'skin_condition_type', 'impacts_daily_activities', 'impact_date',
        'pain_discomfort_level', 'pain_level_score', 'management_strategies', 'skin_condition_worry',
        'worry_date', 'referral_nursing_required', 'referral_nursing_date'
    ],
    SupportPlanDietaries: [
        'intolerances', 'intolerances_details', 'dysphagia_concerns', 'dysphagia_details',
        'speech_pathologist_recommendations', 'iddsi_food_category', 'iddsi_liquid_category',
        'prepares_meals', 'prepares_meals_details', 'needs_meal_support', 'meal_support_details',
        'diet_meets_needs', 'diet_meets_needs_details', 'needs_cutting_support', 'cutting_support_details',
        'needs_feeding_support', 'feeding_support_details', 'dietician_referral_required', 'dietician_referral_details',
        'needs_shopping_support', 'shopping_support_details'
    ],
    SupportPlanPain: [
        'ongoing_pain', 'pain_details', 'pain_location', 'pain_frequency', 'pain_scale',
        'supported_for_pain', 'supported_pain_details', 'pain_management_strategies',
        'abbey_pain_scale_required', 'pain_worry', 'pain_worry_details'
    ],
    SupportPlanSocialConnections: [
        'feels_lonely', 'feels_lonely_details', 'has_informal_supports', 'informal_supports_details',
        'wants_more_community_engagement', 'community_engagement_details', 'wants_support_for_community_engagement',
        'support_for_community_engagement_details', 'needs_community_access_support', 'community_access_support_details',
        'has_taxi_card', 'taxi_card_details', 'interested_in_visitors_program', 'visitors_program_details',
        'has_hobbies_activities', 'hobbies_activities_details', 'needs_duke_index', 'duke_index_details',
        'social_connections_needs_feeding_support', 'social_connections_feeding_support_details',
        'social_connections_wants_dietician_referral', 'social_connections_dietician_referral_details',
        'social_connections_needs_shopping_support', 'social_connections_shopping_support_details'
    ],
    SupportPlanHomeMaintenances: [
        'needs_domestic_assistance', 'domestic_assistance_type', 'domestic_assistance_details',
        'needs_help_with_cleaning_products', 'cleaning_products_details', 'needs_garden_support',
        'garden_support_details', 'trouble_navigating_at_night', 'navigating_at_night_details',
        'home_maintenance_worries', 'home_maintenance_worries_details', 'last_home_safety_assessment',
        'home_safety_focus_areas'
    ],
    SupportPlanFinancialSupports: [
        'financial_has_power_of_attorney', 'financial_power_of_attorney_details', 'has_access_to_money',
        'access_to_money_details', 'at_risk_of_abuse', 'risk_of_abuse_details', 'needs_support_for_bills',
        'support_for_bills_details', 'not_enough_money', 'not_enough_money_details', 'support_financial_counsellor',
        'financial_counsellor_details', 'support_government_initiatives', 'government_initiatives_details'
    ],
    SupportPlanInformalSupports: [
        'is_primary_caregiver', 'primary_caregiver_details', 'receiving_help', 'receiving_help_details',
        'carer_lives_with_you', 'carer_lives_with_you_details', 'carer_receives_pension', 'carer_pension_details',
        'factors_affecting_care', 'factors_affecting_care_details', 'caregiver_strain_index_required',
        'carer_gateway_referral', 'carer_gateway_referral_details', 'primary_caregiver_receives_allowance'
    ],
    SupportPlanEmergencyReadiness: [
        'emergency_at_risk_of_abuse', 'abuse_details', 'opan_referral_required', 'opan_referral_details',
        'risk_of_declining_services', 'declining_services_details', 'neglect_indicators', 'neglect_indicators_details',
        'emergency_accessible', 'emergency_accessible_details', 'emergency_support_available', 'emergency_support_details',
        'vpr_required', 'vpr_details'
    ],
    SupportPlanFireHeatReadiness: [
        'home_preparation_support', 'home_preparation_details', 'hydration_access', 'hydration_details',
        'home_cooling', 'home_cooling_details', 'multiple_exit_points', 'exit_points_details',
        'identify_fire_risk', 'fire_risk_details', 'can_evacuate_independently', 'evacuate_independently_details',
        'support_from_family_or_neighbour', 'support_from_family_or_neighbour_details'
    ],
    SupportPlanStormFlooding: [
        'storm_home_preparation_support', 'storm_home_preparation_details', 'storm_multiple_exit_points',
        'storm_multiple_exit_points_details', 'identify_flood_risk', 'identify_flood_risk_details',
        'storm_can_evacuate_independently', 'storm_evacuate_independently_details', 'storm_support_from_family_or_neighbour',
        'storm_support_from_family_or_neighbour_details'
    ],
    SupportPlanTelecommunicationOutages: [
        'independent_leave_home', 'independent_leave_home_details', 'has_support_checkin', 'has_support_checkin_details',
        'welfare_check_required', 'welfare_check_required_details'
    ],
    SupportPlanPowerOutages: [
        'has_medical_equipment', 'has_backup_power', 'backup_power_details', 'registered_life_support',
        'life_support_hours_supply', 'life_support_provider', 'power_independent_leave_home',
        'power_independent_leave_home_details', 'power_has_support_checkin', 'power_has_support_checkin_details',
        'power_welfare_check_required', 'power_welfare_check_required_details'
    ],
    SupportPlanEndOfLifeAdvancedCare: [
        'receiving_palliative_care', 'receiving_palliative_care_details', 'support_to_initiate_palliative_care',
        'support_to_initiate_palliative_care_details', 'has_advanced_care_plan', 'advanced_care_plan_details',
        'support_to_complete_advanced_care_plan', 'support_to_complete_advanced_care_plan_details', 'has_dnr', 'dnr_details'
    ]
    };

  const [selectedTable, setSelectedTable] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter logs based on the selected filters and date range
  const filteredLogs = logs.filter((log) => {
    const changedKeys = log.attributes ? Object.keys(log.attributes) : [];

    const logDate = log.created_at ? new Date(log.created_at) : null;
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    // Check date range first
    const isInDateRange =
      (!from || (logDate && logDate >= from)) &&
      (!to || (logDate && logDate <= new Date(to.setHours(23, 59, 59, 999))));

    if (!isInDateRange) return false;

    // Apply table and field filters
    if (!selectedTable && !selectedField) return true;

    if (selectedTable && !selectedField) {
      const tableFields = tableFieldsMap[selectedTable];
      return changedKeys.some((key) => tableFields.includes(key));
    }

    if (selectedTable && selectedField) {
      return changedKeys.includes(selectedField);
    }

    return true;
  });

  if (checkingSession) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <span>Loading...</span>
    </div>
  );
}

if (!flag) {
  return null; // nothing is rendered (redirect is happening)
}

  return (
    <>
      {flag ? (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Table</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedField('');
            }}
          >
            <option value="">All Tables</option>
            {Object.keys(tableFieldsMap).map((table) => (
              <option key={table} value={table}>
                {table.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Field</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            disabled={!selectedTable}
          >
            <option value="">All Fields</option>
            {selectedTable &&
              tableFieldsMap[selectedTable]?.map((field) => (
                <option key={field} value={field}>
                  {field.replace(/_/g, ' ')}
                </option>
              ))}
          </select>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="text-center text-gray-500">No logs available</p>
      ) : (
        filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-indigo-600 capitalize">
                {log.log_name.replace(/_/g, ' ')}
              </h2>
              {log.created_at && (
                <span className="text-sm text-gray-400">
                  {new Date(log.created_at).toLocaleString('en-GB', {
                  hour12: true,
                  hour: 'numeric',
                  minute: '2-digit',
                  second: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{log.description}</p>

            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              {log.staff_id && (
                <p>
                  <strong>Staff ID:</strong> {log.staff_id}
                </p>
              )}
              <p>
                  <strong>Staff Name:</strong> {log.staff_name ?? 'Admin'}
                </p>
              {/* {log.user_id && (
                <p>
                  <strong>User ID:</strong> {log.user_id}
                </p>
              )}
              {log.stafftype_name && (
                <p>
                  <strong>Staff Type:</strong> {log.stafftype_name}
                </p>
              )} */}
              {log.causer_id && (
                <p>
                  <strong>Updated By:</strong> {log.causer_id}
                </p>
              )}
            </div>

            {log.attributes && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Changed Fields:</h4>
                <div className="border-l-4 border-indigo-300 pl-4 space-y-3">
                  {Object.entries(log.attributes).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <div>
                        <strong className="capitalize text-gray-700">{key.replace(/_/g, ' ')}:</strong>
                      </div>
                      <div className="text-green-700">
                        {formatValue(value)}
                      </div>
                      {log.old && log.old[key] !== undefined && (
                        <div className="text-gray-500 text-sm italic">
                          (was: {formatOldValue(log.old[key])})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
    ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
    </>
    
  );
};

export default ActivityLog;
