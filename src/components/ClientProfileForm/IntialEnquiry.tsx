'use client';
import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import DatePickerSaveMany from '../DatePickerSaveMany';


interface IntialEnquiryProps {
  formData: {
    full_name?: string;
    preferred_name?: string;
    gender?: string;
    date_of_birth?: string;
    address?: string;
    post_code?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    agreement?: number;
    description?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  errors?: { [key: string]: string };
  uuid?: string | null;
}

export default function IntialEnquiry({ formData, handleChange, errors = {}, uuid }: IntialEnquiryProps) {
  // const router = useRouter();
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    console.log('View logs clicked', fieldName);
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  // const handleViewLogs = (fieldName: string) => {
  //   router.push(`/client-profile-form/field-logs?uuid=${uuid}&table=initial_enquiry&field=${fieldName}`);
  // };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded bg-white shadow">
      <div className="bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold mb-4 text-heading">Initial Enquiry</h2>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('full_name')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="full_name" className="block font-medium mb-1">Clients Full Name:</label>
              {hoveredField === 'full_name' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('full_name')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Enter full name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>

          {/* Preferred Name */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('preferred_name')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="preferred_name" className="block font-medium mb-1">Preferred Name:</label>
              {hoveredField === 'preferred_name' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('preferred_name')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              id="preferred_name"
              name="preferred_name"
              placeholder="Enter preferred name"
              value={formData.preferred_name || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.preferred_name && (
              <p className="text-red-500 text-xs mt-1">{errors.preferred_name}</p>
            )}
          </div>

          {/* Gender */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('gender')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium mb-1">Gender</label>
              {hoveredField === 'gender' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('gender')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {['male', 'female', 'non-binary'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('date_of_birth')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="date_of_birth" className="block font-medium mb-1">Date of Birth:</label>
              {hoveredField === 'date_of_birth' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('date_of_birth')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
             <DatePickerSaveMany
                name="date_of_birth"
                value={formData.date_of_birth || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
            )}
          </div>

          {/* Address */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('address')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="address" className="block font-medium mb-1">Address:</label>
              {hoveredField === 'address' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('address')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              id="address"
              name="address"
              placeholder="Enter address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Post Code */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('post_code')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="post_code" className="block font-medium mb-1">Post Code:</label>
              {hoveredField === 'post_code' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('postcode')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              id="post_code"
              name="post_code"
              placeholder="Enter post code"
              value={formData.post_code || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.post_code && (
              <p className="text-red-500 text-xs mt-1">{errors.post_code}</p>
            )}
          </div>

          {/* Phone */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('phone')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="phone" className="block font-medium mb-1">Phone Number:</label>
              {hoveredField === 'phone' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('phone_number')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Mobile */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('mobile')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="mobile" className="block font-medium mb-1">Mobile Number:</label>
              {hoveredField === 'mobile' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('mobile_number')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Email */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('email')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="email" className="block font-medium mb-1">Email:</label>
              {hoveredField === 'email' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('email')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Agreement */}
          <div 
            className="col-span-full relative"
            onMouseEnter={() => setHoveredField('agreement')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium mb-1">Does the client need the involvement of an independent family member, friend, advocate, or legal guardian 
                to assist with understanding and signing the agreement as part of this assessment?
              </label>
              {hoveredField === 'agreement' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('need_support_person')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agreement"
                  value="1"
                  checked={formData.agreement === 1}
                  onChange={(e) =>
                    handleChange({ target: { name: 'agreement', value: parseInt(e.target.value) } })
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agreement"
                  value="0"
                  checked={formData.agreement === 0}
                  onChange={(e) =>
                    handleChange({ target: { name: 'agreement', value: parseInt(e.target.value) } })
                  }
                  className="mr-2"
                />
                No
              </label>
            </div>
            {errors.agreement && (
              <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>
            )}
          </div>

          {/* Description */}
          <div 
            className="col-span-full mt-4 relative"
            onMouseEnter={() => setHoveredField('description')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="block font-medium mb-1">If yes, please provide details and contact information:</label>
              {hoveredField === 'description' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('support_person_details')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              id="description"
              name="description"
              placeholder="Enter details of advocate or legal guardian"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="initial_enquiry"
        field={selectedField}
        url="logs/view"
      />
    </div>
    
  );
}