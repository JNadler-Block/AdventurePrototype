class GameStudio extends Phaser.Scene {
    constructor() {
        super('game studio');
    }

    preload() {
        this.load.image('studio name', 'assets/JN-B Text.png');
    }

    create() {
        this.cameras.main.fadeIn(1000);
        let name = this.add.image(this.game.config.width * 0.48, this.game.config.height * 0.5, 'studio name');
        name.scale = this.game.config.width * 0.001;

        this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(1000, 0,0,0);
        });

        this.time.delayedCall(3000, () => {
            this.scene.start('loading screen');
        })
    }
}

class LoadingScreen extends Phaser.Scene {
    constructor() {
        super('loading screen');
    }

    preload() {
        this.load.image('castle', 'assets/Castle.png');
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;
        
        this.cameras.main.fadeIn(1000);
        let castle = this.add.image(w * 0.72, h * 0.5, 'castle');
        castle.scale = this.game.config.height * 0.00165;
        
        let loading = this.add.text(w * 0.75, h * 0.9, 'Loading');
        loading.setFontSize(50);

        // Add graphics
        let dot1 = this.add.rectangle(w * 0.87, h * 0.93, w * 0.003, w * 0.003, 0xffffff);
        let dot2 = this.add.rectangle(w * 0.87 + 30, h * 0.93, w * 0.003, w * 0.003, 0xffffff);
        let dot3 = this.add.rectangle(w * 0.87 + 60, h * 0.93, w * 0.003, w * 0.003, 0xffffff);

        // Make 3 dots bounce
        this.tweens.add({
            targets: dot1,
            y: dot1.y + h * 0.003,
            ease: "Linear",
            duration: 700, 
            repeat: 3,
            yoyo: true
        });

        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: dot2,
                y: dot2.y + h * 0.003,
                ease: "Linear",
                duration: 700, 
                repeat: 3,
                yoyo: true
            });
        });

        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: dot3,
                y: dot3.y + h * 0.003,
                ease: "Linear",
                duration: 700, 
                repeat: 3,
                yoyo: true
            });
        });

        // Start next scene after dots bounce 3 times
        this.time.delayedCall(4250, () => {
            this.scene.start('main menu');
        });

    }
}

class MainMenu extends Phaser.Scene {
    constructor() {
        super('main menu');
    }

    preload() {
        this.load.image('vampire', 'assets/Vampire.png');
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;
        
        this.cameras.main.fadeIn(500);
        let vampire = this.add.image(w * 0.75, h * 0.5, 'vampire');
        vampire.scale = this.game.config.height * 0.00165;

        // Main Menu Text
        // center align title and add animations to text
        let title = this.add.text(w * 0.2, h * 1.1, 'Vampire Adventures');
        title.setFontSize(100);
        title.setWordWrapWidth(200);
        title.setAlign('center');
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: title,
                y: h * 0.15,
                duration: 300
            });
        });

        let newgame = this.add.text(w * 0.22, h * 1.1, 'Start Game');
        newgame.setStroke(0x000000, 1);
        newgame.setFontSize(80);
        newgame.setAlign('center');
        this.time.delayedCall(900, () => {
            this.tweens.add({
                targets: newgame,
                y: h * 0.45,
                duration: 300, 
            });
        });
        newgame.setInteractive()
            .on('pointerover', () => newgame.setStroke(0x000000, 15))
            .on('pointerout', () => newgame.setStroke(0x000000, 1))
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0,0,0);
                this.time.delayedCall(50, () => {
                    this.scene.start('scene1');
                });
            });
    }
}

class Scene1 extends AdventureScene {
    constructor() {
        super("scene1", "First Room");
    }

    preload() {
        this.load.image('door', 'assets/Door.png');
        this.load.image('coin', 'assets/Coin.png');
        this.load.image('vampire', 'assets/Vampire.png');
    }

    onEnter() {
        this.showMessage("Click to move around.");
        
        this.door = this.add.image(this.w * 0.692, this.h * 0.112, 'door')
            .setInteractive()
            .on('pointerover', () => this.showMessage("I wonder where it goes..."))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.door));

        this.c = this.add.image(this.w * 0.5, this.h * 0.5, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c));

        this.vampire = this.initializeCharacter();
        this.nextScene = 'scene2'
        this.o = this.vampire;
        this.x = 0;
        this.y = 0;
        this.p = this.input.activePointer;
    }
}

class Scene2 extends AdventureScene {
    constructor() {
        super("scene2", "Second Room");
    }

    preload() {
        this.load.image('door', 'assets/Door.png');
        this.load.image('coin', 'assets/Coin.png');
        this.load.image('vampire', 'assets/Vampire.png');
        this.load.image('blood vial', 'assets/BloodVial.png');
    }

    onEnter() {
        this.door = this.add.image(this.w * 0.692, this.h * 0.112, 'door')
            .setInteractive()
            .on('pointerover', () => this.showMessage("Another door?"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => {
                if (this.hasItem('blood vial')) {
                    this.moveAndPickup(this.vampire, this.door);
                }
                else {
                    this.showMessage("You may want that tasty blood before you leave.");
                    this.tweens.add({
                        targets: this.door,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                    this.time.delayedCall(55, () => {
                        this.vampire.setVelocityX(0);
                        this.vampire.setVelocityY(0);
                    });
                }
            });

        this.blood = this.add.image(this.w * 0.3, this.h * 0.65, 'blood vial')
            .setInteractive()
            .on('pointerover', () => this.showMessage("Mmmm blood!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.blood));

        this.c1 = this.add.image(this.w * 0.5, this.h * 0.8, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c1));
        
        this.c2 = this.add.image(this.w * 0.7, this.h * 0.4, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c2));
        
        this.c3 = this.add.image(this.w * 0.3, this.h * 0.3, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c3));

        this.nextScene = 'scene3'
        this.vampire = this.initializeCharacter();
        this.o = this.vampire;
        this.x = 0;
        this.y = 0;
        this.p = this.input.activePointer;
    }
}

class Scene3 extends AdventureScene {
    constructor() {
        super("scene3", "Third Room");
    }

    preload() {
        this.load.image('locked door', 'assets/LockedDoor.png');
        this.load.image('coin', 'assets/Coin.png');
        this.load.image('vampire', 'assets/Vampire.png');
        this.load.image('key', 'assets/Key.png');
    }

    onEnter() {
        this.door = this.add.image(this.w * 0.692, this.h * 0.112, 'locked door')
            .setScale(this.s * 0.06, this.s * 0.06)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Hmm this door looks locked."))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => {
                if (this.hasItem('key')) {
                    this.loseItem('key');
                    this.moveAndPickup(this.vampire, this.door);
                }
                else {
                    this.showMessage("This door looks like it needs a key.");
                    this.tweens.add({
                        targets: this.door,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                    this.time.delayedCall(50, () => {
                        this.vampire.setVelocityX(0);
                        this.vampire.setVelocityY(0);
                    });
                }
                this.door.x = this.w * 0.692;
                this.door.y = this.h * 0.112;
            });

        this.key = this.add.image(this.w * 0.7, this.h * 0.85, 'key')
            .setScale(this.s * 0.03, this.s * 0.03)
            .setInteractive()
            .on('pointerover', () => this.showMessage("It looks useful."))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.key));

        this.c1 = this.add.image(this.w * 0.5, this.h * 0.8, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c1));
        
        this.c2 = this.add.image(this.w * 0.6, this.h * 0.5, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c2));
        
        this.c3 = this.add.image(this.w * 0.3, this.h * 0.3, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c3));

        this.c4 = this.add.image(this.w * 0.2, this.h * 0.9, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage("That looks shiny.\nGo and pick it up!"))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => this.moveAndPickup(this.vampire, this.c4));

        this.nextScene = 'scene4'
        this.vampire = this.initializeCharacter();
        this.o = this.vampire;
        this.x = 0;
        this.y = 0;
        this.p = this.input.activePointer;
    }
}

class Scene4 extends AdventureScene {
    constructor() {
        super("scene4", "Fourth Room");
    }

    preload() {
        this.load.image('locked door', 'assets/LockedDoor.png');
        this.load.image('coin', 'assets/Coin.png');
        this.load.image('vampire', 'assets/Vampire.png');
        this.load.image('dookin', 'assets/BlueVampire.png');
        this.load.image('key', 'assets/Key.png');
    }

    onEnter() {
        this.door = this.add.image(this.w * 0.692, this.h * 0.112, 'locked door')
            .setScale(this.s * 0.06, this.s * 0.06)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem('key')) {
                    this.showMessage("Dookin's key should unlock it.");
                }
                else {
                    this.showMessage("It's locked, but maybe the vampire can help.");
                }
            })
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => {
                if (this.hasItem('key')) {
                    this.moveAndPickup(this.vampire, this.door);
                }
                else {
                    this.showMessage("This door looks like it needs a key.");
                    this.tweens.add({
                        targets: this.door,
                        x: '+=' + this.s,
                        repeat: 2,
                        yoyo: true,
                        ease: 'Sine.inOut',
                        duration: 100
                    });
                    this.time.delayedCall(55, () => {
                        this.vampire.setVelocityX(0);
                        this.vampire.setVelocityY(0);
                    });
                }
                this.door.x = this.w * 0.692;
                this.door.y = this.h * 0.112;
            });

        this.dookinTimes = 0;
        this.dookin = this.physics.add.image(this.w * 0.55, this.h * 0.3, 'dookin');
        this.dookin.scale = this.s * 0.042;
        this.dookin.setInteractive()
            .on('pointerover', () => {
                if (this.dookinTimes > 2) {
                    this.showMessage("\"Hello there!\"");
                }
                else {
                    this.showMessage("That vampire looks thirsty.");
                }
            })
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => {
                this.moveAndPickup(this.vampire, this.dookin);
            });

        this.nextScene = 'end'
        this.vampire = this.initializeCharacter();
        this.o = this.vampire;
        this.x = 0;
        this.y = 0;
        this.p = this.input.activePointer;
    }
}

class End extends Phaser.Scene {
    init(data) {
        this.inventory = data.inventory || [];
        this.coins = data.coins || 0;
    }
    
    constructor() {
        super('end');
    }

    preload() {
        this.load.image('castle', 'assets/Castle.png');
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;
        
        this.cameras.main.fadeIn(1000);
        let castle = this.add.image(w * 0.72, h * 0.5, 'castle');
        castle.scale = this.game.config.height * 0.00165;
        
        let loading = this.add.text(w * 0.13, h * 0.3, 'You spent your\n' + this.coins + ' coins on\nblood vials and\nlived happily\never after.');
        loading.setStroke(0x000000, 1);
        loading.setFontSize(60);

        let replay = this.add.text(w * 0.13, h * 1.1, 'Play Again')
            .setStroke(0x000000, 1)
            .setFontSize(80)
            .setAlign('center');
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: replay,
                y: h * 0.75,
                duration: 500, 
            });
        });
        replay.setInteractive()
            .on('pointerover', () => replay.setStroke(0x000000, 15))
            .on('pointerout', () => replay.setStroke(0x000000, 1))
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0,0,0);
                this.time.delayedCall(50, () => {
                    this.scene.start('main menu');
                });
            });

    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        //arcade: { debug: true }
    },
    backgroundColor: 0x212121,
    scene: [GameStudio, LoadingScreen, MainMenu, Scene1, Scene2, Scene3, Scene4, End],
    title: "Adventure Game",
});

