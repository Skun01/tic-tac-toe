
// EVENT CONTROLLER
var Event = (function(){
    const events = {};

    function on(eventName, fn){
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
    }

    function off(eventName, fn){
        if(events[eventName]){
            for(let i = 0; i < events[eventName].length; i++){
                if(events[eventName][i] === fn){
                    events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    function emit(eventName, data){
        if(events[eventName]){
            events[eventName].forEach(function (fn){
                fn(data);
            });
        }
    }

    return {
        on: on,
        off: off,
        emit: emit,
    }
})();

// PLAYING MODE

var PlayingMode = (function(){
    const playingMode = document.querySelector('.playing-mode');
    const humanMode = document.querySelector('.human-mode');
    const botMode = document.querySelector('.bot-mode');

    function choosing(){
        let eventName = this === humanMode ? 'humanMode' : botMode ? 'botMode' : '';
        
        // display human mode setting or bot mode setting
        Event.emit(eventName, playingMode);

        // make history
        Event.emit('history', 'playingMode');
    }

    // tao fuction de thuc hien back ve history
    function reBackHistory(data){
        if(data.pre === 'playingMode'){
            playingMode.style.display = 'flex';
            data.backBtn.style.display = 'none';
            HumanModeSetting.humanModeSetting.style.display = 'none';
            BotModeSetting.botModeSetting.style.display = 'none';
        }else if(data.pre === 'humanMode'){
            HumanAndHuman.humanVsHuman.style.display = 'none';
            HumanModeSetting.humanModeSetting.style.display = 'flex';
            SupportTools.extralsTool.style.display = 'none';
        }else if(data.pre === 'botMode'){
            HumanAndbot.humanVSBot.style.display = 'none';
            BotModeSetting.botModeSetting.style.display = 'flex';
            SupportTools.extralsTool.style.display = 'none';
        }
    }

    Event.on('reBack', reBackHistory);

    //gui hien thi
    humanMode.addEventListener( 'click', choosing);
    botMode.addEventListener('click', choosing);
})();


// DISPLAY MODE:

var HumanModeSetting = (function(){
    const humanModeSetting = document.querySelector('.human-mode-setting');
    const humanFightBtn = humanModeSetting.querySelector('.fight-btn')
    Event.on('humanMode', render);
    function render(playingMode){
        humanModeSetting.style.display = 'flex';
        playingMode.style.display = 'none';
    }

    // display fight table
    function renderFightSec(){
        humanModeSetting.style.display = 'none';
        Event.emit('renderFightSec', 'humanMode');

        //render extral button
        Event.emit('extralTools', '');

        // make history
        Event.emit('history', 'humanMode');
    }

    humanFightBtn.addEventListener('click', renderFightSec);
    return {
        humanModeSetting: humanModeSetting,
    }
})();



var BotModeSetting = (function(){
    const botModeSetting = document.querySelector('.bot-mode-setting');
    const botFightBtn = botModeSetting.querySelector('.fight-btn');
    Event.on('botMode', render);
    function render(playingMode){
        botModeSetting.style.display = 'flex';
        playingMode.style.display = 'none';
    }

    // display fight table
    function renderFightSec(){
        botModeSetting.style.display = 'none';
        Event.emit('renderFightSec', 'botMode');

        // render extral button
        Event.emit('extralTools', '');

        // make history
        Event.emit('history', 'botMode');
    }
    botFightBtn.addEventListener('click', renderFightSec);

    return{
        botModeSetting: botModeSetting,
    }
})();




// FIGHT GAME:

// HUMAN VS HUMAN
var HumanAndHuman = (function(){
    const humanVSHuman = document.querySelector('.human-vs-human');

    function renderFightSec(modeName){
        if(modeName === 'humanMode'){
            humanVSHuman.style.display = 'flex';
        }else if(modeName === 'botMode'){
            HumanAndbot.humanVSBot.style.display = 'flex';
        }
    }

    Event.on('renderFightSec', renderFightSec);

    return{
        humanVsHuman: humanVSHuman,
    }
})();

// HUMAN VS BOT
var HumanAndbot = (function(){
    const humanVSBot = document.querySelector('.human-vs-bot');
    
    return{
        humanVSBot: humanVSBot,
    }
})();




// SUPPORT TOOL BUTTONS
var SupportTools = (function(){
    const BtnSec = document.querySelector('.btn-sec');
    const backBtn = document.querySelector('.back-btn');
    const playingTool = document.querySelector('.playing-tool');
    const nextRoundBtn = document.querySelector('.next-round-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const historyStack = [];
    function renderBackBtn(){
        backBtn.style.display = 'block';
    }



    function addHistory(data){
        historyStack.push(data);
    }

    function reBack(){
        Event.emit('reBack', {pre: historyStack[historyStack.length - 1], backBtn: backBtn});
        historyStack.pop();
    }

    function renderExtralTools(data){
        playingTool.style.display = 'flex';
    }
    // render back button
    Event.on('humanMode', renderBackBtn);
    Event.on('botMode', renderBackBtn);

    // add previous page into stack to make history
    Event.on('history', addHistory);


    // back to  history;
    backBtn.addEventListener('click', e=>{
        reBack();
        Event.emit('resetGameTable', '');
    });

    //reset button;
    resetBtn.addEventListener('click', e=>{
        Event.emit('resetGameTable', '');
    });

    // next round button;
    nextRoundBtn.addEventListener('click', e=>{
        Event.emit('nextGame', '');
    });

    // set render extral tools
    Event.on('extralTools', renderExtralTools);
    return{
        backBtn: backBtn,
        extralsTool: playingTool,
        nextRoundBtn: nextRoundBtn,
        resetBtn: resetBtn,
    }

})();

const gameFightHvsH = (function (){
    const matrixGame = [[0,0,0], [0,0,0], [0,0,0]];
    const player1 = HumanAndHuman.humanVsHuman.querySelector('#player-1');
    const player2 = HumanAndHuman.humanVsHuman.querySelector('#player-2');
    const gameTable = HumanAndHuman.humanVsHuman.querySelector('.game-table');
    const gameResult = HumanAndHuman.humanVsHuman.querySelector('.game-table-cover')

    const player1Point = HumanAndHuman.humanVsHuman.querySelector('.point.x-icon');
    const player2Point = HumanAndHuman.humanVsHuman.querySelector('.point.o-icon');

    const cellList = HumanAndHuman.humanVsHuman.querySelectorAll('.cell');
    let playerTurn = 1;

    function checkRow(matrix){
        
    }
    function checkMatrix(matrix){

        // check row and column of matrix
       for(let i = 0; i < matrix.length; i++){
            let row = 1, col = 1;
            for(let j = 0; j < matrix[0].length; j++){
                row *= matrix[i][j];
                col *= matrix[j][i];
            }
            console.log(row, col);
            if(row === 8 || col === 8) return 'player 2';
            else if(row === 1 || col === 1) return 'player 1';
        }

        let mainDia = matrix[0][0] * matrix[1][1] * matrix[2][2];
        let secondDia = matrix[0][2] * matrix[1][1] * matrix[2][0];
        if(mainDia === 8 || secondDia === 8) return 'player 2';
        else if(mainDia === 1 || secondDia === 1) return 'player 1';

        // check if it's full table
        let isFull = true;
        for(let i = 0; i < matrix[0].length; i++){
            for(let j = 0; j < matrix.length; j++){
                if(matrix[i][j] === 0){
                    isFull = false;
                    break;
                }
            }
        }

        if(isFull) return 'tie';
        return 'none';
    }
    function maskCell(e){
        if([...e.target.classList].includes('cell') && ![...e.target.classList].includes('x-check') && ![...e.target.classList].includes('o-check')){
            let maskCheck = playerTurn === 1 ? 'x-check' : 'o-check';
            e.target.classList.add(maskCheck);
            const index = e.target.getAttribute('index');
            matrixGame[+index[0]][+index[1]] = playerTurn;

            const result = checkMatrix(matrixGame);
            if(result === 'player 1') player1Point.textContent = +player1Point.textContent + 1;
            else if(result === 'player 2') player2Point.textContent = +player2Point.textContent + 1;
            if(result != 'none'){
                gameResult.textContent = result === 'tie' ? 'it\'s a tie!' : `${result} win!`
                gameResult.style.display = 'block';
                return;
            }

            player1.classList.toggle('turn');
            player2.classList.toggle('turn');
            playerTurn = playerTurn === 1 ? 2 : 1;
        }
    }

    // reset button when click;
    Event.on('resetGameTable', resetTable);

    function resetTable(data){
        gameResult.style.display = 'none';
        cellList.forEach(function(cell){
            cell.classList.remove('x-check');
            cell.classList.remove('o-check')
        });
        
        for(let i = 0; i < matrixGame.length; i++){
            for(let j = 0; j < matrixGame[0].length; j++){
                matrixGame[i][j] = 0;
            }
        }

        player1Point.textContent = 0;
        player2Point.textContent = 0;
        playerTurn = 1;
    }
    gameTable.addEventListener('click', maskCell);

    // move to next game;
    function nextGame(data){
        cellList.forEach(function(cell){
            cell.classList.remove('x-check');
            cell.classList.remove('o-check')
        });
        for(let i = 0; i < matrixGame.length; i++){
            for(let j = 0; j < matrixGame[0].length; j++){
                matrixGame[i][j] = 0;
            }
        }
        playerTurn = (+player1Point.textContent + +player2Point.textContent)%2 === 0 ? 2 : 1;

        if(playerTurn === 2){
            player1.classList.remove('turn');
            player2.classList.add('turn');   
        }else{
            player1.classList.add('turn');
            player2.classList.remove('turn'); 
        }
        gameResult.style.display = 'none';
        
    }

    Event.on('nextGame', nextGame);
    return{
        checkMatrix: checkMatrix,
    }
})();
