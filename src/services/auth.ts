"use client"; // Only required for App Router

//import { useEffect, useState } from "react";

import api from "@/src/utils/api";

interface LoginResponse {
    success: boolean;
    message: string;
    data:{
        access_token:string;
        name:string;
        user: {
            id: number;
            name: string;
            email: string;
            user_type:{
                id: number;
                name: string;
                slug: string;
            }
        };
    }
}


export async function login(email: string, password: string): Promise<LoginResponse> {
    //const cookieStore = await cookies()
    const response = await api.post("login", { email, password
    });
    if (response.data.success) {
        console.log("Login successful", response.data.data);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.name));
    }
    return response.data;

}
