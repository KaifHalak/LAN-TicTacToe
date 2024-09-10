class Player{

    constructor({username,socket}){

        this.username = username
        this.socket = socket
        this.symbol = null // X or O (assign later)
        this.wins = 0

    }

    GetPlayerID(){
        return this.socket.id
    }

    GetUsername(){
        return this.username
    }

    GetSymbol(){
        return this.symbol
    }

    GetWins(){
        return this.wins
    }

    GetSocket(){
        return this.socket
    }

    SetSymbol(symbol){
        this.symbol = symbol
    }


    JoinRoom(room_id){
        this.socket.join(room_id)
    }

    IncrementWin(){
        this.wins++
    }





}

module.exports = Player