import { ProfileClient } from '@/features/profile/components/ProfileClient/ProfileClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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

  // Context用: ログインユーザー自身のいいね・フォロー情報を取得
  const [loggedInUserLikesResult, loggedInUserFollowsResult] = loggedInUser
    ? await Promise.all([
        supabase.from('likes').select('post_id').eq('user_id', loggedInUser.id),
        supabase.from('follows').select('following_id').eq('follower_id', loggedInUser.id),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ];

  const loggedInUserLikedPostIds = new Set(
    (loggedInUserLikesResult.data ?? [])
      .map((like) => like.post_id)
      .filter((id): id is number => id !== null),
  );
  const loggedInUserFollowingIds = new Set(
    (loggedInUserFollowsResult.data ?? [])
      .map((follow) => follow.following_id)
      .filter((id): id is string => id !== null),
  );

  // ページ表示用: プロフィール対象ユーザーがいいねした投稿ID一覧を取得
  const { data: likedPostObjects } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const profileUserLikedPostIds =
    likedPostObjects?.map((likedPost) => likedPost.post_id).filter((id) => id !== null) ?? [];

  // ページに必要なデータを並行取得
  const [
    profileResult,
    followingCountResult,
    followerCountResult,
    usersPostsResult,
    likedPostsResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_name, current_gobi, avatar_url')
      .eq('id', userId)
      .single(),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url), likes(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('posts')
      .select('*, profiles(user_name, avatar_url), likes(count)')
      .in('id', profileUserLikedPostIds)
      .order('created_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const followingCount = followingCountResult.count ?? 0;
  const followerCount = followerCountResult.count ?? 0;
  const usersPosts = usersPostsResult.data;
  const likedPosts = likedPostsResult.data;

  const timelineContextValue = {
    userId: loggedInUser?.id ?? null,
    likedPostIds: loggedInUserLikedPostIds,
    followingUserIds: loggedInUserFollowingIds,
  };

  if (!profile) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <ProfileClient
      userName={profile.user_name}
      currentGobi={profile.current_gobi}
      avatarUrl={profile.avatar_url}
      followingCount={followingCount}
      followerCount={followerCount}
      userPosts={usersPosts}
      likedPosts={likedPosts}
      timelineContextValue={timelineContextValue}
    />
  );
};

export default ProfilePage;
