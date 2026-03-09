# gobi-sns

ユーザーが自身で設定した「語尾」を投稿内容に含めることを強制するSNSアプリケーションです。

## 🌐 URL
https://gobi-sns.vercel.app/

## 🛠 使用技術

- **フロントエンド:** Next.js 15 (App Router) / React 19
- **言語:** TypeScript
- **スタイリング:** Sass (CSS Modules)
- **バックエンド / BaaS:** Supabase (Auth, Database, Storage)
- **フォーム・状態管理:** react-hook-form, Zod
- **その他ライブラリ:** react-intersection-observer, react-hot-toast, react-icons

## ✨ 主な機能

- **カスタム語尾の強制バリデーション:** プロフィールで設定した語尾（10文字以内）が投稿内容に含まれていない場合、フロントエンド（Zod）とサーバーサイド（Server Actions）の両方で検証を行い、投稿をブロックする独自の制約を設けています。
- **SNS基本機能:** アカウント登録/ログイン、投稿、いいね、フォロー/アンフォロー機能。
- **無限スクロール:** `react-intersection-observer` を用いたタイムラインのページネーション。
- **プロフィール管理:** アバター画像（Supabase Storageを利用）や自己紹介文、語尾の設定・更新機能。

## 💡 技術的な工夫点

### 1. Feature-Driven Architectureの採用
コードの可読性と保守性を高めるため、`src/features` 配下に機能（`auth`, `posts`, `profile`, `account` など）ごとにディレクトリを分割しています。各機能に関連するUIパーツやカスタムフックをドメイン内にカプセル化し、コンポーネント間の密結合を防ぐ設計にしています。

### 2. Next.js App RouterとSupabaseの連携
`@supabase/ssr` を用いて、サーバー側で安全にセッションを管理しています。Middlewareによるルーティングの保護（未ログインユーザーのリダイレクト等）や、語尾チェックのロジックを含むデータ保存処理をServer Actionsに寄せることで、データの整合性を担保しています。

### 3. react-hook-formとZodによる型安全なフォーム処理
「投稿に特定の文字列（語尾）が含まれているか」というカスタムバリデーションをZodのスキーマとして定義し、`react-hook-form` と連携させることで、型安全かつリアルタイムなフォームの入力検証を実装しました。

## 📁 主要なディレクトリ構成

```text
src/
├── app/            # Next.js App Router (ルーティング・Server Actions)
├── components/     # アプリケーション全体で共通利用するUIコンポーネント
├── features/       # 機能ごとにカプセル化されたモジュール群
│   ├── account/    # アカウント設定 (語尾・アバター変更など)
│   ├── auth/       # 認証関連のロジック・UI
│   ├── posts/      # 投稿作成・タイムライン・無限スクロール
│   └── profile/    # プロフィール表示・フォロー機能
├── lib/            # SupabaseクライアントやZodスキーマなどの定義
└── styles/         # Sassの共通変数（_variables.scssなど）
