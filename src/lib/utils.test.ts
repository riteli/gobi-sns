import { getTimelineContextValue } from './utils';

describe('getTimelineContextValue', () => {
  test('ユーザーがnullの場合、デフォルトのContext値を返す', async () => {
    // eslint-disable-next-line
    const contextValue = await getTimelineContextValue(null as any, null);

    expect(contextValue.userId).toBe(null);
    expect(contextValue.likedPostIds).toEqual(new Set());
    expect(contextValue.followingUserIds).toEqual(new Set());
  });
});
