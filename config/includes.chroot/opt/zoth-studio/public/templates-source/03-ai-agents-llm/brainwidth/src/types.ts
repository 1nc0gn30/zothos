export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  category: TaskCategory;
  bandwidthScore: number; // 1-10
  status: 'pending' | 'completed';
  recurrence: RecurrenceType;
}

export type TaskCategory = 
  | 'Deep Work' 
  | 'Shallow Work' 
  | 'Meetings' 
  | 'Learning' 
  | 'Personal' 
  | 'Admin';

export interface BandwidthAnalysis {
  hour: number;
  score: number;
  isOverloaded: boolean;
}
