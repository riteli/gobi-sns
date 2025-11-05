'use client';
import { FaSearch } from 'react-icons/fa';

import { useSearchBar } from '@/features/search/hooks/useSearchBar';

import styles from './SearchBar.module.scss';

/**
 * ヘッダーに表示される検索バーコンポーネント
 */
export const SearchBar = () => {
  const { query, handleSearch, onChange } = useSearchBar();

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="投稿を検索..."
        value={query}
        onChange={onChange}
      />
      <button type="submit" className={styles.searchButton} aria-label="検索実行">
        <FaSearch size={16} />
      </button>
    </form>
  );
};
