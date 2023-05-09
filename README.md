A simple adventure game by [Jackson Nadler-Block](https://jnadler-block.github.io/AdventurePrototype/) based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: Scene1, Scene2, Scene3, Scene4
- **2+ scenes *not* based on `AdventureScene`**: GameStudio, LoadingScreen, MainMenu, End
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: pickUpAnimation(object) makes an item fade away above the character's head, and then destroys it (called when an item is picked up).
    - Enhancement 2: initializeCoins() and increaseCoins() are used to work with a coin system implemented. Init() and Create() were changed to track coins in between scenes.
    - Enhancement 3: move(), moveAndPickup(), pickUpObject() were added to allow the player character to click to move, and click on items to walk to them and pick them up.
    - Enhancement 4: this.messsageButton and this.messageButton2 were added so the player could interact and choose "Yes" or "No" by clicking on the words.

Experience requirements:
- **4+ locations in the game world**: Scene1, Scene2, Scene3, Scene4 or First Room, Second Room, Third Room, Fourth Room
- **2+ interactive objects in most scenes**: Coins, a key, a blood vial, locked and unlocked doors, a player character that moves around, and another character to talk to/get key from
- **Many objects have `pointerover` messages**: All objects above (besides the player character) have pointerover messages.
- **Many objects have `pointerdown` effects**: Objects are moved to and picked up when clicked on. Doors go to the next scene. 
- **Some objects are themselves animated**: Character moves where clicked. Items have an animation when picked up. Locked doors have animation when player doesn't have a key.

Asset sources:
- (For each image/audio/video asset used, describe how it was created. What tool did you use to create it? Was it based on another work? If so, how did you change it, and where can we learn more about the original work for comparison? Use [Markdown link syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#links).)

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.