export interface TopicItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryIcon: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedRead: number;
  summary: string;
  solutions: string[];
  details?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags: string[];
  commands?: {
    powershell?: string;
    cmd?: string;
    bash?: string;
  };
  checklists?: string[];
  viewsCount?: number;
  helpfulness?: {
    yes: number;
    no: number;
  };
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  topicCount?: number;
}
