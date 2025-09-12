import { ProfileClient } from '@/components/features/profile/ProfileClient/ProfileClient';
import { fetchUserLikedPosts, fetchUserPosts } from '@/lib/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTimelineContextValue } from '@/lib/utils';

/**
 * プロフィールページ（サーバーコンポーネント）
 * ページの表示に必要なデータをすべて取得し、クライアントコンポーネントに渡す
 */
const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser();

  const PAGE_SIZE = 10;

  const timelineContextValue = await getTimelineContextValue(supabase, loggedInUser);

  // ページに必要なデータを並行取得
  const [
    profileResult,
    followingCountResult,
    followerCountResult,
    initialUserPosts,
    initialLikedPosts,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_name, current_gobi, avatar_url')
      .eq('id', userId)
      .single(),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    fetchUserPosts(userId, 0, PAGE_SIZE),
    fetchUserLikedPosts(userId, 0, PAGE_SIZE),
  ]);

  const profile = profileResult.data;
  const followingCount = followingCountResult.count ?? 0;
  const followerCount = followerCountResult.count ?? 0;

  if (!profile) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <ProfileClient
      userId={userId}
      userName={profile.user_name}
      currentGobi={profile.current_gobi}
      avatarUrl={profile.avatar_url}
      followingCount={followingCount}
      followerCount={followerCount}
      initialUserPosts={initialUserPosts}
      initialLikedPosts={initialLikedPosts}
      timelineContextValue={timelineContextValue}
    />
  );
};

export default ProfilePage;
