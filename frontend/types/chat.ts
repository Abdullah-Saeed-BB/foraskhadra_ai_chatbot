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
}

export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  ragData?: DocumentData[];
}