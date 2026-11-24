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
            user_type_id?: number;
            user_type?: {
                id: number;
                name: string;
                slug: string;
            }
        };
    }
}


export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("login", {
        email, password
    });
    if (response.data.success) {
        console.log("Login successful", response.data.data);
        localStorage.setItem("token", response.data.data.token);
        const userData = response.data.data.user || response.data.data;
        localStorage.setItem("user", JSON.stringify(userData));
        const utId = userData?.user_type_id ?? userData?.user_type?.id;
        if (utId !== undefined && utId !== null) {
            localStorage.setItem("user_type_id", String(utId));
        }
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth_state_changed"));
        }
    }
    return response.data;
}

export async function me() {
    const response = await api.get("me");
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        const utId = response.data.user_type_id ?? response.data.user_type?.id;
        if (utId !== undefined && utId !== null) {
            localStorage.setItem("user_type_id", String(utId));
        }
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth_state_changed"));
        }
    }
    return response.data;
}
