# APOD Viewer — NASA 今日の宇宙画像

NASA の APOD（Astronomy Picture of the Day）API を使った、宇宙写真ビューアです。

> ⚠️ 提出前に、下の `TODO` 部分（氏名・工夫した点など）を自分の言葉で埋めてください。

## 作品テーマ
NASA が毎日公開している天文写真を、タブで切り替えながら閲覧できるアプリ。
気に入った写真はお気に入りに保存できる。

## 使用技術
- HTML / CSS / JavaScript（フレームワーク不使用）
- Fetch API（NASA APOD API からデータ取得・JSON パース）
- localStorage（お気に入りの保存）
- CSS アニメーション / スクロール連動のパララックス
- レスポンシブ対応・`prefers-reduced-motion` 配慮

## ファイル構成
```
nasa-apod/
├── index.html
├── css/style.css
├── js/api.js   … API 通信（データ取得）
├── js/app.js   … 画面の描画・操作
└── README.md
```

## 工夫した点
<!-- TODO: 自分が実装してみて工夫した点・苦労した点を書く -->
- （例）タブで「今日／最近／ランダム／お気に入り」を切り替えられるようにした
- （例）

## AI の活用方法
<!-- TODO: 課題ルールに従い、AIをどう使ったか正直に書く -->
- コードの骨組み（関数の分け方やファイル構成）の相談に AI を使用。
- 中身のロジックは `// TODO` として自分で実装し、理解しながら書いた。

## 動作確認の方法
ローカルサーバ上で開いてください（`fetch` はファイル直開きだと動かないことがあるため）。

VS Code の場合：拡張機能「Live Server」で `index.html` を Open with Live Server。
ターミナルの場合：このフォルダで `python3 -m http.server` を実行し、表示された
`http://localhost:8000` をブラウザで開く。

## 提出メモ
- フォルダ名・zip 名は `js_出席番号_氏名.zip` に変更する。
- `js/api.js` の `NASA_API_KEY` は DEMO_KEY のままでも動くが、回数制限がきつい。
  余裕があれば https://api.nasa.gov/ で無料キーを取得して差し替える。
