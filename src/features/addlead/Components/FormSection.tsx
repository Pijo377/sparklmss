import React from 'react';
import type { ReactNode } from "react";
import Card from '@/shared/components/ui/card';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
  icon?: ReactNode;
  borderColor?: string;
}

const colorMap: Record<string, { border200: string; border100: string; bg100: string; text500: string }> = {
  slate: { border200: 'border-slate-300', border100: 'border-slate-200', bg100: 'bg-slate-100', text500: 'text-slate-500' },
  blue: { border200: 'border-blue-300', border100: 'border-blue-200', bg100: 'bg-blue-100', text500: 'text-blue-500' },
  purple: { border200: 'border-purple-300', border100: 'border-purple-200', bg100: 'bg-purple-100', text500: 'text-purple-500' },
  emerald: { border200: 'border-emerald-300', border100: 'border-emerald-200', bg100: 'bg-emerald-100', text500: 'text-emerald-500' },
  teal: { border200: 'border-teal-300', border100: 'border-teal-200', bg100: 'bg-teal-100', text500: 'text-teal-500' },
  amber: { border200: 'border-amber-300', border100: 'border-amber-200', bg100: 'bg-amber-100', text500: 'text-amber-500' },
  red: { border200: 'border-red-300', border100: 'border-red-200', bg100: 'bg-red-100', text500: 'text-red-500' },
  indigo: { border200: 'border-indigo-300', border100: 'border-indigo-200', bg100: 'bg-indigo-100', text500: 'text-indigo-500' },
  violet: { border200: 'border-violet-300', border100: 'border-violet-200', bg100: 'bg-violet-100', text500: 'text-violet-500' },
  rose: { border200: 'border-rose-300', border100: 'border-rose-200', bg100: 'bg-rose-100', text500: 'text-rose-500' },
};

export const FormSection: React.FC<FormSectionProps> = ({ title, children, extra, icon, borderColor = 'slate' }) => {
  const c = colorMap[borderColor] || colorMap.slate;
  return (
    <div className="mb-6">
      <Card className={`p-4 ${c.border200} border`}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between mb-2 pb-2 border-b ${c.border100} gap-4`}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`${c.bg100} ${c.text500} rounded-lg p-2 shrink-0`}>
                {React.cloneElement(icon as React.ReactElement, { size: 18 })}
              </div>
            )}
            <h1 className={`text-xl font-semibold ${c.text500} shrink-0`}>
              {title}
            </h1>
          </div>
          {extra && <div className="shrink-0">{extra}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
          {children}
        </div>
      </Card>
    </div>
  );
};