import React from 'react';
import AccordionItem from '@/src/components/AccordionItem';

interface SupportPlanSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function SupportPlanSection({
  sectionRef,
  title,
  isOpen,
  onToggle,
  children
}: SupportPlanSectionProps) {
  return (
    <div ref={sectionRef}>
      <AccordionItem title={title} isOpen={isOpen} onToggle={onToggle}>
        {children}
      </AccordionItem>
    </div>
  );
}
