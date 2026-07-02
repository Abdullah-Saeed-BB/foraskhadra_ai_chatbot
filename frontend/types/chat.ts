export interface DocumentData {
  id: string | number;
  title: string;
  description: string;
  category: string;
  organization: string;
  location: string;
  requirements: string;
  benefits: string;
  application_url: string;
  tags: string;
  published_at: Date;
  expires_at: Date | null;
}

export interface Message {
  id: number;
  sender: "human" | "bot";
  ar_text?: string;
  en_text: string;
  language: "ar" | "en" | "unknown";
  timestamp: Date;
  ragData?: DocumentData[];
  suggestions?: string[];
  search_filters?: {
    category?: string;
    location?: string;
  };
}