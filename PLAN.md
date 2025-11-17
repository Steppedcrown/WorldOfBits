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

### Steps a

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
- [x] create a new game parameter for interactionRange, measured in tiles
- [x] players can only interact with tiles within the interactionRange of the player

## D3.b: Globe-spanning Gameplay

Key technical challenge: Assemble a map-based user interface using the Leaflet mapping framework
Key gameplay challenge: Can players collect and craft tokens from nearby locations to finally make one of sufficiently high value?

### Steps b

- [x] modify the spawn cells function to start at any coordinate value
- [x] it should spawn the pseudorandom cells from that position, not the same cells
- [x] listen for the moveend event and respawn cells around the new center point
- [x] despawn all other cells when new cells are spawned and do not remember their state
- [x] ensure the token values of cells are despawned as well
- [x] allow for player movement with wasd to move one cell's worth in each direction
- [x] create a new div to hold the statusPanel and controlPanel
- [x] create a new controlPanel to display the control scheme
- [x] allow for player to zoom on map with scroll wheel
- [x] when spawning cells, spawn them to cover the entire visible map
- [x] decrease neighborhood size, decrease interaction range, increase endgame token value
- [x] only despawn and cells if they are off the map on the moveend event

## D3.c: Object Persistence

### Steps c

- [x] Create a new class or data structure (e.g., `WorldState`) to act as a central store for all non-default cell states.
- [x] Use a `Map` within this structure to store the state of modified cells, using cell coordinates as keys and token values as values. This implements the Memento pattern, saving the state of important cells.
- [x] Refactor the cell generation and drawing logic. When rendering a cell, first check the `WorldState` map.
- [x] If a cell's state exists in the map, render it using the stored data.
- [x] If the cell is not in the map, generate its state pseudo-randomly as before. This applies the Flyweight pattern, as we don't store memory for unmodified, off-screen cells.
- [x] Update all player interactions (collecting, placing, merging tokens) to modify the `WorldState` map accordingly.
- [x] When a cell's state changes to the default (e.g., empty), remove its entry from the map to conserve memory.
- [x] Modify the `moveend` event handler to clear all visual elements and then redraw the entire visible map from scratch, using the `WorldState` map to ensure persistence of modified cells that scroll back into view.
- [x] refactor code to be more consistent: create seperate files for the player and cell classes and their related functions
- [x] create a map.ts to handle map parameters and creation
- [x] allow for player to move with arrow keys
- [x] move the updateTokenStatus function to the module that makes the most sense for it
- [x] incorporate the moveend listener into the map.ts module
- [x] rename NULL_ISLAND to WORLD_ORIGIN and CLASSROOM_LATLNG to DEFAULT_SPAWN for clarity

## D3.d: Gameplay Across Real-world Space and Time

### Steps d

- [x] Create an interface for player movement to abstract away the specific implementation (e.g., `MovementController`).
- [x] Implement a `GeolocationMovementController` that uses the browser's geolocation API to update the player's position.
- [x] Implement a `ButtonMovementController` that uses on-screen buttons (or keyboard) for movement.
- [ ] replace the hold movement system with the new one
- [ ] Add a mechanism to switch between movement controllers through a URL query parameter (e.g., `?movement=geo` or `?movement=buttons`).
- [ ] Create a `GameState` object to hold all the data that needs to be persisted (e.g., `WorldState`, player position, held token).
- [ ] Implement functions to save the `GameState` to `localStorage` whenever it changes.
- [ ] Implement a function to load the `GameState` from `localStorage` when the game starts.
- [ ] If no saved state is found, start a new game.
- [ ] Add a "New Game" button that clears the saved game state from `localStorage` and reloads the page to start fresh.
- [ ] Integrate the new movement system with the main game loop, so the player's character on the map moves according to the selected movement controller.
- [ ] Ensure that the player's position is saved as part of the game state.
