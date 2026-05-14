# AIプロンプト工房

ChatGPTやCodexに渡す依頼文を、作成・保存・検索・再利用するための個人用Webアプリです。

## 使い方

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## 保存方式

保存データはサーバーには送らず、各ブラウザの `localStorage` に保存します。

localStorageキー:

```text
yuki-ai-prompt-studio-data
```

## GitHubに入れないもの

- JSONバックアップ
- 実際のプロンプトデータ
- 個人情報
- APIキー
- パスワード
- `.env` ファイル
- 会社の機密情報

JSONエクスポートしたファイルには依頼文や個人メモが含まれる可能性があります。GitHubリポジトリ、`public` フォルダ、SNS、共有フォルダには置かないでください。

## GitHub Pages

このプロジェクトは GitHub Actions で `dist` を GitHub Pages に公開する構成です。

想定リポジトリ名:

```text
ai-prompt-studio
```
