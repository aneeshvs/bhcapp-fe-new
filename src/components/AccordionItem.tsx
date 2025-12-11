'use client';
import { useState, useEffect } from 'react';
import IconPlus from "@/src/components/icon/icon-plus";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  errors?: Record<string, string[]>;
}

export default function AccordionItem({ 
  title, 
  children, 
  isOpen = false,
  onToggle 
}: AccordionItemProps) {
  const [isActive, setIsActive] = useState(isOpen);

  // Sync internal state with prop changes
  useEffect(() => {
    setIsActive(isOpen);
  }, [isOpen]);

  const toggleAccordion = () => {
    if (onToggle) {
      onToggle(); // Let the parent component handle the state
    } else {
      setIsActive(!isActive); // Fallback for uncontrolled usage
    }
  };

  return (
    <div className="mb-4 mt-4 border rounded">
      <button
        type="button"
        onClick={toggleAccordion}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 font-semibold text-xl"
      >
        {title}
        <IconPlus className={`ml-2 transition-transform ${isActive ? 'rotate-45' : ''}`} />
      </button>
      {isActive && (
        <div className="p-4 bg-white border-t">
          {children}
        </div>
      )}
    </div>
  );
}