'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useSearchBar = () => {
  // ユーザーの入力を管理するstate
  const [query, setQuery] = useState<string>('');

  /**
   * フォーム送信時の処理
   * 入力されたキーワードをクエリパラメータとして、検索結果ページに遷移する
   */
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    router.push(`/search?q=${query}`);
  };

  /**
   * inputの値が変更されたときにquery stateを更新する
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return { query, handleSearch, onChange };
};
