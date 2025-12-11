'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface ReligiousCulturalBackgroundProps {
  formData: {
    has_children_under_18?: number;
    countryOfBirth?: string;
    preferredLanguage?: string;
    religion?: string;
    otherLanguages?: string;
    culturalNeeds?: string;
    interpreterRequired?: number;
    auslanRequired?: number;      
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number } }
  ) => void;
  uuid?: string | null;
}

export default function ReligiousCulturalBackground({ formData, handleChange, uuid }: ReligiousCulturalBackgroundProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-3 border border-gray-300 rounded shadow bg-white">
      <div className="bg-gray-100 px-4 py-3">
        <h4 className="mb-4 text-lg font-semibold text-heading">RELIGIOUS / CULTURAL BACKGROUND</h4>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('has_children_under_18')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are there children under the age of 18 residing in the client’s home?</label>
              {hoveredField === 'has_children_under_18' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('has_children_under_18')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex gap-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="has_children_under_18"
                  value="1"
                  checked={formData.has_children_under_18 === 1}
                  onChange={(e) =>
                    handleChange({ target: { name: 'has_children_under_18', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">Yes</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="has_children_under_18"
                  value="0"
                  checked={formData.has_children_under_18 === 0}
                  onChange={(e) =>
                    handleChange({ target: { name: 'has_children_under_18', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">No</span>
              </label>
            </div>
          </div>

          {/* Country of Birth */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('countryOfBirth')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Country of Birth</label>
              {hoveredField === 'countryOfBirth' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('country_of_birth')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="countryOfBirth"
              placeholder="Enter country of birth"
              value={formData.countryOfBirth || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preferred Language */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('preferredLanguage')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Preferred Language</label>
              {hoveredField === 'preferredLanguage' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('preferred_language')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="preferredLanguage"
              placeholder="Enter preferred language"
              value={formData.preferredLanguage || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Religion */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('religion')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Religion</label>
              {hoveredField === 'religion' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('religion')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="religion"
              placeholder="Enter religion"
              value={formData.religion || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Other Languages */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('otherLanguages')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Other Languages</label>
              {hoveredField === 'otherLanguages' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('other_languages')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="otherLanguages"
              placeholder="List any other languages"
              value={formData.otherLanguages || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cultural Needs (Textarea) */}
          <div 
            className="mb-3 md:col-span-2 relative"
            onMouseEnter={() => setHoveredField('culturalNeeds')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Cultural Needs</label>
              {hoveredField === 'culturalNeeds' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('cultural_needs')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="culturalNeeds"
              placeholder="Describe any specific cultural needs"
              rows={3}
              value={formData.culturalNeeds || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Interpreter Required */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('interpreterRequired')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Interpreter Required</label>
              {hoveredField === 'interpreterRequired' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('interpreter_required')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex gap-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="interpreterRequired"
                  value="1"
                  checked={formData.interpreterRequired === 1}
                  onChange={(e) =>
                    handleChange({ target: { name: 'interpreterRequired', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">Yes</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="interpreterRequired"
                  value="0"
                  checked={formData.interpreterRequired === 0}
                  onChange={(e) =>
                    handleChange({ target: { name: 'interpreterRequired', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">No</span>
              </label>
            </div>
          </div>

          {/* AUSLAN Required */}
          <div 
            className="mb-3 relative"
            onMouseEnter={() => setHoveredField('auslanRequired')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">AUSLAN Required</label>
              {hoveredField === 'auslanRequired' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('auslan_required')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex gap-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="auslanRequired"
                  value="1"
                  checked={formData.auslanRequired === 1}
                  onChange={(e) =>
                    handleChange({ target: { name: 'auslanRequired', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">Yes</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="auslanRequired"
                  value="0"
                  checked={formData.auslanRequired === 0}
                  onChange={(e) =>
                    handleChange({ target: { name: 'auslanRequired', value: parseInt(e.target.value) } })
                  }
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 select-none">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="cultural_background"  // Make sure this matches your database table name
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}