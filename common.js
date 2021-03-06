
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
  round.playerPhase = 'discard';
  return round;
}

const discardPhase = (round, cardIndexToDiscard, roundClose) => {
  const { playerTurn } = round;
  const cardToDiscard = round.hands[playerTurn][cardIndexToDiscard];
  round.hands[playerTurn].splice(cardIndexToDiscard, 1);
  round.discardPile.push(cardToDiscard);
  round.roundClose = roundClose;
  round.playerPhase = 'draw';
  round.playerTurn = (round.playerTurn + 1) % round.playerCount;
  return round;
}

const isCombinationValid = (cards) => {
  if(cards.length < 3 || cards.length > 7) {
    return false;
  }
  const sameValue = cards.every(c => c.value === cards[0].value);
  const sameSuit = cards.every(c => c.suit === cards[0].suit);
  if(sameValue) return true;
  if(sameSuit) {
    const minVal = cards.reduce((acc, card) => Math.min(acc, card.value), cards[0].value);
    const maxVal = cards.reduce((acc, card) => Math.max(acc, card.value), cards[0].value);
    if ((maxVal - minVal) === (cards.length - 1)) {
      return true;
    }
  }
  return false;
}

function powerSet(set) {
  if(set.length === 0) {
    return [[]]
  }
  const copy = set.slice();
  const removedElem = copy.pop();
  const sets = [];
  for(s of powerSet(copy)) {
    const s2 = s.slice();
    s2.push(removedElem);
    sets.push(s2);
    sets.push(s);
  }
  return sets.sort((a,b) => b.length - a.length);
}

function isClosingPossible(hand){
  const powersetOfHand = powerSet(hand);
  for (combination of powersetOfHand) {
    if (isCombinationValid(combination)) {
      const newHand  = hand.slice()
      let pointsOnHand = 0;
      removeCombinationFromHand(newHand, combination)

      for (card of newHand) {
        pointsOnHand += cardPoint(card);
      }
      if (pointsOnHand <=5) {
        return true;
      } else {
        if (isClosingPossible(newHand)) {
          return true;
        }
      }
    }
  }
  return false;
}

function removeCombinationFromHand(hand, combination) {
  for (combinationCard of combination) {
    for (handCard of hand) {
      // So that we can check different objects with the same values
      if(combinationCard.value === handCard.value && combinationCard.suit === handCard.suit) {
        hand.splice(hand.indexOf(handCard), 1)
      }
    }
  }
  return hand
}
