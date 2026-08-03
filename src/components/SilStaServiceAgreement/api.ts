import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.bhcapp.com.au/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const saveSilStaServiceAgreement = async (data: any) => {
  try {
    const isClientView = !!data.isClientView;
    const endpoint = isClientView ? "/client/sil-sta-service-agreement/update" : "/sil-sta-service-agreement/save";
    const method = "POST";

    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error saving SIL/STA Service Agreement:", error);
    throw error;
  }
};

export const fetchSilStaServiceAgreement = async (uuid: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sil-sta-service-agreement/show`, {
      params: { uuid, user_id: userId },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching SIL/STA Service Agreement:", error);
    throw error;
  }
};

export const fetchSilStaServiceAgreementUuid = async (userId: string, clientType: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-sil-sta-service-agreement-uuid`, {
      params: { userid: userId, client_type: clientType },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching SIL/STA Service Agreement UUID:", error);
    throw error;
  }
};

export const generateSilStaServiceAgreementPdf = async (uuid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sil-sta-service-agreement/export-pdf/${uuid}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
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
