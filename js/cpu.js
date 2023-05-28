// TODO: make the CPU predict the next move

class CPU {
    constructor(Difficulty) {
        this.Difficulty = 1 - Difficulty
    }

    getCorrectTile(className) {
        const oppositeClassName = className == 'circle' ? 'x' : 'circle'

        let hasCorrect, correctTile = false
        game.possibleCombinations.forEach(comb => {
            if (hasCorrect) {
                return    
            }

            hasCorrect = comb.every(index => {
                const tile = game.tiles[index]

                return (tile.classList.contains('x') || tile.classList.contains('circle')) ?
                    (tile.classList.contains(oppositeClassName) ? false : true) : comb.every(_index => {
                        const _tile = game.tiles[_index]

                        correctTile = _index == index ? _tile : correctTile
                        return _index == index ? true : (_tile.hasChildNodes() ? _tile.classList.contains(className) : false)
                    })
            })
        })

        return [hasCorrect, correctTile]
    }

    getRandomTile() {
        let tile
        do {
            const randomTileIndex = Math.floor(Math.random() * ((game.tiles.length - 1) + 1));
            tile = game.tiles[randomTileIndex]
        } while (tile.classList.contains('x') || tile.classList.contains('circle'))  
        return tile
    }

    compute() {
        let correctTile
        let [hasCorrectX, correctTileX] = this.getCorrectTile('x')
        let [hasCorrectCircle, correctTileCircle] = this.getCorrectTile('circle')

        const getX = () => {
            correctTile = hasCorrectX ? (
                Math.random() >= this.Difficulty ? correctTileX : this.getRandomTile()
            ) : this.getRandomTile()
        }

        if (hasCorrectCircle) {
            if (Math.random() >= this.Difficulty) {
                correctTile = correctTileCircle
            } else {
                getX()
            }
        } else {
            getX()
        }

        return correctTile
    }
}