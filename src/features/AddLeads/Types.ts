import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  prefix?: string;
  error?: string;
}

export interface SelectProps {
  label?: string;
  options: string[];
  prefix?: string;
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  id?: string;
}

export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  id?: string;
  error?: string;
  onDateChange?: (date: Date | undefined) => void;
  // ADD THIS LINE BELOW
  disabled?: (date: Date) => boolean; 
  defaultMonth?: Date; 
}

export interface CheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface FormSectionProps {
  title: string;
  colorClass: string;
  children: ReactNode;
  extra?: ReactNode;
}
