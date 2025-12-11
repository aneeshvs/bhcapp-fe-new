"use client";

import React, { useState, useEffect } from "react";
import { index, store, update, destroy } from "@/src/services/crud";

interface Chargeband {
    id: number;
    uuid: string;
    chargeband_name: string;
}

export default function ChargebandsPage() {
    const [chargebands, setChargebands] = useState<Chargeband[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChargeband, setCurrentChargeband] = useState<Partial<Chargeband>>({});
    // const [getError, setGetError] = useState<string | null>(null);

    const fetchChargebands = async () => {
        setLoading(true);
        try {
            const res = await index<Chargeband[]>("chargebands");
            if (res.success) {
                setChargebands(res.data);
            } else {
                setChargebands([]); // Ensure array if fails
            }
        } catch (err) {
            console.error("Failed to fetch chargebands", err);
            // setGetError("Failed to fetch chargebands");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChargebands();
    }, []);

    const handleOpenModal = (chargeband?: Chargeband) => {
        if (chargeband) {
            setCurrentChargeband(chargeband);
        } else {
            setCurrentChargeband({});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentChargeband({});
    };

    const handldeSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if (currentChargeband.chargeband_name) {
            formData.append("chargeband_name", currentChargeband.chargeband_name);
        }

        try {
            let res;
            if (currentChargeband.uuid) {
                // Edit
                res = await update(`chargebands/${currentChargeband.uuid}`, formData);
            } else {
                // Create
                res = await store("chargebands", formData);
            }

            if (res.success) {
                handleCloseModal();
                fetchChargebands();
            } else {
                alert("Failed to save: " + res.message);
            }
        } catch (err) {
            console.error("Error saving chargeband", err);
            alert("An error occurred while saving.");
        }
    };

    const handleDelete = async (uuid: string) => {
        if (!confirm("Are you sure you want to delete this chargeband?")) return;
        try {
            const res = await destroy(`chargebands/${uuid}`);
            if (res.success) {
                fetchChargebands();
            } else {
                alert("Failed to delete: " + res.message);
            }
        } catch (err) {
            console.error("Error deleting", err);
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Chargebands</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add New Chargeband
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {chargebands.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        No chargebands found.
                                    </td>
                                </tr>
                            ) : (
                                chargebands.map((cb) => (
                                    <tr key={cb.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cb.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {cb.chargeband_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenModal(cb)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cb.uuid)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                {currentChargeband.uuid ? "Edit Chargeband" : "Add New Chargeband"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handldeSave}>
                            <div className="px-6 py-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chargeband Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={currentChargeband.chargeband_name || ""}
                                        onChange={(e) =>
                                            setCurrentChargeband({
                                                ...currentChargeband,
                                                chargeband_name: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter name"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
