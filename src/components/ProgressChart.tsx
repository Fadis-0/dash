import React from "react";

interface ProgressChartProps {
  levels: {
    label: string;
    value: number;
    max: number;
    color: string;
  }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ levels }) => {
  return (
    <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo font-body" dir="rtl">
      <h3 className="font-display font-bold text-lg text-tk-text mb-6 text-right">تفاصيل مستويات الألعاب</h3>
      <div className="space-y-4">
        {levels.map((item, index) => {
          const percentage = Math.min((item.value / item.max) * 100, 100);
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-tk-text">{item.label}</span>
                <span className="text-tk-textSecondary">
                  المستوى {item.value} من {item.max} ({Math.round(percentage)}%)
                </span>
              </div>
              <div className="h-4 w-full bg-tk-background rounded-full border border-tk-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                    boxShadow: `inset 0 -2px 0 0 rgba(0, 0, 0, 0.15)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Radar Chart (Therapy Insights Radar Mock) */}
      <div className="mt-8 pt-6 border-t border-tk-border flex flex-col items-center">
        <h4 className="font-semibold text-sm text-tk-textSecondary mb-4">نظرة عامة على الأداء والمحاور</h4>
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Grid Circles */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E5E5" strokeWidth="2" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3" />

            {/* Axis Lines */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="#E5E5E5" strokeWidth="1.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#E5E5E5" strokeWidth="1.5" />

            {/* Filled Radar Area */}
            {(() => {
              const points = levels.slice(0, 4).map((l, i) => {
                const angle = (i * 2 * Math.PI) / 4;
                const value = Math.max(15, Math.min(40, (l.value / l.max) * 40));
                const x = 50 + value * Math.cos(angle);
                const y = 50 + value * Math.sin(angle);
                return `${x},${y}`;
              }).join(" ");
              return (
                <polygon
                  points={points}
                  fill="rgba(88, 204, 2, 0.25)"
                  stroke="#58CC02"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              );
            })()}
          </svg>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-tk-blue bg-white px-1.5 rounded border border-tk-border">الحروف</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-tk-red bg-white px-1.5 rounded border border-tk-border">النفس</div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-tk-orange bg-white px-1.5 rounded border border-tk-border">الأحجام</div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-tk-purple bg-white px-1.5 rounded border border-tk-border">الألوان</div>
        </div>
      </div>
    </div>
  );
};
