import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import type { InputProps, SelectProps, DatePickerProps, CheckboxProps } from '../Types';

import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Input as ShadcnInput } from './ui/input';
import { CurrencyInput } from '@/shared/components/ui/currency-input';

export const Input: FC<InputProps & { error?: string }> = ({ label, icon, prefix, error, id, ...props }) => (
  <div className="space-y-2 w-full" id={`wrap-${id || props.name}`}>
    {label && (
      <Label
        htmlFor={id}
        className={`text-sm font-medium text-gray-700 block ${error ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>
    )}
    <div className="relative z-0">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10 pointer-events-none">{prefix}</span>}
      {icon && (
        typeof icon === 'string' ? (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] z-10 pointer-events-none">{icon}</span>
        ) : (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 flex items-center justify-center pointer-events-none">{icon}</span>
        )
      )}
      <ShadcnInput
        id={id}
        className={`custom-input !h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${(prefix || icon) ? '!pl-9' : ''} ${error
          ? 'border-red-300 bg-red-50/20 focus:ring-red-500'
          : 'border-gray-200 focus:ring-blue-500'
          }`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);


export const SelectField: FC<
  SelectProps & {
    error?: string;
    value?: string;
    loading?: boolean;
  }
> = ({
  label,
  options,
  prefix,
  placeholder,
  value,
  onValueChange,
  error,
  id,
  loading,
}) => (
    <div className="space-y-2 w-full" id={`wrap-${id}`}>
      {label && (
        <Label
          htmlFor={id}
          className={`text-sm font-medium text-gray-700 block ${error ? "text-red-500" : ""
            }`}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-20">
            {prefix}
          </span>
        )}

        <Select
          onValueChange={onValueChange}
          value={value || ""}
          disabled={loading}
        >
          <SelectTrigger
            id={id}
            className={`custom-input !h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 pr-5 ${prefix ? "!pl-7" : ""
              } ${error
                ? "border-red-300 bg-red-50/20 focus:ring-red-500"
                : "border-gray-200 focus:ring-blue-500"
              }`}
          >
            <SelectValue placeholder={placeholder || "--Select--"} />
          </SelectTrigger>

          <SelectContent className="bg-white" position="popper">
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400 pointer-events-none" />
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
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
      <div className="space-y-2 w-full" id={`wrap-${id}`}>
        {label && (
          <Label
            htmlFor={id}
            className={`text-sm font-medium text-gray-700 block ${error ? 'text-red-500' : ''}`}
          >
            {label}
          </Label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`custom-input !h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 w-full flex justify-between items-center text-left ${!date && "text-slate-400"} ${error
                ? 'border-red-300 bg-red-50/20 focus:ring-red-500'
                : 'border-gray-200 focus:ring-blue-500'
                }`}
            >
              {date ? format(date, "MM/dd/yyyy") : "MM/DD/YYYY"}
              <CalendarIcon className="text-slate-400 h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                if (d) onDateChange?.(d);
              }}
              captionLayout="dropdown"
              fromYear={1940}
              toYear={2030}
              disabled={disabled}
              defaultMonth={date || defaultMonth}
            />
          </PopoverContent>
        </Popover>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  };
const checkboxColorMap: Record<string, string> = {
  blue: 'data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500',
  purple: 'data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500',
  amber: 'data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500',
  red: 'data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500',
  indigo: 'data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500',
  emerald: 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500',
  teal: 'data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500',
  rose: 'data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500',
};

export const CheckboxField: FC<CheckboxProps> = ({ label, id, checked, onCheckedChange, color = 'blue' }) => (
  <div className="flex items-center space-x-2 group">
    <Checkbox id={id} checked={checked} onCheckedChange={(val) => onCheckedChange(!!val)} className={`w-5 h-5 border-slate-300 ${checkboxColorMap[color] || checkboxColorMap.blue}`} />
    <Label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer group-hover:text-blue-500 transition-colors">{label}</Label>
  </div>
);

export const CurrencyField: FC<
  {
    label?: string;
    id?: string;
    value: string;
    onChange: (val: string) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
  }
> = ({ label, id, value, onChange, error, placeholder, disabled }) => (
  <div className="space-y-2 w-full" id={`wrap-${id}`}>
    {label && (
      <Label
        htmlFor={id}
        className={`text-sm font-medium text-gray-700 block ${error ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>
    )}
    <CurrencyInput
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`custom-input !h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${error
        ? 'border-red-300 bg-red-50/20 focus:ring-red-500'
        : 'border-gray-200 focus:ring-blue-500'
        }`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
