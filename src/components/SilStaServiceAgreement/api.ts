import api from "@/src/utils/api";

export const saveSilStaServiceAgreement = async (data: any) => {
  try {
    const isClientView = !!data.isClientView;
    const endpoint = isClientView
      ? "/client/sil-sta-service-agreement/update"
      : "/sil-sta-service-agreement/save";

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error saving SIL/STA Service Agreement:", error);
    throw error;
  }
};

export const fetchSilStaServiceAgreement = async (uuid: string, userId: string) => {
  try {
    const response = await api.get("/sil-sta-service-agreement/show", {
      params: { uuid, user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching SIL/STA Service Agreement:", error);
    throw error;
  }
};

export const fetchSilStaServiceAgreementUuid = async (userId: string, clientType: string) => {
  try {
    const response = await api.get("/get-sil-sta-service-agreement-uuid", {
      params: { userid: userId, client_type: clientType },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching SIL/STA Service Agreement UUID:", error);
    throw error;
  }
};

export const generateSilStaServiceAgreementPdf = async (uuid: string) => {
  try {
    const response = await api.get(`/sil-sta-service-agreement/export-pdf/${uuid}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SIL_STA_Service_Agreement_${uuid}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
