# TanStack Start Template

TanStack Start を使用したフルスタック React アプリケーションです。認証機能付きの Todo アプリを実装しています。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [TanStack Start](https://tanstack.com/start) |
| データベース | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) |
| 認証 | [Better Auth](https://www.better-auth.com/) |
| UI | [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| テスト | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |

## セットアップ

### 必要な環境

- Node.js 20+
- pnpm
- PostgreSQL
- Docker (データベース起動用)

### インストール

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# .env.local を編集して DATABASE_URL を設定
```

### 環境変数

`.env.local` ファイルに以下を設定してください：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
BETTER_AUTH_SECRET=your-secret-key
```

## 開発


### 開発サーバー

```bash
docker compose up -d

pnpm run db:push

pnpm dev
```

## テスト

```bash
pnpm test
```

## プロジェクト構成

```
src/
├── components/     # UIコンポーネント
│   ├── todos/      # Todo関連コンポーネント
│   └── ui/         # Shadcn UIコンポーネント
├── db/             # データベース設定・スキーマ
├── integrations/   # 外部ライブラリ統合
├── lib/            # ユーティリティ・設定
├── middlewares/    # サーバー関数ミドルウェア
├── routes/         # ファイルベースルーティング
└── services/       # ビジネスロジック層
    ├── auth/       # 認証サービス
    └── todos/      # Todoサービス
```

## ビルド

```bash
# プロダクションビルド
pnpm build

# プロダクションビルドのプレビュー
pnpm preview
```

## ライセンス

MIT License