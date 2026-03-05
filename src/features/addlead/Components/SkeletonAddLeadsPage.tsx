// 1️⃣ IMPORTS
import { SkeletonBase } from "@/shared/custom-ui/skeleton";

// 2️⃣ TYPE DEFINITIONS
interface SkeletonSectionBlockProps {
  colorClass: string;
  fieldCount: number;
  /** Render an extra element on the right side of the section header */
  headerExtra?: boolean;
}

// 3️⃣ CONSTANTS - None

// 4️⃣ HELPERS

/**
 * Mirrors the FormSection wrapper:
 *   colored bar | title   [optional extra]
 *   ─────────────────────────────────────
 *   4-column field grid
 */
function SkeletonSectionBlock({ colorClass, fieldCount, headerExtra = false }: SkeletonSectionBlockProps) {
  return (
    <div className="mb-14">
      {/* Header — matches FormSection header layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center">
          <div className={`w-1 h-6 ${colorClass} rounded-full mr-3 flex-shrink-0`} />
          <SkeletonBase height={22} width={220} rounded="md" />
        </div>
        {headerExtra && <SkeletonBase height={32} width={130} rounded="md" />}
      </div>

      {/* 4-column field grid — matches FormSection inner grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonBase height={12} width={90} rounded="sm" />
            <SkeletonBase height={36} width="100%" rounded="md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 5️⃣ COMPONENT DECLARATION

/**
 * SkeletonAddLeadsPage — full-page loading state for AddLeadsPage.
 *
 * Mirrors every major section in exact order:
 *   1. Page header + Auto-Generate button
 *   2. Top controls: Loan Type | Is AutoTitle | SSN + Find
 *   3. Separator
 *   4. Customer Information  (blue,    17 fields)
 *   5. Employer & Payroll   (emerald,  12 fields + add-more button)
 *   6. Bank Information     (indigo,    4 fields)
 *   7. Vehicle Information  (purple,    12 fields)
 *   8. Reference Information (orange,   2 × 4-field blocks)
 *   9. Military Status banner
 *   10. Footer buttons
 */
export function SkeletonAddLeadsPage() {
  // 1️⃣2️⃣ JSX RETURN
  return (
    <div className="min-h-screen py-4 px-2 md:py-8 md:px-4 bg-[#f8fafc]">
      <div className="max-w-[1500px] mx-auto">
        <div className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="pt-4 px-3 pb-6 md:p-12">

            {/* ── Page Header ─────────────────────────────────────────────────── */}
            <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-center">
              <div>
                <SkeletonBase height={32} width={160} rounded="md" />
                <div className="mt-1">
                  <SkeletonBase height={16} width={230} rounded="sm" />
                </div>
              </div>
              <SkeletonBase height={40} width={200} rounded="md" />
            </div>

            {/* Top Controls Row: Loan Type | Is AutoTitle | SSN Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-end">
              {/* Loan Type */}
              <div className="md:col-span-3">
                <SkeletonBase height={12} width={120} rounded="sm" />
                <div className="mt-2">
                  <SkeletonBase height={44} width="100%" rounded="md" />
                </div>
              </div>

              {/* Is AutoTitle */}
              <div className="md:col-span-3 pb-2">
                <SkeletonBase height={12} width={90} rounded="sm" />
                <div className="flex space-x-6 mt-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBase height={16} width={16} rounded="sm" />
                    <SkeletonBase height={12} width={28} rounded="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonBase height={16} width={16} rounded="sm" />
                    <SkeletonBase height={12} width={28} rounded="sm" />
                  </div>
                </div>
              </div>

              {/* SSN Search + Find button */}
              <div className="md:col-span-6">
                <SkeletonBase height={12} width={130} rounded="sm" />
                <div className="flex gap-3 mt-2">
                  <SkeletonBase height={44} className="flex-1" rounded="md" />
                  <SkeletonBase height={44} width={80} rounded="md" />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="my-12 bg-slate-100 h-px" />

            {/* Customer Information — blue bar, 17 fields */}
            <SkeletonSectionBlock colorClass="bg-blue-500" fieldCount={17} />

            {/* Employer & Payroll — emerald bar, 12 base fields + add-more button */}
            <SkeletonSectionBlock colorClass="bg-emerald-500" fieldCount={12} headerExtra />

            {/* Bank Information — indigo bar, 4 fields */}
            <SkeletonSectionBlock colorClass="bg-indigo-500" fieldCount={4} />

            {/* Vehicle Information — purple bar, 12 fields */}
            <SkeletonSectionBlock colorClass="bg-purple-500" fieldCount={12} />

            {/* Reference Information — two separate 4-field blocks */}
            <div className="mb-14 space-y-8">
              {/* Section header */}
              <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
                <div className="w-1 h-6 bg-orange-500 rounded-full mr-3 flex-shrink-0" />
                <SkeletonBase height={22} width={220} rounded="md" />
              </div>

              {/* Reference 1 */}
              <div className="space-y-4">
                <SkeletonBase height={14} width={130} rounded="sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <SkeletonBase height={12} width={80} rounded="sm" />
                      <SkeletonBase height={36} width="100%" rounded="md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference 2 */}
              <div className="space-y-4">
                <SkeletonBase height={14} width={130} rounded="sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <SkeletonBase height={12} width={80} rounded="sm" />
                      <SkeletonBase height={36} width="100%" rounded="md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Military Status Banner */}
            <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center">
                <SkeletonBase height={20} width={20} rounded="full" className="mr-3" />
                <SkeletonBase height={14} width={320} rounded="sm" />
              </div>
              <div className="bg-white px-6 py-2 rounded-lg border border-slate-200 flex space-x-8 mt-4 md:mt-0">
                <div className="flex items-center gap-2">
                  <SkeletonBase height={16} width={16} rounded="sm" />
                  <SkeletonBase height={12} width={28} rounded="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonBase height={16} width={16} rounded="sm" />
                  <SkeletonBase height={12} width={28} rounded="sm" />
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end pt-8 gap-3 border-t border-slate-100">
              <SkeletonBase height={44} width={150} rounded="lg" />
              <SkeletonBase height={44} width={120} rounded="lg" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
