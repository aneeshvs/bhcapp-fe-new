import React from 'react';
import AccordionItem from '@/src/components/AccordionItem';

interface AccordianPlanSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function AccordianPlanSection({
  sectionRef,
  title,
  isOpen,
  onToggle,
  children
}: AccordianPlanSectionProps) {
  return (
    <div ref={sectionRef}>
      <AccordionItem title={title} isOpen={isOpen} onToggle={onToggle}>
        {children}
      </AccordionItem>
    </div>
  );
}
