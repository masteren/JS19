// バニラJSで、DOM読み込み後にアラート表示
document.addEventListener("DOMContentLoaded", function () {
    alert("バニラJS")
})

// TODO: jQueryで、DOM読み込み後にアラート表示
$(function () {
    alert("DOMが読み込まれました！")
});
// TODO:DOM読み込み前の処理
alert("始まります！")
