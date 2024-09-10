class Board {

    static winning_combinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
        [1, 5, 9], [3, 5, 7]             // Diagonals
      ];

    constructor(){

        this.board = {1:"", 2:"", 3:"",
                    4: "", 5: "", 6:"",
                    7: "", 8:"", 9:""}

    }
    
    GetBoard(){
        return this.board
    }

    UpdateBoard({position,symbol}){
        let valid_move = this.ValidMove(position)

        if (valid_move){  // if the position is empty

            this.board[position] = symbol
            return true

        } else {
            // invalid move
            return false
        }


    }

    ValidMove(position){
        return (this.board[position].trim() === "" && !this.CheckGameStatus())
    }

    CheckGameStatus(){

        for (let combination of Board.winning_combinations){
            // get the positions for each winning combination (ex. a = 1, b = 2, and c = 3)
            const [a,b,c] = combination

            // if position 'a' is not empty and the symbol in positions 'a' ,'b', 'c' are the same
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]){
                return this.board[a] // return the winning symbol
            }
        }

        // Check for empty spaces
        if (Object.values(this.board).includes("")){
            return false  // continue playing
        }

        return "draw" // game is a draw


    }

    ResetBoard(){
        this.board = {1:"", 2:"", 3:"",
        4: "", 5: "", 6:"",
        7: "", 8:"", 9:""}
    }
}


module.exports = Board



