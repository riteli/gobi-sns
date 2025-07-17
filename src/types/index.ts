import { type Database } from './database.types';

type Post = Database['public']['Tables']['posts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export type PostWithProfile = Post & {
  profiles: Pick<Profile, 'user_name'> | null;
};
