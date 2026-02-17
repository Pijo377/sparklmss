import * as React from "react"; 
import { Input } from "./input"; 
import { cn } from "@/shared/lib/utils"; 
 
export interface CurrencyInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> { 
  value?: string; 
  onChange?: (value: string) => void; 
} 
 
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>( 
  ( 
    { 
      className, 
      value = "", 
      onChange, 
      ...props 
    }, 
    ref 
  ) => { 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
      let val = e.target.value; 
      // Remove any currency symbols or commas if simpler pasting is desired 
      // This allows users to paste "$1,000.00" and get "1000.00" 
      val = val.replace(/[^0-9.]/g, ''); 
 
      // Prevent multiple decimals 
      const parts = val.split('.'); 
      if (parts.length > 2) { 
        val = parts[0] + '.' + parts.slice(1).join(''); 
      } 
 
      if (/^\d*(\.\d{0,2})?$/.test(val)) { 
        onChange?.(val); 
      } 
    }; 
 
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { 
      if (!value) { 
        onChange?.('0.00'); 
        // Check if onBlur was passed in props 
        if (props.onBlur) props.onBlur(e); 
        return; 
      } 
      const raw = value.replace(/,/g, ''); 
      const num = parseFloat(raw); 
      if (!isNaN(num)) { 
        onChange?.(num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); 
      } 
      if (props.onBlur) props.onBlur(e); 
    }; 
 
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { 
      // Strip commas on focus to make editing the number (especially decimals) easier 
      if (value) { 
        onChange?.(value.replace(/,/g, '')); 
      } 
      if (props.onFocus) props.onFocus(e); 
    }; 
 
    return ( 
      <div className="relative"> 
        <span 
          className={cn( 
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none font-medium select-none", 
            props.disabled && "opacity-50" 
          )} 
        > 
          $ 
        </span> 
        <Input 
          ref={ref} 
          type="text" 
          inputMode="decimal" 
          value={value} 
          onChange={handleChange} 
          onBlur={handleBlur} 
          onFocus={handleFocus} 
          className={cn(className, "pl-9 font-medium")} 
          {...props} 
        /> 
      </div> 
    ); 
  } 
); 
 
CurrencyInput.displayName = "CurrencyInput";  