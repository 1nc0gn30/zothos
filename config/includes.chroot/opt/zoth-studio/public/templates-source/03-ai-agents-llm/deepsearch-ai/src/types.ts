export interface SearchResult {
  summary: string;
  keywords: string[];
  dataPoints: { label: string; value: number }[];
  relatedTopics: string[];
  sources: { title: string; url: string }[];
  isMock?: boolean;
}

export interface GraphData {
  name: string;
  value: number;
}

export type ChartViewMode = 'bar' | 'pie' | 'line' | 'area';
