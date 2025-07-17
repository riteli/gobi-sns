import { createPost } from '@/lib/actions';

/**
 * 新しい投稿を作成するフォームコンポーネント
 */
const PostForm = () => {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="content">投稿内容</label>
        <textarea name="content" id="content" placeholder="今日は何があった？" required />
      </div>
      <button type="submit">投稿する</button>
    </form>
  );
};

export default PostForm;
