import React from 'react';
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  colorClass: string;
  children: ReactNode;
  extra?: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, colorClass, children, extra }) => (
  <div className="mb-14">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-50 gap-4">
      <div className="flex items-center">
        <div className={`w-1 h-6 ${colorClass} rounded-full mr-3`}></div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {extra}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      {children}
    </div>
  </div>
);