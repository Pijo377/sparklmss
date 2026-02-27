import { useState,useEffect } from 'react';
import type { FC } from 'react';
import { Input as ShadcnInput } from "@/features/AddLeads/Components/ui/input";
import { Label } from "@/features/AddLeads/Components/ui/label";
import { Checkbox as ShadcnCheckbox } from "@/features/AddLeads/Components/ui/checkbox";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/AddLeads/Components/ui/select";
import { Calendar } from "@/features/AddLeads/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/AddLeads/Components/ui/popover";
import { format } from "date-fns";
import type { InputProps, SelectProps, DatePickerProps, CheckboxProps } from '../Types';

export const Input: FC<InputProps & { error?: string }> = ({ label, icon, prefix, error, id, ...props }) => (
  <div className="space-y-1 w-full" id={`wrap-${id || props.name}`}>
    {label && <Label className={`text-[11px] font-bold uppercase ${error ? 'text-red-500' : 'text-slate-500'}`}>{label}</Label>}
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10">{prefix}</span>}
      {icon && <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] z-10">{icon}</span>}
      <ShadcnInput className={`custom-input border-none !h-11 ${(prefix || icon) ? '!pl-9' : ''} ${error ? 'bg-red-50/50 ring-1 ring-red-200' : ''}`} {...props} />
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium">*{error}</p>}
  </div>
);


export const SelectField: FC<SelectProps & { error?: string; value?: string }> = ({ 
  label, options, prefix, placeholder, value, onValueChange, error, id 
}) => (
  <div className="space-y-1 w-full" id={`wrap-${id}`}>
    {label && <Label className={`text-[11px] font-bold uppercase ${error ? 'text-red-500' : 'text-slate-500'}`}>{label}</Label>}
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-20">{prefix}</span>}
      {/* value={value || ""} makes it a controlled component */}
      <ShadcnSelect onValueChange={onValueChange} value={value || ""}>
        <SelectTrigger className={`custom-input border-none !h-11 ${prefix ? '!pl-7' : ''} ${error ? 'bg-red-50/50 ring-1 ring-red-200' : ''}`}>
          <SelectValue placeholder={placeholder || "--Select--"} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
        </SelectContent>
      </ShadcnSelect>
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium">*{error}</p>}
  </div>
);
// Find your DatePicker component and update it to this:
export const DatePicker: FC<DatePickerProps & { error?: string; onDateChange?: (d: string) => void; value?: any }> = 
({ label, error, onDateChange, id, disabled, defaultMonth, value }) => {
  const [date, setDate] = useState<Date | undefined>();

  // CRITICAL: This effect syncs the UI when form state changes (e.g., via Generate button)
  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);
  
  return (
    <div className="space-y-1 w-full" id={`wrap-${id}`}>
      {label && <Label className={`text-[11px] font-bold uppercase ${error ? 'text-red-500' : 'text-slate-500'}`}>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className={`custom-input border-none h-auto py-2.5 flex justify-between items-center text-left ${!date && "text-slate-400"} ${error ? 'bg-red-50/50 ring-1 ring-red-200' : ''}`}>
            {date ? format(date, "MM/dd/yyyy") : "MM/DD/YYYY"}
            <span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={(d) => { 
              setDate(d); 
              if(d) onDateChange?.(format(d, "MM/dd/yyyy")); 
            }} 
            captionLayout="dropdown" 
            fromYear={1940} 
            toYear={2030} 
            disabled={disabled}
            defaultMonth={date || defaultMonth} 
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-[10px] text-red-500 font-medium">*{error}</p>}
    </div>
  );
};export const CheckboxField: FC<CheckboxProps> = ({ label, id, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-2 group">
    <ShadcnCheckbox id={id} checked={checked} onCheckedChange={(val) => onCheckedChange(!!val)} className="w-5 h-5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" />
    <Label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer group-hover:text-blue-500 transition-colors">{label}</Label>
  </div>
);
