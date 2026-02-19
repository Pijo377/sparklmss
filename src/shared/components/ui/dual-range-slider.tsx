"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface DualRangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: (value: number) => React.ReactNode;
  labelPosition?: 'top' | 'bottom';
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = 'top', ...props }, ref) => {
  const initialValue = Array.isArray(props.value) ? props.value : (Array.isArray(props.defaultValue) ? props.defaultValue : [props.min, props.max]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800">
        <SliderPrimitive.Range className="absolute h-full bg-blue-600 dark:bg-blue-400" />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            className="block h-4 w-4 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-blue-600 bg-white hover:bg-slate-50 cursor-grab active:cursor-grabbing shadow-sm z-20"
          >
            {label && (
              <span
                className={cn(
                  "absolute flex w-full justify-center",
                  labelPosition === "top" ? "-top-8" : "top-5"
                )}
              >
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shadow-sm">
                  {label(value ?? 0)}
                </span>
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  )
})
DualRangeSlider.displayName = SliderPrimitive.Root.displayName

export { DualRangeSlider }
