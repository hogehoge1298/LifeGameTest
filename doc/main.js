var SCREEN_SIZE = 500;  //キャンパスの幅
var SIDE_CELLS =  100;  //一辺のセルの数
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS;   //セルの幅
var FPS = 10;   //フレームレート
var loopTime = 1000;
var canvas;
var context;
var sedai = 0;      //何世代回ってるか

window.onload = function(){
    //ゲームの初期化と開始処理
    var field = new Array(SIDE_CELLS * SIDE_CELLS);     //フィールド情報
    var tempField = new Array(SIDE_CELLS * SIDE_CELLS); //フィールド情報を一時保存する配列
    for(var i = 0; i < field.length; i++){
        field[i] = Math.floor(Math.random() * 2);   //ランダムに生死をバラまく
    }
    canvas = document.getElementById('world');
    canvas.width = canvas.height = SCREEN_SIZE;
    var scaleRate = Math.min(window.innerWidth / SCREEN_SIZE, window.innerHeight/SCREEN_SIZE);
    canvas.style.width = canvas.style.height = SCREEN_SIZE * scaleRate + 'px';
    context = canvas.getContext('2d');
    context.fillStyle = 'rgb(211,85,149)';
    
    update(field, tempField);   //ゲームループ開始
}

//更新
function update(field, tempField){
    var n = 0;  //自身の周りにある生の数
    tempField = field.slice();  //複製
    for(var i = 0; i < tempField.length; i++)
    {
        n = 0;
        for(var s = -1; s < 2; s++){
            for(var t = -1; t < 2; t++){
                if(s==0 && t==0) continue;  //自身はカウントしない
                var c = i+s*SIDE_CELLS+t;   //チェックするセル
                if(c>=0 && c<tempField.length){
                    //左右の壁判定
                    if(c>=0 && c %SIDE_CELLS != 0 || i > c && c % SIDE_CELLS != SIDE_CELLS-1){
                        if(tempField[c]) n++;
                    }
                }
            }
        }
        if(tempField[i] && (n == 2 || n == 3)){ //自身が「生」でカウントが2か3
            field[i] = 1;   //生
        }else if(!tempField[i] && n==3){        //自身が死でカウントが3
            field[i] = 1;    //生
        }else {
            field[i] = 0;   //死
        }
    }

    draw(field);
    sedai++;
    console.log(sedai);
    setTimeout(update, 100, field, tempField);
}

//描画
function draw(field){
    context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
    for(var i = 0; i < field.length; i++){
        var x = (i%SIDE_CELLS) * CELL_SIZE;
        var y = (Math.floor(i/SIDE_CELLS) * CELL_SIZE);
        if(field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }
}