
const shuffle = require('shuffle-array');

const CARD_LIMIT = 48
const SUIT_NAMES = ['Svärd', 'Klubba', 'Guld', 'Kopp']

const suit = (card) => Math.floor(card / 12);
const value = (card) => (card % 12);

const cardPoint = card => {
    if(card < 9) {
        return card +1;
    } else {
        return 10;
    }
}

const valueName = card => {
    const cardValue = value(card);
    if(cardValue < 9) {
        return cardValue+1;
    } else {
        switch (cardValue) {
            case 9:
                return "Knäkt";
            case 10:
                return "Riddare";
            case 11:
                return "Kung";
        }
    }
}

const displayCard = card => {
    return `${SUIT_NAMES[suit(card)]} ${valueName(card)}`;
}

const displayHand = hand => {
    hand.forEach(card => {
        console.log(displayCard(card))
    })
}

const makeDeck = () => {
    const deck = [];
    for(var i = 0; i < CARD_LIMIT; i++) {
        deck.push(i);
    }
    shuffle(deck);
    return deck
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

