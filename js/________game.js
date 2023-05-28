class Game {
    constructor() {
        this.CurrentPlayer = 'X'
        this.DisplayCurrentPlayer = document.querySelector('.current-player')

        this.XTemplate = document.getElementById('XTemplate')
        this.CircleTemplate = document.getElementById('CircleTemplate')

        this.Tiles = document.querySelectorAll('.tile')
        this.TilesArray = Array.from(this.Tiles)

        this.TileClicked = this.TileClicked.bind(this)

        this.CPU = new CPU(50)

        this.PossibleCombinations = [
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

    Start() {
        this.UpdateDisplay()
        this.SetupTiles()
    }

    Restart() {
        this.CurrentPlayer = 'X'
        this.TilesArray.forEach(Tile => {
            Array.from(Tile.children).forEach(Child => {
                Tile.removeChild(Child)
            })
        });
        this.Start()
    }

    TileClicked(Event) {
        const Tile = Event.target

        if (this.CurrentPlayer == 'X') {
            const NewX = this.XTemplate.cloneNode(true)
            NewX.classList.remove('display-none')
            Tile.appendChild(NewX)


            setTimeout(() => {
                NewX.children[0].style.strokeDashoffset = 0
                NewX.children[1].style.strokeDashoffset = 0
            }, 50)
        }

        
        
        if (this.CheckWin()) {
            swal({
                title: 'End Game!',
                text: 'Player ' + (this.CurrentPlayer == 'X' ? '1' : '2') + ' won the game!',
                button: 'Restart!'
            })
            this.Restart()

        } else if (this.CheckDraw()) {
            swal({
                title: 'Draw!',
                text: 'No player won the game!',
                button: 'Restart!'
            })
            this.Restart()

        } else {
            this.ChangeTurn()
            this.UpdateDisplay()

            setTimeout(() => {
                const CPUTile = this.CPU.Compute()
                    
                const NewCircle = this.CircleTemplate.cloneNode(true)
                NewCircle.classList.remove('display-none')
                CPUTile.appendChild(NewCircle)
        
                setTimeout(() => {
                    NewCircle.children[0].style.strokeDashoffset = 0

                    this.ChangeTurn()
                }, 50)

            }, 100);
        }
    }

    SetupTiles() {
        this.TilesArray.forEach(Tile => {
            Tile.addEventListener('click', this.TileClicked, {once: true})
        })
    }

    UpdateDisplay() {
        this.DisplayCurrentPlayer.classList.remove('x', 'circle')
        this.DisplayCurrentPlayer.classList.add(this.CurrentPlayer.toLowerCase())
    }

    ChangeTurn() {
        // this.CurrentPlayer = this.CurrentPlayer == 'X' ? 'Circle' : 'X'
    }

    CheckWin() {
        return this.PossibleCombinations.some(Combination => {
            return Combination.every(Index => {
                const Tile = this.Tiles[Index]

                if (Tile.hasChildNodes()) {
                    return Tile.children[0].classList.contains(this.CurrentPlayer.toLowerCase())
                }
            })
        })
    }

    CheckDraw() {
        return this.TilesArray.every(Tile => {
            if (Tile.hasChildNodes()) {
                const Child = Tile.children[0]
                return Child.classList.contains('x') || Child.classList.contains('circle')
            }
        })
    }
}