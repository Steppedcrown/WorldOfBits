# D3: World of Bits

Game Design Vision
Make a game that combines features of 2048 and Pokemon Go, creating a map of the real world which players can navigate, finding tiles in various locations. Tiles can have tokens with values on them which players can collect, holding one token at a time, and place on tiles with tokens of the same value of the one being held to create a new token on that tile with twice its original value. The goal of the game is get a tile with a value of 64.

Technologies

- TypeScript for most game code, little to no explicit HTML, and all CSS collected in common `style.css` file
- Deno and Vite for building
- GitHub Actions + GitHub Pages for deployment automation

Assignments

## D3.a: Core mechanics (token collection and crafting)

Key technical challenge: Assemble a map-based user interface using the Leaflet mapping framework
Key gameplay challenge: Can players collect and craft tokens from nearby locations to finally make one of sufficiently high value?

### Steps

- [x] copy main.ts to reference.ts for future reference
- [x] delete everything in main.ts
- [x] create a basic leaflet map which covers the whole screen
- [x] draw the player's location on the map
- [x] draw a rectangle representing one cell on the map
- [x] use loops to draw a whole grid of cells on the map
- [x] create a function to draw rectangles on the map
- [x] use the luck function of _luck.ts to randomly generate rectangles around the player
- [x] use the luck function again to create 0 or 1 "tokens" of value 1 or 2 within each cell
- [x] the value of the token of a cell should be displayed as a number within the cell
- [x] allow players to collect a single token from nearby cells (< 3 cells away) by clicking
- [x] dsplay whether or not a token is being held and the value of the token if one is held
- [x] create a player class, tracking player position and heldToken
- [x] prevent player from collecting a token if one is already held
- [x] allow player to place held token in empty cell
- [x] allow player to place token in cell with token of same value to merge into new token
- [x] add a endgameTokenValue variable of 64
- [x] detect when the player is holding a token of that value and display a you win message
- [x] give the option to restart the game or continue playing
- [x] if the game continues, add a button to reset and quit detecting for the endgame value
- [ ] if the player continued, add a permanent reset button in the left corner of the screen
