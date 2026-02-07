import { ConfidentialInformation } from './ApiResponse';

export function mapApiResponseToFormData(responseData: ConfidentialInformation) {
    return {
        form_status: responseData.form_status || '',
        submit_final: responseData.submit_final ?? 0,
        staff_id: responseData.staff_id,
        uuid: responseData.uuid,
        completion_percentage: responseData.completion_percentage,
        client_name: responseData.client_name,
        participant_name: responseData.participant_name,
        address: responseData.address,
        post_code: responseData.post_code,
        date_of_birth: responseData.date_of_birth,
        phone: responseData.phone,
        email: responseData.email,
        mobile_no: responseData.mobile_no,



        signature: responseData.consent?.signature,
        signed_date: responseData.consent?.signed_date,
        signed_by: responseData.consent?.signed_by,
        name: responseData.consent?.name,
        witnessed_by: responseData.consent?.witnessed_by,


        verbal_signature: responseData.verbal?.verbal_signature,
        verbal_signed_date: responseData.verbal?.verbal_signed_date,
        verbal_name: responseData.verbal?.verbal_name ?? '',
        position: responseData.verbal?.position ?? '',

        explain_collection_storage: responseData.pre_consent_disclosure?.explain_collection_storage ?? 0,
        discuss_referral_services: responseData.pre_consent_disclosure?.discuss_referral_services ?? 0,
        explain_release_agreement: responseData.pre_consent_disclosure?.explain_release_agreement ?? 0,
        explain_share_without_consent: responseData.pre_consent_disclosure?.explain_share_without_consent ?? 0,
        provide_privacy_information: responseData.pre_consent_disclosure?.provide_privacy_information ?? 0,

        media_permission: responseData.media_consent?.permission ?? false,
        media_option_on_occasion: responseData.media_consent?.option_on_occasion ?? false,
        media_permission_denied: responseData.media_consent?.permission_denied ?? false,

    }
}