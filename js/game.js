function wait(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}

class Game {
    constructor() {
        this.cpu = new CPU(1) // 0 = Noob; 1 = Pro;
        this.currentPlayerDisplay = document.querySelector('.current-player')
        this.xTemplate = document.getElementById('xTemplate')
        this.circleTemplate = document.getElementById('circleTemplate')
        this.tiles = document.querySelectorAll('.tile')
        this.tilesArray = Array.from(this.tiles)
        this.isX = true

        this.tileClicked = this.tileClicked.bind(this)
        this.restart = this.restart.bind(this)

        this.possibleCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
    }

    start() {
        this.isX = true
        this.setupTiles()
        this.updateDisplay()
    }

    restart() {
        this.tilesArray.forEach(tile => {
            Array.from(tile.children).forEach(child => {
                tile.removeChild(child)
            })
            tile.removeEventListener('click', this.tileClicked)
            tile.classList.remove('x', 'circle')
        })
        this.start()
    }

    setupTiles() {
        this.tilesArray.forEach(tile => {
            tile.addEventListener('click', this.tileClicked)
        })
    }

    tileClicked(event) {
        const tile = event.target

        if (tile.classList.contains('x') || tile.classList.contains('circle')) {
            return
        }

        if (this.isX) {
            this.isX = false

            this.updateTile(tile, 'x', 50).then(wait(500).then(() => {
                if (this.checkWin('x')) {
                    swal({
                        title: 'End Game!',
                        text: 'Player X won the game!',
                        button: 'Restart!'
                    }).then(this.restart)
                    
                } else if (this.checkDraw()) {   
                    swal({
                        title: 'End Game!',
                        text: 'Nobody won the game!',
                        button: 'Restart!'
                    }).then(this.restart)

                } else {
                    this.updateDisplay()

                    const cpuTile = this.cpu.compute()
                    this.updateTile(cpuTile, 'circle', 150).then(() => {
                        if (this.checkWin('circle')) {
                            swal({
                                title: 'End Game!',
                                text: 'Player circle won the game!',
                                button: 'Restart!'
                            }).then(this.restart)

                        } else {
                            this.isX = true
                            this.updateDisplay()
                        }
                    })
                }
            }))
        }
    }

    updateTile(tile, player, animDelay) {
        const newTileContent = player == 'x' ? this.xTemplate.cloneNode(true) : this.circleTemplate.cloneNode(true)
        newTileContent.classList.remove('display-none')
        tile.appendChild(newTileContent)
        tile.classList.add(player)

        return wait(animDelay).then(() => {
            Array.from(newTileContent.children).forEach(child => {
                child.style.strokeDashoffset = 0
            })
        })
    }

    updateDisplay() {
        console.log('blz')
        this.currentPlayerDisplay.classList.remove('x', 'cirlce')
        this.currentPlayerDisplay.classList.add(this.isX ? 'x' : 'circle')
    }

    checkWin(player) {
        return this.possibleCombinations.some(combination => {
            return combination.every(index => {
                return this.tiles[index].classList.contains(player)
            })
        })
    }

    checkDraw() {
        return this.tilesArray.every(tile => {
            return tile.classList.contains('x') || tile.classList.contains('circle')
        })
    }
}