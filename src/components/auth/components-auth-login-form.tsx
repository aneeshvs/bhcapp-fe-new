'use client';
import '@/src/app/globals.css';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from "react";
import { login } from "@/src/services/auth";
    

const ComponentsAuthLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if(data.success){
               router.push("/indexx");
            }
            else{
                setError(data.message)
            }
        } catch (err: unknown) {
            if (process.env.NODE_ENV === "development") {
                console.error("Login error:", err);
            }
            setError("Invalid credentials");
        }
    };

    return (
        <form className="space-y-5 text-gray-800 dark:text-white" onSubmit={submitForm}>
            {/* Email */}
            <div>
                <label htmlFor="Email" className="block mb-1 font-medium">Email</label>
                <div className="relative">
                <input
                    id="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter Email"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-500"
                />
                </div>
            </div>

            {/* Password */}
            <div>
                <label htmlFor="Password" className="block mb-1 font-medium">Password</label>
                <div className="relative">
                <input
                    id="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter Password"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-500"
                />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div>
                <p className="text-sm text-red-500">{error}</p>
                </div>
            )}

            {/* Checkbox */}
            <div className="flex items-center gap-2">
                <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-black"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Subscribe to weekly newsletter</span>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-pink-500 to-blue-600 px-4 py-2 text-white font-semibold uppercase shadow-md hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
                Sign In
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
