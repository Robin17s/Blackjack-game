import { cards } from "./cards.js";
let pointsPlayer = [];
let pointsBank = [];
let isBusted = false;
let isStopped = false;
let chipsOfPlayer = 100;
let bet;
let isWon;

showScreenToMakeBet();

const playButton = document.querySelector('.playButton');
playButton.addEventListener('click', function(){
    playRoundOfGame();
});

const stopButton = document.querySelector('.stopButton');
stopButton.addEventListener('click', function(){
    playerStopsRound();
});

function playRoundOfGame(){
    if(!isBusted && !isStopped){
        pointsPlayer.push(generateRandomNumber());
        let totalPointsPlayer = returnTotalPointsPlayer();
        putPointsPlayerOnScreen(totalPointsPlayer);
        if(totalPointsPlayer === 21){
            dealerPlaysARound();
            putPointsBankOnScreen();
            endingRound();
        }
        else if(totalPointsPlayer > 21){
            isBusted = true;
            putPointsBankOnScreen();
            endingRound();
        }
    }
}

function playerStopsRound(){
    if(pointsPlayer.length >= 1){
        isStopped = true;
        dealerPlaysARound();
        putPointsBankOnScreen();
        endingRound();
    }
}

function generateRandomNumber(){
    let cardsWhoAreNotUsed = cards.filter((card) => {
        return card.isUsed === false;
    });
    let lengthOfArray = cardsWhoAreNotUsed.length;
    let randomNumber = Math.floor(Math.random() * lengthOfArray);
    cardsWhoAreNotUsed[randomNumber].isUsed = true;
    return cardsWhoAreNotUsed[randomNumber];
}

function putPointsPlayerOnScreen(totalPointsPlayer){
    let divPlayer = document.querySelector('.pointsPlayer');
    // if(divPlayer.children.length > 1){
    //     document.querySelector('.pointsPlayer p').remove();
    // }
    let cardsPlayer = document.createElement('img');
    // cardsPlayer.innerHTML = '[';
    for(let index = 0; index < pointsPlayer.length; index++){
        // if(index === pointsPlayer.length - 1){
        //     cardsPlayer.innerHTML += `${pointsPlayer[index].rank} of ${pointsPlayer[index].type}`;
        // } else{
        //     cardsPlayer.innerHTML += `${pointsPlayer[index].rank} of ${pointsPlayer[index].type}, `;
        // }
        cardsPlayer.src = pointsPlayer[index].image;
    }
    divPlayer.appendChild(cardsPlayer);

    const h3 = document.querySelectorAll('.totalPoints h3')[0];
    if(totalPointsPlayer != undefined && totalPointsPlayer != null){
        h3.innerHTML = `Total points player: ${totalPointsPlayer}`;
    } else {
        h3.innerHTML = "";
    }
    
}

function putPointsBankOnScreen(){
    let divBank = document.querySelector('.pointsBank');
    // if(divBank.children.length > 1){
    //     document.querySelector('.pointsBank p').remove();
    // }
    // let cardsBank = document.createElement('img');
    // cardsBank.innerHTML = '[';
    if(divBank.children.length === 1){
        for(let index = 0; index < pointsBank.length; index++){
            // if(index === pointsBank.length - 1){
            //     cardsBank.innerHTML += `${pointsBank[index].rank} of ${pointsBank[index].type}`;
            // } else{
            //     cardsBank.innerHTML += `${pointsBank[index].rank} of ${pointsBank[index].type}, `;
            // }
            let cardsBank = document.createElement('img');
            cardsBank.src = pointsBank[index].image;
            divBank.appendChild(cardsBank);
        }
    }
    let divReset = document.querySelector('.resetButton');
    if(divReset.children.length === 0){
        let resetButton = document.createElement('button');
        resetButton.innerHTML = 'Play another round!!';
        divReset.appendChild(resetButton);
        resetButton.addEventListener('click', function(){
            whenResetButtonIsClicked();
        });
    }

    let totalPointsBank = returnTotalPointsBank();
    const h3 = document.querySelectorAll('.totalPoints h3')[1];
    if(totalPointsBank != undefined && totalPointsBank != null && totalPointsBank != 0){
        h3.innerHTML = `Total points bank: ${totalPointsBank}`;
    } else {
        h3.innerHTML = "";
    }
}

function dealerPlaysARound(){
    let totalPointsBank = returnTotalPointsBank();
    let totalPointsPlayer = returnTotalPointsPlayer();
    while(totalPointsBank < totalPointsPlayer){
        pointsBank.push(generateRandomNumber());
        totalPointsBank = returnTotalPointsBank();
    }
}

function whenResetButtonIsClicked(){
    pointsPlayer = [];
    pointsBank = [];
    putPointsPlayerOnScreen();
    putPointsBankOnScreen();
    isBusted = false;
    isStopped = false;
    const resetButton = document.querySelector('.resetButton button');
    resetButton.remove();
    const ending = document.querySelector('.ending h2');
    ending.remove();
    document.querySelectorAll('.pointsPlayer img').forEach((item) => item.remove());
    document.querySelectorAll('.pointsBank img').forEach((item) => item.remove());
    showScreenToMakeBet();
}

function endingRound(){
    let totalPointsPlayer = returnTotalPointsPlayer();
    let totalPointsBank = returnTotalPointsBank();
    const ending = document.querySelector('.ending');
    const textInEnding = document.createElement('h2');
    if(ending.children.length === 0){
        ending.appendChild(textInEnding);
    }
    if(totalPointsPlayer > 21){
        textInEnding.innerHTML = `You are over 21 with your score of ${totalPointsPlayer}. Busted!!`;
        isWon = false;
    } else if(totalPointsPlayer === 21 && totalPointsPlayer < totalPointsBank){
        textInEnding.innerHTML = `You won the game with a score of 21! Blackjack!!`;
        isWon = true;
    } else if(totalPointsPlayer > totalPointsBank){
        textInEnding.innerHTML = `You defeated the score of the bank (${totalPointsBank}) with a score of ${totalPointsPlayer}`;
        isWon = true;
    } else if(totalPointsPlayer < totalPointsBank && totalPointsBank <= 21){
        textInEnding.innerHTML = `You lost against the score of the bank (${totalPointsBank}) with a score of ${totalPointsPlayer}`;
        isWon = false;
    } else if(totalPointsBank > 21){
        textInEnding.innerHTML = `The bank is busted with a score of ${totalPointsBank}. You won!!`;
        isWon = true;
    } else if(totalPointsBank === totalPointsPlayer){
        textInEnding.innerHTML = `Almost!! You got an equal score with the bank of ${totalPointsBank}. You lose!`;
        isWon = false;
    }
    arrangeTheBetAfterGame();
}

function returnTotalPointsBank(){
    let totalPointsBank = 0;
    if(pointsBank.length >= 1){
        pointsBank.forEach((card) => {
            if(card.rank === "jack" || card.rank === "queen" || card.rank === "king"){
                totalPointsBank += 10;
            } else{
                totalPointsBank += Number(card.rank);
            }
        });
    }
    return totalPointsBank;
}

function returnTotalPointsPlayer(){
    let totalPointsPlayer = 0
    if(pointsPlayer.length >= 1){
        pointsPlayer.forEach((card) => {
            if(card.rank === "jack" || card.rank === "queen" || card.rank === "king"){
                totalPointsPlayer += 10;
            } else{
                totalPointsPlayer += Number(card.rank);
            }
        });
    }  
    return totalPointsPlayer;
}

function showScreenToMakeBet(){
    const main = document.querySelector('main');
    const bettingScreen = document.createElement('div');
    bettingScreen.className = "bettingScreen";
    main.insertBefore(bettingScreen, document.querySelector('.buttons'));
    for(let index = 1; index < 4; index++){
        main.children[index].style.visibility = "hidden";
    }
    bettingScreen.innerHTML = `<h2>Your total amount of chips: ${chipsOfPlayer}</h2>
    <p>Minimum bet to play is 10 chips</p><p>Win and get twice the amount of chips back!!</p><label for="bet">So, how much do you want to bet?</label>
    <input type="number" name="bet" id="bet" min="10" max="${chipsOfPlayer}"/>
    <button class="startGame">Play</button>`;
    const startGame = document.querySelector(".startGame");
    startGame.addEventListener('click', function(){
        bet = document.getElementById('bet').value;
        if(bet >= 10 && bet <= chipsOfPlayer){
            for(let index = 1; index < 4; index++){
                main.children[index].style.visibility = "visible";
            }
            bettingScreen.remove();
            document.querySelector('aside h2').innerHTML = `Your bet: ${bet}`;
            chipsOfPlayer -= bet;
        }
    });
}

function arrangeTheBetAfterGame(){
    if(isWon){
        chipsOfPlayer += bet * 2;
    }
}