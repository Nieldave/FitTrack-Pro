import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface ProgressChartProps {
  data: Array<{ date: string; calories: number; duration: number }>;
  type?: 'calories' | 'duration';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, type = 'calories' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-2xl">
        No workout history available yet to plot charts.
      </div>
    );
  }

  return (
    <div className="w-full h-72 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'calories' ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              name="Calories Burned (kcal)"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 4 }}
              activeDot={{ r: 6, fill: '#fb923c' }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Bar
              dataKey="duration"
              name="Duration (mins)"
              fill="#fbbf24"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
