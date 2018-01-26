import { ReplyModel } from './reply';
import { UserModel } from './user';

export interface ThreadModel {
  category_id: number;
  title: string;
  edited: boolean;
  hidden: boolean;
  id: number;
  inserted_at: string;
  last_reply: UserModel;
  last_reply_id: number;
  locked: boolean;
  replies: ReplyModel[];
  reply_count: number;
  sticky: boolean;
  updated_at: string;
  user: UserModel;
  user_id: number;
  view_count: number;
}
