'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import styles from './SearchBar.module.scss';

/**
 * ヘッダーに表示される検索バーコンポーネント
 */
export const SearchBar = () => {
  const router = useRouter();
  // ユーザーの入力を管理するstate
  const [query, setQuery] = useState<string>('');

  /**
   * フォーム送信時の処理
   * 入力されたキーワードをクエリパラメータとして、検索結果ページに遷移する
   */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    router.push(`/search?q=${query}`);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="投稿を検索..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <button type="submit" className={styles.searchButton} aria-label="検索実行">
        <FaSearch size={16} />
      </button>
    </form>
  );
};
