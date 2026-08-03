import React from 'react';
import AccordionItem from '@/src/components/AccordionItem';

interface AccordianPlanSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function AccordianPlanSection({
  sectionRef,
  title,
  isOpen,
  onToggle,
  children,
  className
}: AccordianPlanSectionProps) {
  return (
    <div ref={sectionRef} className={className}>
      <AccordionItem title={title} isOpen={isOpen} onToggle={onToggle}>
        {children}
      </AccordionItem>
    </div>
  );
}
