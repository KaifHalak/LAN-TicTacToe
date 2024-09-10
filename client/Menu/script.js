const SERVER_URL = "http://localhost:3000/"

const MENU_UI = {
     menu_btns_container: document.querySelector(".menu-button-containers"),
     menu_create_room_btn: document.querySelector(".menu-create-room-btn"),
     menu_join_room_btn: document.querySelector(".menu-join-room-btn"),
     input_data_container: document.querySelector(".menu-input-data-container"),
     create_room_btn_container: document.querySelector(
          ".create-room-btn-container"
     ),
     room_id_container: document.querySelector(".room-id-container"),
     go_back_btn: document.querySelector(
          ".menu-input-data-container  .go-back-btn"
     ),
     join_room_btn_final: document.querySelector(
          ".menu-input-data-container .join-room-btn"
     ),
     create_room_btn_final: document.querySelector(
          ".menu-input-data-container .create-room-btn"
     ),
     username_input_field: document.querySelector("#username"),
     room_id_input_field: document.querySelector("#room-id"),
     main_container: document.querySelector(".menu-main-container"),
     board_main_container: document.querySelector(".board-main-container"),
     create_room_text: document.querySelector(".create-room-text")
}

let socket = io(SERVER_URL)
let room_id

window.socket = socket

MenuSocketListeners()
MenuAddListeners()

function MenuSocketListeners() {
     socket.on("get-board-html-ready", () => {
          MENU_UI.main_container.classList.add("hide")
          MENU_UI.board_main_container.classList.remove("hide")
     })
}

function MenuAddListeners() {
     MENU_UI.menu_create_room_btn.addEventListener("click", () => {
          MENU_UI.username_input_field.value = "Player-1"
          MENU_UI.menu_btns_container.classList.toggle("hide")
          MENU_UI.input_data_container.classList.toggle("hide")
          MENU_UI.create_room_btn_container.classList.remove("hide")
     })

     MENU_UI.menu_join_room_btn.addEventListener("click", () => {
          MENU_UI.username_input_field.value = "Player-2"
          MENU_UI.menu_btns_container.classList.toggle("hide")
          MENU_UI.input_data_container.classList.toggle("hide")
          MENU_UI.room_id_container.classList.remove("hide")
          MENU_UI.join_room_btn_final.classList.remove("hide")
          MENU_UI.room_id_input_field.value = ""
          MENU_UI.room_id_input_field.readOnly = false
     })

     MENU_UI.go_back_btn.addEventListener("click", () => {
          MENU_UI.menu_btns_container.classList.toggle("hide")
          MENU_UI.input_data_container.classList.toggle("hide")
          MENU_UI.room_id_container.classList.add("hide")
          MENU_UI.create_room_btn_container.classList.add("hide")
          MENU_UI.create_room_btn_final.disabled = false
          MENU_UI.create_room_text.classList.add("hide")
          MENU_UI.username_input_field.readOnly = false
          MENU_UI.username_input_field.classList.remove("username-readonly")
          MenuGoBack()
     })

     MENU_UI.join_room_btn_final.addEventListener("click", () => {
          MenuJoinRoom()
     })

     MENU_UI.create_room_btn_final.addEventListener("click", () => {
          MENU_UI.create_room_btn_final.disabled = true
          MenuCreateRoom()
     })
}

function MenuCreateRoom() {
     let username = MENU_UI.username_input_field.value

     if (!username || username.trim() === "") {
          MENU_UI.username_input_field.value = "Player-1"
     }

     MENU_UI.username_input_field.readOnly = true
     MENU_UI.username_input_field.classList.add("username-readonly")
     socket.emit("create-room", username)

     socket.on("room-id", (id) => {
          room_id = id
          window.room_id = room_id
          MENU_UI.room_id_container.classList.remove("hide")
          MENU_UI.join_room_btn_final.classList.add("hide")
          MENU_UI.room_id_input_field.value = room_id
          MENU_UI.room_id_input_field.readOnly = true
          MENU_UI.create_room_text.classList.remove("hide")
     })
}

function MenuJoinRoom() {
     let username = MENU_UI.username_input_field.value

     if (!username || username.trim() === "") {
          MENU_UI.username_input_field.value = "Player-2"
     }

     room_id = MENU_UI.room_id_input_field.value.trim()
     window.room_id = room_id
     if (!room_id) {
          return
     }

     socket.emit("join-room", {
          username,
          room_id
     })

     socket.on("incorrect-room-id", () => {
          alert("Incorrect Room ID")
     })

     socket.on("room-is-full", () => {
          alert("Room is full")
     })
}

function MenuGoBack() {
     if (!room_id) {
          return
     }

     socket.emit("delete-room", room_id)
}
