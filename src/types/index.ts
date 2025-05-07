export interface Note {
  id: string;
  text: string;
  label: string;
  created_at: string;
  user_id: string;
}

export type ThemeMode = 'light' | 'dark';