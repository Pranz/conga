
const shuffle = require('shuffle-array');

function makeCard(value, name, suit){
	this.value = value;
	this.name = name;
	this.suit = suit;
}

function makeDeck(){
	this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Knave', 'Cavalier', 'King'];
	this.suits = ['Coins','Cups','Swords','Batons'];
	var cards = [];
    
    for( var s = 0; s < this.suits.length; s++ ) {
        for( var n = 0; n < this.names.length; n++ ) {
            cards.push( new card( n+1, this.names[n], this.suits[s] ) );
        }
    }

    return shuffle(cards);
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
        playerTurn,
        roundClose: false,
        discardPile: [],
    };
}

const reshuffleDiscard = (round) => {
    round.deck = round.discardPile;
    shuffle(round.deck);
    round.discardPile = [];
    return round;
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
}

const discardPhase = (round, cardIndexToDiscard, roundClose) => {
    const { playerTurn } = round;
    const cardToDiscard = round.hands[playerTurn][cardIndexToDiscard];
    round.hands[playerTurn].remove(cardIndexToDiscard);
    round.discardPile.push(cardToDiscard);
    round.roundClose = roundClose;
}


displayHand(initializeRound(2, [0,0]).deck);

