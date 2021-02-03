class Game {
    constructor(size) {
        if (size % 2 != 0) {

            return alert('Liczba kard musi byc parzysta')
        }
        this.size = size;
        this.board = this.drawBoard(size);
        this.cardsHTML = [...document.querySelectorAll('.board .card')]
        this.clickedCards = [];
        this.roundNumber = 1;
        this.playerTurn = 0;
        this.playerPoints = [0, 0];
        this.inActiveCars = 0;

        this.cardsHTML.forEach(card => card.addEventListener('click', this.cardClick.bind(this)))
        this.render();
    }

    cardClick(event) {
        const cardID = this.cardsHTML.indexOf(event.target);

        if (this.board[cardID].isActive && !this.board[cardID].isClicked) {
            if (this.clickedCards.length == 2) {
                this.clickedCards[0].isClicked = false;
                this.clickedCards[1].isClicked = false;
                this.clickedCards.length = 0;
                this.changePlayer();
            } else if (this.clickedCards.length < 2) {
                this.board[cardID].isClicked = true;
                this.clickedCards.push(this.board[cardID])

                // console.log(this.clickedCards)
                if (this.clickedCards.length == 2 && this.clickedCards[0].id === this.clickedCards[1].id) {
                    this.clickedCards[0].isActive = false;
                    this.clickedCards[1].isActive = false;
                    this.inActiveCars += 2;
                    this.clickedCards.length = 0;
                    this.playerPoints[this.playerTurn]++;
                }
            } else {

            }

            this.render(this.size, this.board, this.cardsHTML, this.roundNumber, this.playerTurn, this.playerPoints);
        }

    }

    drawBoard(size) {
        //Tablica pomocniczna przechowujaca indexy, posłuzy do losowego wybieraniea indeksów którym zostana przypisane wartości w board
        let board = [];
        let colors = ['red', 'green', 'blue', ' orange', 'yellow', 'pink', 'violet', 'olive'];
        let tmpArrayWithIndexes = []
        for (let i = 0; i < size; i++) {
            board[i] = '';
            tmpArrayWithIndexes[i] = i;
        }

        for (let i = 0; i < size / 2; i++) {
            colors[i] = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors[i].length <= 6 ? colors[i] += '0' : '#000';
            for (let j = 0; j < 2; j++) {
                let randomIndex = Math.floor(Math.random() * tmpArrayWithIndexes.length);
                board[tmpArrayWithIndexes[randomIndex]] = new Card(i, colors[i]);
                tmpArrayWithIndexes = tmpArrayWithIndexes.filter((item) =>
                    item != tmpArrayWithIndexes[randomIndex])
            }
        }
        const boardHTML = document.querySelector('.board');
        boardHTML.textContent = '';

        board.forEach(card => {
            const div = document.createElement('div');
            div.style.flexBasis = `calc(${100/(Math.sqrt(board.length))}% - 2px)`
            div.className = 'card';
            boardHTML.appendChild(div);

        });
        console.log(board);
        return board;
    }

    render(size = this.size, board = this.board, cardsHTML = this.cardsHTML, roundNumber = this.roundNumber, playerTurn = this.playerTurn, playerPoints = this.playerPoints, inActiveCars = this.inActiveCars) {
        //console.log(roundNumber);
        cardsHTML.forEach((card, index) => {
            card.dataset.key = board[index].id;

            if (board[index].isClicked) {
                card.style.backgroundImage = '';
                card.style.backgroundColor = board[index].color;

            } else {
                //card.style.backgroundColor = board[index].color;
                //card.textContent = board[index].id;
                //card.style.backgroundColor = board[index].color;
                card.style.backgroundImage = 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(0,0,0,1) 100%)';

            }


        });

        document.getElementById('round-number').textContent = roundNumber;
        document.getElementById('player-turn').textContent = playerTurn + 1;

        document.querySelectorAll('.player-score').forEach((item, index) => item.textContent = playerPoints[index]);

        if (inActiveCars == board.length) {

            document.querySelector('.board').textContent = `${playerPoints[0]==playerPoints[1] ? "REMIS" : playerPoints[0]>playerPoints[1] ? 'WYGRYWA GRACZ  1': 'WYGRYWA GRACZ  2'}`;
            document.querySelector('.board').classList.add('win')
            const btn = document.createElement('button');
            btn.textContent = 'Resetuj grę'
            btn.addEventListener('click', () => {
                const board = document.querySelector('.board');
                // const div = document.createElement('div');
                board.classList.remove('win')
                // div.className = 'card';
                board.textContent = '';
                for (let i = 0; i < size; i++) {
                    let div = document.createElement('div');
                    div.className = 'card';
                    board.appendChild(div);
                }
                this.resetGame(size)
            })

            document.querySelector('.board').appendChild(btn);
        }

    }

    changePlayer() {
        if (this.playerTurn == 1) {
            this.playerTurn = 0
            this.roundNumber++;
        } else this.playerTurn = 1
    }

    resetGame(size) {
        this.board = this.drawBoard(size);
        //this.cardsHTML.length = 0;
        this.cardsHTML = [...document.querySelectorAll('.board .card')]
        this.clickedCards = [];
        this.roundNumber = 1;
        this.playerTurn = 0;
        this.playerPoints = [0, 0];
        this.inActiveCars = 0;

        this.cardsHTML.forEach(card => card.addEventListener('click', this.cardClick.bind(this)))

        this.render();
        document.querySelector('.game-menu').classList.remove('hide');
        document.querySelector('.game-scene').classList.add('hide');
    }
}

class Card {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.isClicked = false;
        this.isActive = true; //true jesli można kliknąć jesli nie to znaczy ze już jest odgadnęta
    }
}


const cardAmountLabel = document.getElementById('board-size');
for (let i = 0; i < 8; i++) {
    let option = document.createElement('option');
    option.value = 2 ** (i + 1);
    option.textContent = 2 ** (i + 1);
    cardAmountLabel.appendChild(option);
}

document.getElementById('start-game').addEventListener('click', () => {
    const game = new Game(cardAmountLabel.value);
    document.querySelector('.game-menu').classList.add('hide');
    document.querySelector('.game-scene').classList.remove('hide');
})