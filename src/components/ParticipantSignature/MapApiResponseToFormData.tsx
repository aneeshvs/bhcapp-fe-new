import {ParticipantSignature} from "./ApiResponse";

export function mapApiResponseToFormData(responseData: ParticipantSignature) {
    return {
        participant_signature: responseData?.participant_signature,
        date_signed: responseData?.date_signed,
        submit_final: responseData?.submit_final,
        form_status: responseData?.form_status,
    };
}
