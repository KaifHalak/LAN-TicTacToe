const server = require("./express")
const { Server } = require("socket.io")
const io = new Server(server, {
     pingInterval: 2000,
     pingTimeout: 5000,
     cors: { origin: "*" }
})
const { v4: uuidv4 } = require("uuid")
const ROOM_ID_LEN = 5
const Board = require("./classes/board")
const Player = require("./classes/player")
const Room = require("./classes/rooms")

var ROOMS = new Room()

io.on("connection", (socket) => {
     socket.on("create-room", (username) => {
          // Check if username var is empty, if so, then assign default value
          if (!username || username.trim() === "") {
               username = "Player-1"
          }

          let player = new Player({ username, socket })
          let board = new Board()

          let room_id = GenerateRandomRoomID()

          ROOMS.CreateRoom({
               player_object: player,
               board_object: board,
               room_id
          })

          // let room_id = player.GetPlayerID()  // admin's socket id acts as the room id
          socket.emit("room-id", room_id) // send the room id to the player to share it with a friend
     })

     socket.on("join-room", ({ username, room_id }) => {
          // Check if username var is empty, if so, then assign default value
          if (!username || username.trim() === "") {
               username = "Player-2"
          }

          let player = new Player({ username, socket })

          let flag = ROOMS.JoinRoom({ room_id, player_object: player })

          switch (flag) {
               case 0: // Room doesnt exist
                    socket.emit("incorrect-room-id", "")
                    return

               case 1: // Room is full
                    socket.emit("room-is-full", "")
                    return
          }

          InitGame({ socket, room_id })

          socket.to(room_id).emit("get-board-html-ready", "")
          socket.emit("get-board-html-ready", "")
     })

     socket.on("update-board", ({ room_id, position }) => {
          console.log("socket", room_id)
          let current_players_turn_index =
               ROOMS.GetCurrentPlayersTurnIndex(room_id)

          let player = ROOMS.GetPlayer({
               room_id,
               index: current_players_turn_index
          })

          // Prevent the player from making a move when its not their turn
          if (player.GetPlayerID() !== socket.id) {
               return
          }

          let flag = ROOMS.UpdateBoard({ room_id, position })
          // false - invalid move or game is over, true - valid move
          if (!flag) {
               return
          }

          // Send board
          let board = ROOMS.GetBoard(room_id)
          socket.to(room_id).emit("board", board)
          socket.emit("board", board)

          // Change player turn
          ROOMS.SendPlayerMoveMsg(room_id)

          //Check game status

          flag = ROOMS.CheckGameStatus(room_id)
          switch (flag) {
               case "draw":
                    socket.to(room_id).emit("game-status", "Draw")
                    socket.emit("game-status", "Draw")
                    return

               case false:
                    // Continue playing
                    break

               default:
                    // Someone won, flag contains the winning symbol
                    ROOMS.FindWinnerAndSendMsg({
                         room_id,
                         winning_symbol: flag
                    })
                    return
          }
     })

     socket.on("play-again", (room_id) => {
          ROOMS.ResetBoard(room_id)
          InitGame({ room_id, socket })
     })

     socket.on("delete-room", (room_id) => {
          ROOMS.DeleteRoom(room_id)
     })

     socket.on("disconnect", () => {
          let room_id = ROOMS.FindRoomID(socket.id)
          socket.to(room_id).emit("player-disconnected")
          ROOMS.DeleteRoom(room_id)
     })
})

function InitGame({ socket, room_id }) {
     // X or O
     ROOMS.AssignSymbols(room_id)

     // return an object with symbol, number of wins (when playing repeatedly) and username of each player
     let players_data = ROOMS.GetPlayerGameData(room_id)
     socket.to(room_id).emit("players-data", players_data)
     socket.emit("players-data", players_data)

     // Send board

     let board = ROOMS.GetBoard(room_id)
     socket.to(room_id).emit("board", board)
     socket.emit("board", board)

     ROOMS.SendPlayerMoveMsg(room_id)
}

function GenerateRandomRoomID() {
     return uuidv4().substring(0, ROOM_ID_LEN)
}
