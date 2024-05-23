/* ----- メモ帳アプリ部分 -----*/

// グローバル変数
let count = 0;

//保存する前のプレビュー
    // FileReader
$('#input-file').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        // ファイル読み込みが完了したときの処理
        reader.onload = function(e) {
            const base64Image = e.target.result;
            $('#preview').html(`<img src="${base64Image}" alt="Image Preview" style="max-width: 100%; height: auto;">`);
        };

        // ファイルをデータURLとして読み込む
        reader.readAsDataURL(file);
    }
});

// データ格納を関数化
function displayMemo(count, description, file, date) {
    const html= `
    <div class="item" id="${count}">
        <div class="item-data-wrap">
            <p class="item-description">${description}</p>
            <p class="item-file"><img src="${file}" alt="Saved Image"></p>
            <p class="item-date">${date}</p>
        </div>
        <div class="item-btn-wrap">
            <button id="delete" class="delete-btn" data-id="${count}">delete</button>
        </div>
    </div>
    `;

    $("#storage").prepend(html);
}

// Saveボタンクリック
$("#save").on("click", function(){

    // 入力データ取得（テキスト）
    let description = $("#input-description").val();

    // 入力データ取得（ファイル）
    const file = $('#input-file')[0].files[0];
    console.log(file,"fileの中身");

    // アラート分岐
    if (file === undefined) {
        alert("ファイルを選択してください");
    }else if(description === ""){
        alert("ファイルの簡単な説明を入力してください");
    }else if(count === 99){
        alert("これ以上保存できません");
    }else{

        // 日付取得
        let date = new Date;
        let dateText = date.toLocaleString();

        // カウント
        count += 1;

        // FileReader
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;
            console.log(base64Image,"base64Imageの中身");

        //HTMLに格納（リロードするまでは追加順に並ぶのでソートは不要）
        displayMemo(count, description, base64Image, dateText);

        //保存したらクリアする
        $("#input-file").val("");
        $("#input-description").val("");
        $("#preview").html("");

        // memoオブジェクト
        const memo = {'count':count, 'description': description, 'file':base64Image, 'date': dateText};
        console.log(memo,"memo");

        // memoオブジェクトをlocalStrageに格納
        localStorage.setItem(count , JSON.stringify(memo)); 

        };
        reader.readAsDataURL(file);
    }
});

// Resetボタンクリック
$("#reset").on("click", function(){

    // 保存したらクリアと同じ
    $("#input-file").val("");
    $("#input-description").val("");
    $("#preview").html("");
});

//リロード時の動き

    // まず並び替えをする
    // Step1:全てのキーを取得
    const keys = Object.keys(localStorage);

    // Step2;キーを名前順に並び替え
    keys.sort();

    // Step3:並び替えたキーに基づいて値を取得して画面表示
    keys.forEach(key => {
        let memoData = JSON.parse(localStorage.getItem(key));
        console.log(memoData,"メモデータ確認");

        //HTMLに格納
        displayMemo(memoData.count, memoData.description, memoData.file, memoData.date);

        // countの一番大きい数字を取りたい
        console.log(count,"countは？");
        console.log(memoData.count,"メモのカウントは？");

        if ( memoData.count > count){
            count = memoData.count;
            console.log(count,"count更新後の数値");
        }
    });


// クリックしたものだけ削除
$("#storage").on("click", ".delete-btn", function(){
        
    if(!confirm("削除してもよろしいですか？")){
        return false;
    }else{

        let deleteId = $(this).data('id');
        console.log(deleteId,"deleteId取れてるか");
    
        $(`#${deleteId}`).remove();
        localStorage.removeItem(deleteId);

    }

});

/* ----- PageTop部分 -----*/
// 関数化
function PageTopAnime() {
    var scroll = $(window).scrollTop();
    if (scroll >= 600){
        $('.pagetop').removeClass('pt-down');
        $('.pagetop').addClass('pt-up');
    }else{
        if($('.pagetop').hasClass('pt-up')){
        $('.pagetop').removeClass('pt-up');
        $('.pagetop').addClass('pt-down');
        }
    }
}

$('.pagetop').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});

// 呼び出し
var windowWidth = $(window).width();
var windowSp = 768;
if (windowWidth <= windowSp) {
//横幅768px以下（スマホ）に適用させるJavaScriptを記述
    $(window).scroll(function () {
        PageTopAnime();
    });

    $(window).on('load', function () {
        PageTopAnime();
    });

} else {
//横幅768px以上（PC、タブレット）に適用させるJavaScriptを記述
    $(window).scroll(function () {
        PageTopAnime();
    });

    $(window).on('load', function () {
        PageTopAnime();
    });
}