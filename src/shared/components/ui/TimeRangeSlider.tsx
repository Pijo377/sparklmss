import * as React from 'react';
import { DualRangeSlider } from '@/shared/components/ui/dual-range-slider';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to format minutes to HH.MM
export const formatMinutesToTime = (minutes: number) => {
  if (minutes === 1440) return "24.00";
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440; // Handle negative and overflow
  const hours = Math.floor(normalizedMinutes / 60);
  const mins = normalizedMinutes % 60;
  const displayHours = hours.toString().padStart(2, '0');
  const displayMins = mins.toString().padStart(2, '0');
  return `${displayHours}.${displayMins}`;
};

interface TimeRangeSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const TimeRangeSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 1440,
  step = 30,
  className
}: TimeRangeSliderProps) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  const adjustTime = (index: 0 | 1, direction: 'increment' | 'decrement') => {
    const currentValue = [...localValue];
    const change = direction === 'increment' ? step : -step;
    let newValue = currentValue[index] + change;

    // Clamp to min/max
    newValue = Math.max(min, Math.min(max, newValue));

    // Update the specific value
    currentValue[index] = newValue;

    // Validation: Ensure min gap and no crossover
    if (index === 0) {
      // Adjusting start time
      if (currentValue[0] > currentValue[1] - step) {
        currentValue[0] = currentValue[1] - step;
      }
    } else {
      // Adjusting end time
      if (currentValue[1] < currentValue[0] + step) {
        currentValue[1] = currentValue[0] + step;
      }
    }

    setLocalValue(currentValue);
    onValueChange(currentValue);
  };

  return (
    <div className={cn("w-full space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100", className)}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm">Select Availability Window</span>
        </div>
      </div>

      {/* Slider */}
      <div className="px-2 py-2 relative mb-8">
        <DualRangeSlider
          value={localValue}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          minStepsBetweenThumbs={1}
          label={(val) => formatMinutesToTime(val)}
          className="my-4"
        />
        {/* Tick Marks */}
        <div className="absolute -bottom-5 left-0 w-full flex justify-between px-2 text-[10px] font-medium text-slate-400">
          <span>00.00</span>
          <span>06.00</span>
          <span>12.00</span>
          <span>18.00</span>
          <span>24.00</span>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

        {/* Start Time Control */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
          <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-1 shadow-sm h-9">
            <button
              onClick={() => adjustTime(0, 'decrement')}
              disabled={localValue[0] <= min}
              className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-blue-600 w-20 text-center">
              {formatMinutesToTime(localValue[0])}
            </span>
            <button
              onClick={() => adjustTime(0, 'increment')}
              disabled={localValue[0] >= localValue[1] - step}
              className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* End Time Control */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Time</label>
          <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-1 shadow-sm h-9">
            <button
              onClick={() => adjustTime(1, 'decrement')}
              disabled={localValue[1] <= localValue[0] + step}
              className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-blue-600 w-20 text-center">
              {formatMinutesToTime(localValue[1])}
            </span>
            <button
              onClick={() => adjustTime(1, 'increment')}
              disabled={localValue[1] >= max}
              className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeRangeSlider;
