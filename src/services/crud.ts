"use client"; // Only required for App Router

import api from "@/src/utils/api";
import phpApi from "@/src/utils/PhpApi";

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export async function index<T = unknown>(link: string, params: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
    const response = await api.get(link, { params });
    if (response.data.success) {
        return response.data;
    }
    return { success: false, message: '', data: (response.data.data ?? []) as T };
}

export async function store<T = unknown>(link: string, data: FormData): Promise<ApiResponse<T>> {
    const response = await api.post(link, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    if (response.data.success) {
        return response.data;
    }
    return { success: false, message: '', data: (response.data.data ?? []) as T };
}

export async function update<T = unknown>(link: string, data: FormData): Promise<ApiResponse<T>> {
    data.append('_method', 'PUT'); // Override method

    const response = await api.post(link, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (response.data.success) {
        return response.data;
    }
    return { success: false, message: '', data: (response.data.data ?? []) as T };
}

export async function getFormSession(
  form: string,
  formUuid?: string | null,
  sessionUserId?: string,
  sessionClientType?: string,
): Promise<{ 
  token: string; 
  userid: string; 
  client_name: string;
  client_type: string; 
  uuid?: string | null; 
}> {

  const params: Record<string, string> = { form };

  if (formUuid) {
    params['form-uuid'] = formUuid;
  }

  if (sessionUserId) {
    params['userid'] = sessionUserId;
  }

  if (sessionClientType) {
    params['client_type'] = sessionClientType;
  }

    // Debug: Log what axios will send
  console.log('Params being sent:', params);
  console.log('Full URL will be:', '/php/get-form-session.php', { params });

  const response = await phpApi.get('/php/get-form-session.php', {
    params
  });

  return response.data;
}




export async function destroy<T = unknown>(link: string, params: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
    const response = await api.delete(link, { params });
    if (response.data.success) {
        return response.data;
    }
    return { success: false, message: '', data: (response.data.data ?? []) as T };
}

export async function show<T = unknown>(link: string, uuid: string): Promise<ApiResponse<T>> {
    const response = await api.get(`${link}/${uuid}`);
    if (response.data.success) {
        return response.data;
    }
    return { success: false, message: '', data: (response.data.data ?? {}) as T };
}

export async function verifyFormOtp(uuid: string, otp: string): Promise<ApiResponse> {
  const response = await phpApi.get('/php/verify-form-otp.php', {
    params: { uuid, otp }
  });
  if (response.data.success) {
    return response.data;
  }
  return { success: false, message: response.data.message || 'Verification failed', data: response.data.data };
}
