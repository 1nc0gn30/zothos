import React from 'react';
import { Task, TaskCategory, RecurrenceType } from '../types';
import { estimateBandwidth, parseVoiceTask } from '../services/ai';
import { X, Loader2, Repeat, Mic, MicOff } from 'lucide-react';
import { format, addHours, startOfHour } from 'date-fns';
import { cn } from '../lib/utils';
import { playClickSound } from '../lib/audio';

interface TaskFormProps {
  onAdd: (task: Task) => void;
  onClose: () => void;
  onRateLimit: () => void;
}

const CATEGORIES: TaskCategory[] = ['Deep Work', 'Shallow Work', 'Meetings', 'Learning', 'Personal', 'Admin'];
const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onClose, onRateLimit }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<TaskCategory>('Deep Work');
  const [startTime, setStartTime] = React.useState(format(startOfHour(new Date()), "yyyy-MM-dd'T'HH:mm"));
  const [duration, setDuration] = React.useState('60');
  const [recurrence, setRecurrence] = React.useState<RecurrenceType>('none');
  const [isEstimating, setIsEstimating] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  const startListening = () => {
    playClickSound();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsEstimating(true);
      try {
        const aiTask = await parseVoiceTask(transcript);
        setTitle(aiTask.title);
        setDescription(aiTask.description);
        setCategory(aiTask.category);
        setDuration(aiTask.duration.toString());
        setRecurrence(aiTask.recurrence);
      } catch (error: any) {
        if (error.limitReached) {
          onRateLimit();
          onClose();
        } else {
          alert("Failed to parse voice command. Try again.");
        }
      } finally {
        setIsEstimating(false);
      }
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setIsEstimating(true);

    try {
      const start = new Date(startTime);
      const end = addHours(start, parseInt(duration) / 60);
      
      const bandwidthScore = await estimateBandwidth(
        title, 
        description, 
        category, 
        parseInt(duration)
      );

      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        bandwidthScore,
        status: 'pending',
        recurrence
      };

      onAdd(newTask);
      onClose();
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 id="task-form-title" className="text-xl font-semibold text-white">Create New Task</h2>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={startListening}
              className={cn(
                "p-2 rounded-full transition-all border border-white/10",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:text-white"
              )}
              title="Voice Input"
              aria-label="Voice input task description"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={() => { playClickSound(); onClose(); }} 
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Title</label>
            <input 
              id="task-title"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea 
              id="task-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[80px] text-sm"
              placeholder="Add context or notes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-cat" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <select 
                id="task-cat"
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm [&>option]:bg-slate-900"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="task-dur" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Duration (min)</label>
              <input 
                id="task-dur"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="task-recur" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Recurrence</label>
            <div className="relative">
              <select 
                id="task-recur"
                value={recurrence}
                onChange={e => setRecurrence(e.target.value as RecurrenceType)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none text-sm [&>option]:bg-slate-900"
              >
                {RECURRENCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">{opt.label}</option>)}
              </select>
              <Repeat size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="task-start" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
            <input 
              id="task-start"
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
            />
          </div>

          <button 
            disabled={isEstimating}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20"
          >
            {isEstimating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AI Estimating Bandwidth...
              </>
            ) : (
              'Add Task'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
