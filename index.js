
const shuffle = require('shuffle-array');

const makeCard = (value, name, suit) => ({ value, name, suit });

function makeDeck(){
	this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Knave', 'Cavalier', 'King'];
	this.suits = ['Coins','Cups','Swords','Batons'];
	var cards = [];
    
    for( var s = 0; s < this.suits.length; s++ ) {
        for( var n = 0; n < this.names.length; n++ ) {
            cards.push( makeCard( n+1, this.names[n], this.suits[s] ) );
        }
    }

    return shuffle(cards);
}

const cardPoint = card => {
    if(card.value < 10) {
        return card.value;
    } else {
        return 10;
    }
}

const displayCard = card => {
    return `${card.suit} ${card.value}`;
}

const displayHand = hand => {
    hand.forEach(card => {
        console.log(displayCard(card))
    })
    console.log('');
}

const initializeRound = (playerCount, playerScores, playerTurn) => {
    const deck = makeDeck();
    const hands = [];
    for(var p = 0; p < playerCount; p++) {
        hands.push([]);
    }
    
    for(var i = 0; i < 7; i++) {
        for(var p = 0; p < playerCount; p++) {
            hands[p].push(deck.pop());
        }
    }
    return {
        playerCount,
        playerScores,
        hands,
        deck,
        playerTurn: 0,
        playerPhase: 'draw',
        roundClose: false,
        discardPile: [],
        timesReshuffled: 0,
    };
}

const reshuffleDiscard = (round) => {
    if (round.timesReshuffled >=3){
        round.deck = round.discardPile;
        shuffle(round.deck);
        round.discardPile = [];
        round.timesReshuffled += 1;
        return round;
    }
    else{
        round.roundClose = true;
        return round;
    }
}

const drawPhase = (round, pileToDrawFrom) => {
    const { playerTurn } = round;
    if(pileToDrawFrom === 'deck' || round.discardPile.length === 0) {
        if(round.deck.length === 0) {
            reshuffleDiscard(round);
        }
        round.hands[playerTurn].push(round.deck.pop())
    } else if (pileToDrawFrom === 'discard') {
        round.hands[playerTurn].push(round.discardPile.pop());
    }
    return round;
}

const discardPhase = (round, cardIndexToDiscard, roundClose) => {
    const { playerTurn } = round;
    const cardToDiscard = round.hands[playerTurn][cardIndexToDiscard];
    round.hands[playerTurn].splice(cardIndexToDiscard, 1);
    round.discardPile.push(cardToDiscard);
    round.roundClose = roundClose;
    return round;
}


const round = initializeRound(2, [0,0]);
console.log("Initial hand:")
displayHand(round.hands[0]);
const nextStep = drawPhase(round, 'deck');
console.log("Hand after draw:")
displayHand(nextStep.hands[0]);
const nextNextStep = discardPhase(round, 3, false);
console.log("Hand after discard:")
displayHand(nextNextStep.hands[0]);

