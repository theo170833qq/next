export interface FinancialDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MarketingPlan {
  title: string;
  content: string;
  hashtags: string[];
  suggestedImagePrompt: string;
}

export interface BusinessInsight {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isVisual?: boolean;
  visualData?: any; // For charts or specific widgets
}

// Supabase Types (Mock representation for structure)
export interface UserProfile {
  id: string;
  email: string;
  company_name?: string;
}