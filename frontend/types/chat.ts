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
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  ragData?: DocumentData[];
  suggestions?: string[];
}