/* =========================================================
   api.js — NASA APOD API との通信を担当するファイル
   ---------------------------------------------------------
   ここは「データを取りに行く」係。画面の操作（DOM）は一切やらない。
   役割を分けておくと、app.js 側がすっきりします（コーディングの加点ポイント）。
   ========================================================= */

/* APIキー：まずは DEMO_KEY で動きます（1日あたりの回数制限がきつい）。
   https://api.nasa.gov/ で無料登録すると自分のキーがもらえるので、
   余裕があれば下の文字列を置き換えてください。 */
const NASA_API_KEY = "I0mtNd4IvLx3V8X0ZdTyMWduGXCl7QDQ6kfYSRaO";

const API_BASE = "https://api.nasa.gov/planetary/apod";


/**
 * パラメータから API のURLを組み立てる。
 * 例: buildUrl({ count: 5 })
 *   → https://api.nasa.gov/planetary/apod?api_key=XXX&count=5
 *
 * ヒント:
 *  - new URL(API_BASE) で URL オブジェクトを作れる
 *  - url.searchParams.set("キー", 値) でクエリを追加できる
 *  - api_key は毎回必ず付ける
 *  - 最後に url.toString() か url.href を return する
 */
function buildUrl(params = {}) {
  const url = new URL(API_BASE);

  // TODO:先把 api_key 加进去
  url.searchParams.set("api_key", NASA_API_KEY);

  // TODO:把 params 里的每个键值对也加进去
  //   提示：for (const key in params) { ... }  或  Object.entries(params)
  //   每个都用 url.searchParams.set(key, params[key])
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }
  return url.toString();
}


/**
 * 実際に fetch して JSON を返す、このファイルの心臓部。
 * すべての取得関数（今日／最近／ランダム）がこれを呼ぶ。
 *
 * ヒント:
 *  - fetch は時間がかかるので async / await を使う
 *  - const res = await fetch(url);
 *  - res.ok が false ならエラー（throw new Error(...) で投げる）
 *  - 成功したら return await res.json();
 */
async function fetchApod(params = {}) {
  const url = buildUrl(params);

  // TODO:用 try/catch 包住 fetch
  //   1) const res = await fetch(url);
  //   2) if (!res.ok) throw new Error("通信に失敗しました: " + res.status);
  //   3) return await res.json();   // ← JSON をオブジェクトに変換して返す
  //   catch 里：把错误再 throw 出去（让 app.js 去显示错误信息）
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("通信に失敗しました: " + res.status);
    return await res.json();
  } catch (error) {
    throw error;
  }
}


/* ---------------------------------------------------------
   以下は fetchApod を使い回す「窓口」関数。
   パターンが分かるよう today だけ実装例を残してあります。
   recent / random は自分で埋めてみましょう。
   --------------------------------------------------------- */

/** 今日の1枚を取得（実装例：これを参考に下の2つを書く） */
async function fetchToday() {
  // パラメータなし＝今日の画像が返ってくる
  const data = await fetchApod();
  // today は1件だけだが、画面側は「配列」で扱いたいので [ ] で包んで返す
  return [data];
}

/** 最近 count 日分を取得 */
async function fetchRecent(count = 8) {
  // TODO:fetchApod に { count } を渡して呼ぶ
  //   提示：count を渡すと配列がそのまま返ってくる（[ ] で包む必要なし）
  //   const data = await fetchApod({ count: count });
  //   return data;
  const data = await fetchApod({ count: count });
  return data;
}

/** ランダムに count 枚取得 */
async function fetchRandom(count = 8) {
  // TODO:fetchRecent とほぼ同じ。{ count } を渡すだけ。
  //   ※ APOD では count を指定すると「ランダムな日付」が返る仕様。
  const data = await fetchApod({ count: count });
  return data;
}
