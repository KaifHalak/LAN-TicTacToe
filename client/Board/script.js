const BOARD_UI = {
     1: document.querySelector(".board-one"),
     2: document.querySelector(".board-two"),
     3: document.querySelector(".board-three"),
     4: document.querySelector(".board-four"),
     5: document.querySelector(".board-five"),
     6: document.querySelector(".board-six"),
     7: document.querySelector(".board-seven"),
     8: document.querySelector(".board-eigth"),
     9: document.querySelector(".board-nine"),
     board_container: document.querySelector(".board-container"),
     player_turn_msg: document.querySelector(".board-turn-msg-container .turn"),
     player_symbol_msg: document.querySelector(
          ".board-turn-msg-container .symbol"
     ),
     player_1_username: document.querySelector(".player1"),
     player_1_score: document.querySelector(".player1-score"),
     player_2_username: document.querySelector(".player2"),
     player_2_score: document.querySelector(".player2-score"),
     play_again: document.querySelector(".play-again-btn")
}

const socket = window.socket
let room_id = window.room_id

BoardEventListeners()
BoardSocketListeners()

function BoardSocketListeners() {
     socket.on("your-turn", () => {
          BOARD_UI.player_turn_msg.textContent = "Your Turn"
          DisableBoardStopper()
     })

     socket.on("opponents-turn", () => {
          BOARD_UI.player_turn_msg.textContent = "Opponent's Turn"
          EnableBoardStopper()
     })

     socket.on("board", (board) => {
          console.log("script board", board)
          UpdateBoard(board)
     })

     socket.on("game-status", (status) => {
          EnableBoardStopper()
          BOARD_UI.player_turn_msg.textContent = status
          BOARD_UI.play_again.classList.remove("hide")
     })

     socket.on("players-data", (players_data) => {
          BOARD_UI.play_again.classList.add("hide")

          let player_ids = Object.keys(players_data)

          BOARD_UI.player_1_username.textContent =
               players_data[player_ids[0]]["username"] + ":"
          BOARD_UI.player_2_username.textContent =
               players_data[player_ids[1]]["username"] + ":"

          BOARD_UI.player_1_score.textContent =
               players_data[player_ids[0]]["wins"]
          BOARD_UI.player_2_score.textContent =
               players_data[player_ids[1]]["wins"]

          if (player_ids[0] === socket.id) {
               BOARD_UI.player_symbol_msg.textContent = `You are ${
                    players_data[player_ids[0]]["symbol"]
               }`
          } else {
               BOARD_UI.player_symbol_msg.textContent = `You are ${
                    players_data[player_ids[1]]["symbol"]
               }`
          }
     })

     socket.on("player-disconnected", () => {
          alert("A player disconnected")
          window.location.reload()
     })

     socket.on("test", (a) => {
          console.log(a)
     })
}

function BoardEventListeners() {
     for (let i = 1; i < 10; i++) {
          BOARD_UI[i].addEventListener("click", () => {
               room_id = window.room_id
               socket.emit("update-board", { room_id, position: i })
          })
     }

     BOARD_UI.play_again.addEventListener("click", () => {
          room_id = window.room_id
          socket.emit("play-again", room_id)
     })
}

function UpdateBoard(board) {
     let board_positions = Object.keys(board)
     board_positions.forEach((position) => {
          BOARD_UI[position].textContent = board[position]
     })
}

function EnableBoardStopper() {
     BOARD_UI.board_container.classList.add("board-stopper")
}

function DisableBoardStopper() {
     BOARD_UI.board_container.classList.remove("board-stopper")
}
