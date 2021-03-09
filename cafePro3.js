const readline = require('readline');
const crypto = require('crypto');
const randomWordWikipedia = require('random-word-wikipedia');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

//質問形式のプログレスバー
const questionGauge = (progMax) => {
  return new Promise((resolve, reject) => {

    rl.question('What do you execute? ', (answer) => {
        
        let iter = 0;
        console.log(crypto.createHash('md5').update(answer).digest('hex'));

        function gaugeDisp(iter, progMax){
            if( iter!=0 ){
                //行数分上に移動。
                readline.moveCursor(process.stdout,0,-1);
                //現在位置より下を消去する
                readline.clearScreenDown(process.stdout);
            }
            let percent = (iter / progMax) * 100;
    
            console.log(answer + " ["+"#".repeat(iter)+" ".repeat(progMax-iter)+"] - " + percent.toFixed(1) + "%");
            
            iter+=1;
            if(iter!=progMax+1){
                setTimeout( gaugeDisp, 50, iter, progMax );
            }else{
                resolve();
            }
        }

        gaugeDisp(iter, progMax);
        
    })
  })
}

//wiki単語＋プログレスバー
const wikiWordGauge = (progMax) => {
    return new Promise((resolve, reject) => {
        let iter = 0;
        
        randomWordWikipedia('en', 10).then((value) => {
        
            wikiWordArr = [];
            for(let i=0; i<progMax/10; i++){
                for(let j=0; j<10; j++){
                    wikiWordArr.push(value[j])
                }
            }
            
            function gaugeDisp(iter, progMax){
                if( iter!=0 ){
                    //行数分上に移動。
                    readline.moveCursor(process.stdout,0,-2);
                    //現在位置より下を消去する
                    readline.clearScreenDown(process.stdout);
                }
                let percent = (iter / progMax) * 100;
        
                console.log(value[0] + " ["+"#".repeat(iter)+" ".repeat(progMax-iter)+"] - " + percent.toFixed(1) + "%");
                console.log(wikiWordArr[iter]);
                

                iter+=1;
                if(iter!=progMax+1){
                    setTimeout( gaugeDisp, 50, iter, progMax );
                }else{
                    //行数分上に移動。
                    readline.moveCursor(process.stdout,0,-1);
                    //現在位置より下を消去する
                    readline.clearScreenDown(process.stdout);
                    console.log(wikiWordArr[iter-2]);
                    resolve();
                }
            }
    
            gaugeDisp(iter, progMax);
    
        });
    })
}

//英数字の羅列
const stringsList = (strings, row) => {
    return new Promise((resolve, reject) => {

        let iter = 0;
        function hashDisp() {
            // 生成する文字列の長さ
            var l = strings;
            // 生成する文字列に含める文字セット
            var c = "abcdefghijklmnopqrstuvwxyz0123456789";
            var cl = c.length;
            var r = "";
            for(var i=0; i<l; i++){
                r += c[Math.floor(Math.random()*cl)];
            }
            console.log(r);
            
            iter += 1;
            if(iter!=row){
                setTimeout( hashDisp, 50, iter, strings );
            }else{
                resolve();
            }
        }

        hashDisp();
    });
}

const main = async () => {
    //質問回数
    const questionLoop = 4;
    //wiki単語プログレスバー回数
    const wikiWordLoop = 4;
    //プログレスバーの長さ
    const progressMax = 30;
    for(let i=0; i<questionLoop; i++){
        await questionGauge(progMax=progressMax);
    }
    for (let i=0; i<wikiWordLoop; i++) {
        await wikiWordGauge(progMax=progressMax);         
    }
    await stringsList(strings=100, row=20); //英数字羅列の長さと行数を指定
    console.log('Execution completed!');
    
    rl.close()
}

main()