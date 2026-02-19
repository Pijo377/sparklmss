import { useState } from 'react';
import TimeRangeSlider from '@/shared/components/ui/TimeRangeSlider';

export default function App() {
    const [timeRange, setTimeRange] = useState([540, 1020]); // 9:00 AM - 5:00 PM

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="w-full max-w-xl">
                <TimeRangeSlider
                    value={timeRange}
                    onValueChange={setTimeRange}
                    min={0}
                    max={1440}
                    step={30}
                />
            </div>
        </div>
    );
}
