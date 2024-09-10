class Rooms {
     constructor() {
          this.all_rooms = {}
     }

     CreateRoom({ board_object, player_object, room_id }) {
          this.all_rooms[room_id] = {
               board: board_object,

               // Index-0 of "players" - admin
               // Index-1 of "players" - friend

               players: [player_object],

               current_players_turn_index: null // store the index of the player whose turn it is (from the players array)
          } // This will be changed later to either 0 or 1

          player_object.JoinRoom(room_id)
     }

     DeleteRoom(room_id) {
          delete this.all_rooms[room_id]
     }

     FindRoomID(player_id) {
          let all_players

          for (let room of Object.keys(this.all_rooms)) {
               all_players = this.all_rooms[room].players

               for (let player of all_players) {
                    if (player_id === player.GetPlayerID()) {
                         return room
                    }
               }
          }
     }

     // Join Room

     JoinRoom({ room_id, player_object }) {
          // 0 - Room doesnt exist
          // 1 - Room is full

          let check_if_room_exists = this.CheckRoomExists(room_id)
          if (!check_if_room_exists) {
               return 0
          }

          let check_if_room_full = this.CheckRoomFull(room_id)
          if (check_if_room_full) {
               return 1
          }

          // Add player to the room
          this.all_rooms[room_id].players.push(player_object)

          // Join the player's socket to the room_id

          player_object.JoinRoom(room_id)
          return true
     }

     CheckRoomExists(room_id) {
          return room_id in this.all_rooms
     }

     CheckRoomFull(room_id) {
          return this.all_rooms[room_id].players.length === 2
     }

     // Game Related

     AssignSymbols(room_id) {
          // generate 0 or 1
          // player at the given index will be assigned X
          let x_player = Number(Math.round(Math.random()))
          let o_player

          if (x_player === 0) {
               o_player = 1
          } else {
               o_player = 0
          }

          let all_players = this.all_rooms[room_id].players
          all_players[x_player].SetSymbol("X")
          all_players[o_player].SetSymbol("O")

          this.all_rooms[room_id].current_players_turn_index = x_player
     }

     FindWinnerAndSendMsg({ room_id, winning_symbol }) {
          let all_players = this.all_rooms[room_id].players
          let socket
          for (let player of all_players) {
               socket = player.GetSocket()
               if (player.GetSymbol() === winning_symbol) {
                    player.IncrementWin()
                    socket.emit("game-status", "You Won!")
               } else {
                    socket.emit("game-status", "You Lost!")
               }
          }
     }

     SendPlayerMoveMsg(room_id) {
          let current_players_turn_index =
               this.all_rooms[room_id].current_players_turn_index
          let player, socket, other_player_index

          // Current player whose turn it is

          player = this.all_rooms[room_id].players[current_players_turn_index]
          socket = player.GetSocket()
          socket.emit("your-turn")

          if (current_players_turn_index === 0) {
               other_player_index = 1
          } else {
               other_player_index = 0
          }

          player = this.all_rooms[room_id].players[other_player_index]
          socket = player.GetSocket()
          socket.emit("opponents-turn")
     }

     // Board

     GetBoard(room_id) {
          return this.all_rooms[room_id].board.GetBoard()
     }

     UpdateBoard({ room_id, position }) {
          let board = this.all_rooms[room_id].board
          let current_players_turn_index =
               this.all_rooms[room_id].current_players_turn_index
          let symbol =
               this.all_rooms[room_id].players[
                    current_players_turn_index
               ].GetSymbol()

          let next_players_turn_index

          let flag = board.UpdateBoard({ position, symbol })

          // Invalid Move
          if (!flag) {
               return false
          }

          if (current_players_turn_index === 1) {
               next_players_turn_index = 0
          } else {
               next_players_turn_index = 1
          }

          this.all_rooms[room_id].current_players_turn_index =
               next_players_turn_index

          // Valid Move
          return true
     }

     CheckGameStatus(room_id) {
          let board = this.all_rooms[room_id].board
          return board.CheckGameStatus()
     }

     ResetBoard(room_id) {
          this.all_rooms[room_id].board.ResetBoard()
     }

     // Players

     GetCurrentPlayersTurnIndex(room_id) {
          console.log(room_id)
          console.log(this.all_rooms)
          return this.all_rooms[room_id].current_players_turn_index
     }

     GetPlayer({ room_id, index }) {
          return this.all_rooms[room_id].players[index]
     }

     GetPlayerGameData(room_id) {
          let username, symbol, wins, player_id
          let return_val = {}
          let all_players = this.all_rooms[room_id].players

          for (let player of all_players) {
               player_id = player.GetPlayerID()
               username = player.GetUsername()
               symbol = player.GetSymbol()
               wins = player.GetWins()

               return_val[player_id] = { username, symbol, wins }
          }

          // return an object with symbol and number of wins (when playing repeatedly), and username of each player

          return return_val
     }
}

module.exports = Rooms
