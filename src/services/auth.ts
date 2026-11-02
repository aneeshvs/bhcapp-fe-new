"use client"; // Only required for App Router

//import { useEffect, useState } from "react";

import api from "@/src/utils/api";

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        name: string;
        user: {
            id: number;
            name: string;
            email: string;
            user_type: {
                id: number;
                name: string;
                slug: string;
            }
        };
    }
}


export async function login(email: string, password: string): Promise<LoginResponse> {
    //const cookieStore = await cookies()
    const response = await api.post("login", {
        email, password
    });
    if (response.data.success) {
        console.log("Login successful", response.data.data);
        localStorage.setItem("token", response.data.data.token);
        const userData = response.data.data.user || response.data.data;
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData?.user_type_id !== undefined) {
            localStorage.setItem("user_type_id", String(userData.user_type_id));
        }
    }
    return response.data;
}

export async function me() {
    const response = await api.get("me");
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.user_type_id !== undefined) {
            localStorage.setItem("user_type_id", String(response.data.user_type_id));
        }
    }
    return response.data;
}
