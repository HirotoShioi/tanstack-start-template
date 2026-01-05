# My App

TanStack Start を使用したフルスタック React アプリケーションです。認証機能付きの Todo アプリを実装しています。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [TanStack Start](https://tanstack.com/start) |
| ルーティング | [TanStack Router](https://tanstack.com/router) (ファイルベース) |
| 状態管理 | [TanStack Query](https://tanstack.com/query) |
| データベース | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) |
| 認証 | [Better Auth](https://www.better-auth.com/) |
| UI | [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| テスト | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |
| ビルド | [Vite](https://vite.dev/) + [Nitro](https://nitro.build/) (SSR) |

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

# データベースのマイグレーション
pnpm db:migrate
```

### 環境変数

`.env.local` ファイルに以下を設定してください：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
BETTER_AUTH_SECRET=your-secret-key
```

## 開発

### データベースの起動

Docker Compose を使用して PostgreSQL を起動します：

```bash
# データベースを起動
docker compose up -d

# データベースを停止
docker compose down
```

デフォルトの接続情報：
- ホスト: `localhost`
- ポート: `5432`
- ユーザー: `user`
- パスワード: `password`
- データベース名: `mydb`

`.env.local` の `DATABASE_URL` 例：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

### 開発サーバー

```bash
# 開発サーバーの起動 (http://localhost:3000)
pnpm dev

# TypeScript 型チェック (ウォッチモード)
pnpm watch
```

## テスト

```bash
# ユニットテスト
pnpm test

# ブラウザテスト (Playwright)
pnpm test:browser
```

## データベース

Drizzle ORM を使用してデータベースを管理します。

```bash
# スキーマからマイグレーションファイルを生成
pnpm db:generate

# マイグレーションを実行
pnpm db:migrate

# スキーマを直接データベースにプッシュ
pnpm db:push

# データベースからスキーマをプル
pnpm db:pull

# Drizzle Studio を起動
pnpm db:studio
```

スキーマは [src/db/schema.ts](src/db/schema.ts) で定義されています。

## リント & フォーマット

[Biome](https://biomejs.dev/) を使用しています。

```bash
# リント
pnpm lint

# フォーマットチェック
pnpm format

# 自動修正
pnpm fix

# すべてのチェック
pnpm check
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

Private
