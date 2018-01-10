import { RepyModel } from './reply';

export interface ThreadModel {
  category_id: number;
  content: string;
  title: string;
  edited: boolean;
  id: number;
  inserted_at: string;
  last_reply: { id: number; battletag: string };
  last_reply_id: number;
  locked: boolean;
  replies: RepyModel[];
  reply_count: number;
  sticky: boolean;
  updated_at: string;
  user: { id: number; battletag: string };
  user_id: number;
  view_count: number;
}
