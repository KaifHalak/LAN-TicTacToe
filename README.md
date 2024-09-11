# LAN Tic Tac Toe Game

Players can join the game from any device connected to the same network and can play against each other.

![Demo Vid](demo-vid.gif)

## Features
- Players can set their own usernames.
- Connect and play from any device on the same network. (Note: The server must run on a computer.)
- After a game ends, players have the option to replay.

## How to Run
- Clone the Repository or download the zip file:

- Navigate to the Project Directory and install the packages:
```
npm i
```

- Run the Server:

``` 
npm run server
```

## Configuration for Multi-Device Play
To play the game from any device, you need to configure the client to point to the server's IP address (localhost will not work):

- Open client/Menu/script.js.

- Find the const SERVER_URL (top of the file) and replace "localhost" with the server's IP address.

### To find the server's IP address:
- Open cmd and  type ipconfig:

- Locate the address under "IPv4 Address" and copy it.

- Update the URL in script.js to look like this:

```
Example URL
If the server's IP address is 192.168.1.5, the URL should be:
http://192.168.1.5:3000/
```

- Ensure that all devices are connected to the same network.
- The server needs to be running on a computer for other devices to connect.
