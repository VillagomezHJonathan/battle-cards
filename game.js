////////////////////////////
// Classes
////////////////////////////
class Card {
  constructor(owner) {
    const troopOptions = ['Spearmen', 'Cavalry', 'Archers']
    const randTroop = Math.floor(Math.random() * troopOptions.length)
    const randPower = Math.floor(Math.random() * 15 + 1)

    this.owner = owner
    this.cardElem = null
    this.troop = troopOptions[randTroop]
    this.power = randPower
  }

  makeCard() {
    this.cardElem = document.createElement('div')
    this.cardElem.classList.add('card')

    const name = document.createElement('p')
    name.classList.add('troop')
    name.innerText = this.troop[0]

    const power = document.createElement('p')
    power.classList.add('power')
    power.innerText = this.power

    this.cardElem.append(name)
    this.cardElem.append(power)

    return this.cardElem
  }

  getCardElem() {
    return this.cardElem
  }

  getOwner() {
    return this.owner
  }

  removeCardElem() {
    this.cardElem.remove()
  }
}

class Player {
  constructor(name, homeBase) {
    this.name = name
    this.choice = null
    this.health = 100
    this.winsArr = []
    this.cardStack = []
    this.homeBase = homeBase
  }

  getHomeBase() {
    return this.homeBase
  }

  getStackElem() {
    return this.homeBase.querySelector('.stack')
  }

  resetStackElem() {
    this.getStackElem().innerHTML = ''
  }

  getHealthBarElem() {
    return this.homeBase.querySelector('.health .bar')
  }

  getWinsStackElem() {
    return this.homeBase.querySelectorAll('.win-stack .winner')
  }

  getName() {
    return this.name
  }

  getHealth() {
    return this.health
  }

  takeDamage(amount) {
    this.health -= amount
    if (this.health <= 0) {
      this.health = 0
    }
    this.getHealthBarElem().style.width = `${this.health}%`
  }

  getChoice() {
    return this.choice
  }

  setChoice(choice) {
    this.choice = choice
  }

  resetChoice() {
    this.choice = null
  }

  removeChoiceElem() {
    this.choice.getCardElem().remove()
  }

  appendChoiceElem(destination) {
    destination.append(this.choice.getCardElem())
  }

  appendToStackElem(cardElem) {
    const stack = this.homeBase.querySelector('.stack')
    stack.append(cardElem)
  }

  pushToCardStack(card) {
    this.cardStack.push(card)
  }

  getCardStack() {
    return this.cardStack
  }

  resetCardStack() {
    this.cardStack = []
  }

  removeFromCardStack() {
    const cardStack = this.getCardStack()
    console.log()
    cardStack.splice(cardStack.indexOf(this.getChoice()), 1)
  }

  pushToWinsArr(card) {
    this.winsArr.push(card)
  }

  getWinsArr() {
    return this.winsArr
  }

  resetWinsArr() {
    this.winsArr = []
  }

  reset() {
    this.health = 100
    this.getHealthBarElem().style.width = `${this.health}%`
    this.resetWinsArr()
    this.resetStackElem()
    this.resetCardStack()
  }

  automaticChoice() {
    const cardStack = this.getCardStack()
    const randNum = Math.floor(Math.random() * cardStack.length)

    this.setChoice(cardStack[randNum])
  }
}

////////////////////////////
// Global variables
////////////////////////////
const gameCont = document.getElementById('game-container')
const mainStage = document.getElementById('main-stage')
const pauseBtn = document.getElementById('pause-btn')

const p1 = new Player('Player', document.getElementById('bottom'))
const p1ChoiceCont = document.getElementById('p1-choice')
const bottomWinStack = document
  .getElementById('bottom')
  .querySelectorAll('.win-stack .winner')

const p2 = new Player('Computer', document.getElementById('top'))
const p2ChoiceCont = document.getElementById('p2-choice')
const topWinStack = document
  .getElementById('top')
  .querySelectorAll('.win-stack .winner')

////////////////////////////
// Helper functions
////////////////////////////
const resetCardChoices = () => {
  p1.resetChoice()
  p2.resetChoice()
}

const removeCardChoicesElems = () => {
  p1.removeChoiceElem()
  p2.removeChoiceElem()
}

const choicesFilled = () => {
  return p1.getChoice() !== null && p2.getChoice() !== null
}

const clearWinStackElem = (stack) => {
  stack.forEach((div) => {
    div.innerHTML = ''
  })
}

const updateWinStackElem = (player) => {
  const stackDiv = player.getHomeBase().querySelectorAll('.win-stack .winner')
  const currentWinPos = player.getWinsArr().length - 1

  stackDiv[currentWinPos].append(player.getChoice().getCardElem())
}

const getTotalTroopDamage = (player) => {
  const winArr = player.getWinsArr()

  let total = 0

  winArr.forEach((win) => {
    total += win.power
  })

  return total
}

const resetGame = () => {
  p1.reset()
  p2.reset()
  clearWinStackElem(bottomWinStack)
  clearWinStackElem(topWinStack)
  generateCards(p1, 5)
  generateCards(p2, 5)
}

////////////////////////////
// Event listeners
////////////////////////////
const cardMouseOver = (evt, card) => {
  const cardElem = card.getCardElem()
  if (!cardElem.classList.contains('selected')) {
    cardElem.classList.add('hover')
  }
}

const cardMouseLeave = (evt, card) => {
  const cardElem = card.getCardElem()
  cardElem.classList.remove('hover')
}

const cardClick = (evt, card) => {
  const cardElem = card.getCardElem()

  if (cardElem.parentElement === p1.getStackElem()) {
    if (p1.getChoice() === null) {
      cardElem.classList.add('selected')
      p1.setChoice(card)
      p1.appendChoiceElem(p1ChoiceCont)
      p1.removeFromCardStack()
      playRound()
    }
  }
}

const dissmissBtnHandler = (evt) => {
  pauseBtn.classList.remove('hide')
  const parent = document.querySelector('.alert')
  parent.remove()
}

const restartBtnHandler = (evt) => {
  pauseBtn.classList.remove('hide')
  const parent = document.querySelector('.alert')
  resetGame()
  parent.remove()
}

const menuBtnHandler = (evt) => {
  pauseBtn.classList.remove('hide')
  const parent = document.querySelector('.alert')
  resetGame()
  window.location.href = window.origin
  parent.remove()
}

const pauseBtnHandler = (evt) => {
  generateGameOverScene()
}
pauseBtn.addEventListener('click', pauseBtnHandler)

////////////////////////////
// Scene creation functions
////////////////////////////
const generateGameOverScene = (winner = '') => {
  pauseBtn.classList.add('hide')

  const container = document.createElement('div')
  container.classList.add('alert')

  const wrapper = document.createElement('div')
  wrapper.classList.add('wrapper')

  const restartBtn = document.createElement('button')
  restartBtn.classList.add('btn')
  restartBtn.innerText = 'Restart'
  restartBtn.addEventListener('click', restartBtnHandler)

  const menuBtn = document.createElement('button')
  menuBtn.classList.add('btn')
  menuBtn.innerText = 'Main Menu'
  menuBtn.addEventListener('click', menuBtnHandler)

  const dismissBtn = document.createElement('button')
  dismissBtn.classList.add('btn')
  dismissBtn.innerText = 'Cancel'
  dismissBtn.addEventListener('click', dissmissBtnHandler)

  const inputContainer = document.createElement('div')
  inputContainer.classList.add('inputs')
  inputContainer.append(restartBtn)
  inputContainer.append(menuBtn)
  inputContainer.append(dismissBtn)

  if (winner !== '') {
    const winnerP = document.createElement('p')
    winnerP.classList.add('winner-text')
    winnerP.innerText = `${winner} is the winner!`
    wrapper.append(winnerP)
    dismissBtn.remove()
  }

  wrapper.append(inputContainer)

  container.append(wrapper)

  document.body.append(container)
}

////////////////////////////
// Game functions
////////////////////////////
const generateCards = (owner, amount) => {
  for (let i = 0; i < amount; i++) {
    const card = new Card(owner)
    owner.pushToCardStack(card)
    owner.appendToStackElem(card.makeCard())
    if (owner === p1) {
      card.getCardElem().addEventListener('mouseover', (evt) => {
        cardMouseOver(evt, card)
      })

      card.getCardElem().addEventListener('mouseleave', (evt) => {
        cardMouseLeave(evt, card)
      })

      card.getCardElem().addEventListener('click', (evt) => {
        cardClick(evt, card)
      })
    } else if (owner === p2) {
      card.getCardElem().classList.add('hide')
    }
  }
}

const checkRoundWinner = () => {
  if (choicesFilled()) {
    const p1Choice = p1.getChoice()
    const p2Choice = p2.getChoice()

    let winner = null
    if (p1Choice.troop === p2Choice.troop) {
      if (p1Choice.power === p2Choice.power) {
        winner = 'none'
      } else if (p1Choice.power > p2Choice.power) {
        winner = p1
      } else {
        winner = p2
      }
    } else if (p1Choice.troop === 'Spearmen') {
      if (p2Choice.troop === 'Cavalry') {
        winner = p1
      } else {
        winner = p2
      }
    } else if (p1Choice.troop === 'Cavalry') {
      if (p2Choice.troop === 'Archers') {
        winner = p1
      } else {
        winner = p2
      }
    } else if (p1Choice.troop === 'Archers') {
      if (p2Choice.troop === 'Spearmen') {
        winner = p1
      } else {
        winner = p2
      }
    }
    return winner
  }
}

const checkGameWinner = () => {
  let winner = null

  if (p1.getHealth() <= 0) {
    winner = p2
  } else if (p2.getHealth() <= 0) {
    winner = p1
  }

  return winner
}

const attack = () => {
  if (p1.getWinsArr().length === p1.getWinsStackElem().length) {
    const damage = getTotalTroopDamage(p1)
    p2.takeDamage(damage)
    clearWinStackElem(bottomWinStack)
    p1.resetWinsArr()
  } else if (p2.getWinsArr().length === p2.getWinsStackElem().length) {
    const damage = getTotalTroopDamage(p2)
    p1.takeDamage(damage)
    clearWinStackElem(topWinStack)
    p2.resetWinsArr()
  }
}

const playRound = () => {
  setTimeout(() => {
    computerChoice()

    if (choicesFilled()) {
      const winner = checkRoundWinner()

      setTimeout(() => {
        if (winner !== 'none') {
          winner.pushToWinsArr(winner.choice)

          if (winner.getName() === p1.getName()) {
            updateWinStackElem(p1)
            p2.removeChoiceElem()
          } else if (winner.getName() === p2.getName()) {
            updateWinStackElem(p2)
            p1.removeChoiceElem()
          }
        } else {
          removeCardChoicesElems()
        }

        p1.resetChoice()
        p2.resetChoice()
        generateCards(p1, 1)
        generateCards(p2, 1)
        attack()
        if (checkGameWinner() !== null) {
          const gameWinner = checkGameWinner().getName()
          generateGameOverScene(gameWinner)
        }
      }, 1000)
    }
  }, 500)
}

generateCards(p1, 5)
generateCards(p2, 5)

////////////////////////////
// Computer
////////////////////////////
const computerChoice = () => {
  p2.automaticChoice()
  const choiceElem = p2.getChoice().getCardElem()
  choiceElem.classList.add('selected')
  choiceElem.classList.remove('hide')

  p2.appendChoiceElem(p2ChoiceCont)
  p2.removeFromCardStack()
}
