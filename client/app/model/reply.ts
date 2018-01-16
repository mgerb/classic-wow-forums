import { UserModel } from './user';

export interface ReplyModel {
  content: string;
  edited: boolean;
  id: number;
  inserted_at: string;
  quote_id: number;
  thread_id: number;
  updated_at: string;
  user_id: number;
  user: UserModel;
}
