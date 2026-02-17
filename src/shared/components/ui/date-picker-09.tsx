import { Clock8Icon } from 'lucide-react'

import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

interface TimePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
  placeholder?: string
  step?: string
  className?: string
  showLabel?: boolean
}

export const TimePicker = ({
  id = 'time-picker',
  value,
  onChange,
  label = 'Time input with start icon',
  disabled = false,
  placeholder = '08:30:00',
  step = '1',
  className = '',
  showLabel = false,
}: TimePickerProps) => {
  return (
    <div className={showLabel ? 'w-full max-w-xs space-y-2' : 'w-full'}>
      {showLabel && (
        <Label htmlFor={id}>{label}</Label>
      )}
      <div className='relative'>
        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
          <Clock8Icon className='size-4' />
          <span className='sr-only'>Time</span>
        </div>
        <Input
          type='time'
          id={id}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`peer bg-background appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${className}`}
        />
      </div>
    </div>
  )
}

export default TimePicker
