'use client'

import React, { useState, useCallback, useId, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MinutesInputProps {
    id?: string
    value?: number
    onChange?: (value: number) => void
    min?: number
    max?: number
    placeholder?: string
    disabled?: boolean
    className?: string
    step?: number
    error?: string
}

export function MinutesInput({
    id,
    value = 0,
    onChange,
    min = 0,
    max = 999,
    placeholder = '0',
    disabled = false,
    className,
    step = 1,
    error,
}: MinutesInputProps) {
    const [inputValue, setInputValue] = useState<string>(value.toString())
    const [isFocused, setIsFocused] = useState(false)
    const generatedId = useId()
    const inputId = id || generatedId

    // Sync internal state when external value changes
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toString())
        }
    }, [value, isFocused])

    const clampValue = useCallback(
        (newValue: number) => Math.min(Math.max(newValue, min), max),
        [min, max]
    )

    const updateValue = useCallback(
        (newValue: number) => {
            const clamped = clampValue(newValue)
            setInputValue(clamped.toString())
            onChange?.(clamped)
        },
        [clampValue, onChange]
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value

        // Allow user to type (even temporary invalid values like empty string or '-')
        setInputValue(val)

        const parsed = parseInt(val, 10)
        if (!isNaN(parsed)) {
            // Only fire onChange for valid numbers, but allow internal state to track user typing
            const clamped = clampValue(parsed)
            onChange?.(clamped)
        }
    }

    const handleInputBlur = () => {
        setIsFocused(false)
        const parsed = parseInt(inputValue, 10)
        if (isNaN(parsed)) {
            setInputValue(value.toString())
        } else {
            const clamped = clampValue(parsed)
            setInputValue(clamped.toString())
            onChange?.(clamped)
        }
    }

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const current = isNaN(parseInt(inputValue, 10)) ? 0 : parseInt(inputValue, 10)
        updateValue(current + step)
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const current = isNaN(parseInt(inputValue, 10)) ? 0 : parseInt(inputValue, 10)
        updateValue(current - step)
    }

    const formatTimeDisplay = (minutes: number): string => {
        if (minutes === 0) return '0m'
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
    }

    const parsedValue = parseInt(inputValue, 10)
    const isAtMin = !isNaN(parsedValue) && parsedValue <= min
    const isAtMax = !isNaN(parsedValue) && parsedValue >= max

    return (
        <div className={cn('relative flex flex-col gap-2', className)}>
            <div
                className={cn(
                    'relative flex items-center h-11 bg-white border rounded-xl transition-all duration-200 overflow-hidden',
                    error
                        ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-500/20'
                        : 'border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500',
                    disabled && 'bg-gray-50 opacity-60 cursor-not-allowed'
                )}
            >
                {/* Decrement Button */}
                <button
                    onClick={handleDecrement}
                    disabled={disabled || isAtMin}
                    type="button"
                    tabIndex={-1}
                    className={cn(
                        'flex items-center justify-center w-10 h-full border-r border-gray-100 transition-colors',
                        'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
                        'disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500'
                    )}
                >
                    <ChevronDown className="h-4 w-4" />
                </button>

                {/* Input Field */}
                <input
                    id={inputId}
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleInputBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                        'flex-1 h-full bg-transparent text-center text-sm font-semibold outline-none px-2',
                        'placeholder:text-gray-400',
                        'disabled:cursor-not-allowed text-gray-900'
                    )}
                />

                {/* Time Display Badge */}
                {!isFocused && !isNaN(parsedValue) && parsedValue > 0 && (
                    <div className="absolute right-12 flex items-center h-full pointer-events-none">
                        <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            {formatTimeDisplay(parsedValue)}
                        </div>
                    </div>
                )}

                {/* Increment Button */}
                <button
                    onClick={handleIncrement}
                    disabled={disabled || isAtMax}
                    type="button"
                    tabIndex={-1}
                    className={cn(
                        'flex items-center justify-center w-10 h-full border-l border-gray-100 transition-colors',
                        'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
                        'disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500'
                    )}
                >
                    <ChevronUp className="h-4 w-4" />
                </button>
            </div>

            {/* Real-time Max Limit Indicator */}
            {!error && !isFocused && !isNaN(parsedValue) && (
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                        Min: {min}m / Max: {max}m
                    </span>
                    {parsedValue > 0 && (
                        <span className="text-[10px] text-blue-500 font-bold uppercase">
                            Approx. {formatTimeDisplay(parsedValue)}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
