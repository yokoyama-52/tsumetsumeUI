# 和菓子シュミレーター

和菓子の配置シミュレーションアプリケーションのUIです。

お菓子を箱に詰める体験を、ブラウザ上でシミュレーションできます。メニューからお菓子を追加し、箱の中でドラッグ＆ドロップして配置を調整できます。

## 機能

- 25種類のサンプルお菓子から選んで箱へ追加
- 箱内の空きスペースを自動で探して配置
- ドラッグ＆ドロップによる配置変更
- 1 cm 単位のグリッドへのスナップ
- お菓子同士が重なる配置の防止
- 箱のサイズ、選択数、合計金額の表示
- 自動で箱のサイズを拡大
- 箱内のお菓子をクリックで選択→削除
- 箱内のお菓子をリセット

## 技術構成

- Next.js 16
- React 19
- TypeScript
- dnd-kit
- Tailwind CSS 4
- ESLint
- Docker / Docker Compose

## はじめ方

### 必要なもの

- Node.js
- npm

### ローカルで起動する

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 本番用ビルドを確認する

```bash
npm run build
npm run start
```

### Lint を実行する

```bash
npm run lint
```

## Docker で起動する

```bash
docker compose up --build
```

起動後、[http://localhost:3000](http://localhost:3000) にアクセスしてください。

停止するには、次を実行します。

```bash
docker compose down
```

## 使い方

1. 左側のメニューからお菓子を選びます。
2. お菓子が箱内の空いている位置に追加されます。
3. 箱内のお菓子をドラッグして、好きな位置に移動します。
4. 他のお菓子と重なる場所には配置できません。
5. 画面下部で、箱のサイズ・選択数・合計金額を確認できます。

## ディレクトリ構成

```text
app/
  page.tsx          メイン画面と配置ロジック
  globals.css       画面スタイル
components/
  Button.tsx        共通ボタン
  Item.tsx          ドラッグ可能なお菓子
  MenuItem.tsx      お菓子メニュー項目
data/
  initBoxes.ts      箱の初期データ
  initItems.ts      お菓子の初期データ
public/
  images/           お菓子の画像
```

## ライセンス

このプロジェクトのライセンスは未設定です。
