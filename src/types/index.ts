import { type Database } from './database.types';

export type Post = Database['public']['Tables']['posts']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type PostWithProfile = Post & {
  profiles: Pick<Profile, 'user_name' | 'avatar_url'> | null;
  likes: { count: number }[];
};
