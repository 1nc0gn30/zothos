import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO,
  isSameWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, selectedDate, onDateSelect, onToggleTask, onDeleteTask }) => {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getDayTasks = (day: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.startTime);
      if (task.recurrence === 'none') return isSameDay(taskDate, day);
      if (task.recurrence === 'daily') return true;
      if (task.recurrence === 'weekly') return isSameWeek(taskDate, day);
      if (task.recurrence === 'monthly') return isSameMonth(taskDate, day);
      return false;
    });
  };

  const selectedDayTasks = React.useMemo(() => getDayTasks(selectedDate), [tasks, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayTasks = getDayTasks(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const totalLoad = dayTasks.reduce((sum, t) => sum + t.bandwidthScore, 0);

            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "h-24 md:h-32 p-2 border-r border-b border-white/5 flex flex-col items-start gap-1 transition-all hover:bg-white/[0.03] relative group",
                  !isCurrentMonth && "opacity-20",
                  isSelected && "bg-emerald-500/10"
                )}
              >
                <span className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-emerald-500 text-white" : "text-slate-400 group-hover:text-white",
                  isSelected && !isToday && "bg-white/20 text-white"
                )}>
                  {format(day, 'd')}
                </span>

                {/* Task Indicators */}
                <div className="mt-auto w-full space-y-1">
                  {dayTasks.length > 0 && (
                    <>
                      <div className="flex flex-wrap gap-1">
                        {dayTasks.slice(0, 3).map(t => (
                          <div 
                            key={t.id} 
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              t.category === 'Deep Work' ? "bg-emerald-500" :
                              t.category === 'Meetings' ? "bg-blue-500" : "bg-slate-500"
                            )} 
                          />
                        ))}
                        {dayTasks.length > 3 && <div className="text-[8px] text-slate-500">+{dayTasks.length - 3}</div>}
                      </div>
                      
                      {/* Load Bar */}
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            totalLoad > 10 ? "bg-red-500" : totalLoad > 7 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, (totalLoad / 15) * 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks for selected day */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white px-2">
          Tasks for {format(selectedDate, 'MMMM do')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={onToggleTask} 
                onDelete={onDeleteTask} 
              />
            ))
          ) : (
            <div className="col-span-2 py-8 text-center border border-dashed border-white/10 rounded-3xl text-slate-500">
              No tasks scheduled for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
