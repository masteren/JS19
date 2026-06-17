/* =========================================================
   app.js — 画面の動き全部を担当するファイル
   ---------------------------------------------------------
   api.js が「データを取る係」、こちらは「画面に出す・操作に反応する係」。

   ★ おすすめの実装順（上から順に TODO を埋めると、少しずつ動きます）★
     1. 描画（カードを画面に出す）        → ① の TODO
     2. タブ切り替え                      → ② の TODO
     3. ライトボックス（拡大表示）        → ③ の TODO
     4. お気に入り（localStorage）        → ④ の TODO
     5. パララックス（背景の星が動く）    → ⑤ の TODO

   ※ api.js の TODO（fetch）を先に終わらせると、1 の確認が楽です。
   ========================================================= */


/* ---------- 状態（アプリが今持っているデータ） ---------- */
let currentItems = [];   // 今ギャラリーに表示中のデータ配列
let currentIndex = 0;    // ライトボックスで今見ている番号
const FAV_KEY = "apod_favorites";  // localStorage に保存するときのキー名


/* ---------- よく使う要素を取得（ここは完成済み） ---------- */
const $tabs    = document.getElementById("tabs");
const $gallery = document.getElementById("gallery");
const $status  = document.getElementById("status");

const $lightbox = document.getElementById("lightbox");
const $lbImg    = document.getElementById("lb-img");
const $lbTitle  = document.getElementById("lb-title");
const $lbDesc   = document.getElementById("lb-desc");
const $lbDate   = document.getElementById("lb-date");


/* ---------- 起動（ここも完成済み） ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();        // ② タブにイベントを付ける
  setupLightbox();    // ③ ライトボックスのボタンにイベントを付ける
  setupParallax();    // ⑤ スクロール連動を仕込む
  loadTab("today");   // 最初は「今日」を読み込む
});


/* =========================================================
   ① 描画：データ配列を受け取ってカードを並べる
   ========================================================= */

/** items（配列）を受け取ってギャラリーを作り直す */
function renderGallery(items) {
  currentItems = items;
  $gallery.innerHTML = "";   // いったん空にする

  if (items.length === 0) {
    $status.textContent = "表示できる画像がありません。";
    return;
  }
  $status.textContent = "";

  // TODO:items を1件ずつ取り出して createCard でカードを作り、
  //                  $gallery に追加する
  //   提示：
      items.forEach((item, index) => {
        const card = createCard(item, index);
        $gallery.appendChild(card);
      });
}

/** 1件のデータからカード要素を作って返す */
function createCard(item, index) {
  const card = document.createElement("div");
  card.className = "card";

  // APOD には画像の日(media_type:"image")と動画の日(video)がある。
  // 動画の日はサムネがないこともあるので、とりあえず image だけ考えればOK。
  // item の主なプロパティ： item.title / item.date / item.url / item.explanation

  // TODO:card.innerHTML にカードの中身を入れる（テンプレートリテラル `` を使うと楽）
  //   中身の例（class名は style.css に合わせてある）:
  card.innerHTML = `
      <img class="card-media" src="${item.url}" alt="${item.title}">
      <div class="card-body">
        <p class="card-date">${item.date}</p>
        <h3 class="card-title">${item.title}</h3>
        <button class="card-fav ${isFavorite(item.date) ? "is-fav" : ""}">
          ${isFavorite(item.date) ? "★ 保存済み" : "☆ 保存"}
        </button>
      </div>
    `;

  const favBtn = card.querySelector(".card-fav");
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(item);
    favBtn.classList.toggle("is-fav");
    favBtn.textContent = favBtn.classList.contains("is-fav") ? "★ 保存済み" : "☆ 保存";
  });

  card.addEventListener("click", () => openLightbox(index));

  return card;
}


/* =========================================================
   ② タブ切り替え
   ========================================================= */

/** タブのボタンにクリックイベントを付ける */
function setupTabs() {
  const buttons = $tabs.querySelectorAll(".tab");

  // TODO:各ボタンに click を付ける
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("is-active"))
        btn.classList.add("is-active")
        loadTab(btn.dataset.tab);
      });
    });
}

/** タブ名に応じてデータを取得 → 描画する（async） */
async function loadTab(name) {
  $status.textContent = "読み込み中…";
  $gallery.innerHTML = "";

  try {
    let items = [];

    // TODO:name によって呼ぶ関数を変える（switch か if）
      if (name === "today") {
        items = await fetchToday();
      } else if (name === "recent") {
        items = await fetchRecent(8);
      } else if (name === "random") {
        items = await fetchRandom(8);
      } else if (name === "saved") {
        items = loadFavorites();
      }

    renderGallery(items);
  } catch (err) {
    console.error(err);
    $status.textContent = "読み込みに失敗しました。時間をおいて試してください。";
  }
}


/* =========================================================
   ③ ライトボックス（クリックで拡大表示・前後めくり）
   ========================================================= */

/** 閉じる／前へ／次へ ボタンとキーボード操作を仕込む（配線） */
function setupLightbox() {
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", showPrev);
  document.getElementById("lb-next").addEventListener("click", showNext);

  // 背景（暗い部分）クリックでも閉じる
  $lightbox.addEventListener("click", (e) => {
    if (e.target === $lightbox) closeLightbox();
  });

  // キーボード：Esc=閉じる, ←=前, →=次
  document.addEventListener("keydown", (e) => {
    if (!$lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
}

/** index 番目の画像を大きく表示する */
function openLightbox(index) {
  currentIndex = index;
  const item = currentItems[index];

  // TODO:item の中身を各要素に入れる
    $lbImg.src = item.hdurl || item.url;
    $lbImg.alt = item.title;
    $lbTitle.textContent = item.title;
    $lbDate.textContent  = item.date;
    $lbDesc.textContent  = item.explanation;

  // TODO:ライトボックスを表示する
    $lightbox.classList.add("is-open");
}

/** 閉じる */
function closeLightbox() {
  // TODO:$lightbox.classList.remove("is-open");
  $lightbox.classList.remove("is-open");
}

/** 前の画像へ（最初まで行ったら最後に戻る＝ループ） */
function showPrev() {
  // TODO:currentIndex を1減らす。0より小さくなったら最後へ。
  //   提示：currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  //         そのあと openLightbox(currentIndex);
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    openLightbox(currentIndex);
}

/** 次の画像へ（最後まで行ったら最初に戻る＝ループ） */
function showNext() {
  // TODO:currentIndex を1増やす。最後を超えたら0へ。
  //   提示：currentIndex = (currentIndex + 1) % currentItems.length;
  //         そのあと openLightbox(currentIndex);
    currentIndex = (currentIndex + 1) % currentItems.length;
    openLightbox(currentIndex);
}


/* =========================================================
   ④ お気に入り（localStorage に保存して、再読み込みしても残る）
   ========================================================= */

/** 保存済みのお気に入り配列を読み出す */
function loadFavorites() {
  // TODO:localStorage から読んで、配列にして返す
  //   提示：
  //     const raw = localStorage.getItem(FAV_KEY);
  //     if (!raw) return [];          // まだ何も保存していない場合
  //     return JSON.parse(raw);       // 文字列 → 配列 に戻す
  const raw = localStorage.getItem(FAV_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

/** お気に入り配列を保存する */
function saveFavorites(list) {
  // TODO:配列を文字列にして localStorage に入れる
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

/** その日付が既にお気に入りに入っているか（true/false） */
function isFavorite(date) {
  return loadFavorites().some((fav) => fav.date === date);
}

/** お気に入りに入っていなければ追加、入っていれば削除（トグル） */
function toggleFavorite(item) {
  let list = loadFavorites();

  // TODO:item.date が既にあるか調べて、追加 or 削除する
  //   提示：
      if (isFavorite(item.date)) {
        list = list.filter((fav) => fav.date !== item.date);  // 削除
      } else {
        list.push(item);                                       // 追加
      }
      saveFavorites(list);

  // ※ 余裕があれば：カード上に「★保存」ボタン(.card-fav)を足して、
  //   ここを呼ぶと「お気に入り」タブに反映される、という流れにできます。
}


/* =========================================================
   ⑤ パララックス（スクロールすると背景の星が層ごとに違う速さで動く）
   ========================================================= */

function setupParallax() {
  const layers = document.querySelectorAll(".star-layer");

  // TODO:scroll イベントで各レイヤーを動かす
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      layers.forEach((layer) => {
        const depth = layer.dataset.depth;            // HTMLの data-depth（0.2〜0.9）
        layer.style.transform = `translateY(${y * depth}px)`;
      });
    });
  //
  //   ※ depth が小さい層ほどゆっくり動く＝奥行きが出る。
  //   ※ パフォーマンスを気にするなら requestAnimationFrame を調べてみると◎（独学の加点）。
}
