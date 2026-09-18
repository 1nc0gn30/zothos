import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Task } from '../types';
import { format, startOfDay, addHours, isWithinInterval, parseISO } from 'date-fns';

interface BandwidthChartProps {
  tasks: Task[];
}

export const BandwidthChart: React.FC<BandwidthChartProps> = ({ tasks }) => {
  const data = React.useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const today = startOfDay(new Date());

    return hours.map(hour => {
      const time = addHours(today, hour);
      const activeTasks = tasks.filter(task => {
        const start = parseISO(task.startTime);
        const end = parseISO(task.endTime);
        return isWithinInterval(time, { start, end });
      });

      const totalScore = activeTasks.reduce((sum, task) => sum + task.bandwidthScore, 0);

      return {
        time: format(time, 'HH:00'),
        score: totalScore,
        displayTime: format(time, 'ha'),
      };
    });
  }, [tasks]);

  return (
    <div className="h-[300px] w-full bg-white/5 rounded-2xl p-4 border border-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="displayTime" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 15]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#10b981' }}
          />
          <ReferenceLine y={10} label={{ value: 'Limit', position: 'right', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
