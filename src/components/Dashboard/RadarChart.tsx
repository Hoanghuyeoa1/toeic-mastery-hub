import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export interface RadarDataPoint {
  part: string;
  score: number;
  mistakes: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="h-[320px] w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[440px] h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
            margin={{ top: 20, right: 36, bottom: 20, left: 36 }}
          >
            {/* Grid & Axis styles for high-contrast dark mode */}
            <PolarGrid stroke="#3f3f46" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="part"
              tick={{
                fill: '#e4e4e7',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#71717a"
              strokeOpacity={0.4}
              tick={{ fill: '#a1a1aa', fontSize: 10 }}
            />
            <Radar
              name="Độ thành thạo (%)"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="#3b82f6"
              fillOpacity={0.35}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const d = payload[0].payload as RadarDataPoint;
                return (
                  <div className="bg-zinc-900 text-zinc-100 p-3 rounded-xl text-xs shadow-2xl border border-zinc-800 space-y-1">
                    <p className="font-bold text-blue-400 text-sm">{d.part}</p>
                    <p className="text-zinc-300">
                      Độ thành thạo: <strong className="text-white font-mono">{d.score}%</strong>
                    </p>
                    <p className="text-rose-400 text-[11px]">
                      {d.mistakes > 0 ? `Đã ghi nhận ${d.mistakes} lỗi sai` : 'Chưa ghi nhận lỗi sai'}
                    </p>
                  </div>
                );
              }}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
