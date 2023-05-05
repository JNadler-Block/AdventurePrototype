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
        
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#212121");
        
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

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#212121");
        
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
                this.scene.start('demo1');
            });
    }
}

class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [GameStudio, LoadingScreen, MainMenu, Demo1, Demo2, Outro],
    title: "Adventure Game",
});

