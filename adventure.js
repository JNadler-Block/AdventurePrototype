class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
        this.coins = data.coins || 0;
    }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create() {
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor('#444');
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.rectangle(0, 0, this.w * 0.75, this.h * 0.223).setOrigin(0, 0).setFillStyle(0x212121);

        this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
        this.add.text(this.w * 0.75 + this.s, this.s)
            .setText(this.name)
            .setStyle({ fontSize: `${3 * this.s}px` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        
        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33)
            .setStyle({ fontSize: `${2 * this.s}px`, color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        this.displayMessageBox = true;
        this.switchDisplay = false;

        this.messageButton = this.add.text(this.w * 0.75 + this.s, this.h * 0.51)
            .setStyle({ fontSize: `${2 * this.s}px`, fontStyle: 'bold', color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.messageButton2 = this.add.text(this.w * 0.87 + this.s, this.h * 0.51)
            .setStyle({ fontSize: `${2 * this.s}px`, fontStyle: 'bold', color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66)
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setText("Inventory")
            .setAlpha(0);

        this.inventoryTexts = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerout', () => this.stopMessage())
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });
        this.coinText;
        this.initializeCoins();

        this.onEnter();

    }

    showMessage(message) {
        this.switchDisplay = true;
        if (this.displayMessageBox && this.switchDisplay) {
            this.messageBox.setText(message);
            this.messageBox.setAlpha(1);
        }
    }

    stopMessage() {
        this.switchDisplay = false;
        if (this.displayMessageBox && !this.switchDisplay) {
            let t = this.tweens.add({
                targets: this.messageBox,
                alpha: { from: 1, to: 0 },
                easing: 'Quintic.in',
                duration: 0.3 * this.transitionDuration,
                onUpdate: () => {
                    if (this.switchDisplay) {
                        t.stop();
                        this.messageBox.setAlpha(1);
                    }
                },
            });
        }
    }

    showMessageButton(message) {
        this.messageButton.setText(message);
        this.messageButton.setAlpha(1);
    }

    stopMessageButton() {
        this.messageButton.setAlpha(0);
    }

    showMessageButton2(message) {
        this.messageButton2.setText(message);
        this.messageButton2.setAlpha(1);
    }

    stopMessageButton2() {
        this.messageButton2.setAlpha(0);
    }

    talkToDookin() {
        if (this.dookinTimes == 0) {
            this.showMessage("\"Hi I'm Dookin.\"");
            this.displayMessageBox = false;
            this.showMessageButton("       Next");
            this.dookinTimes++;
            this.messageButton.setInteractive()
                .on('pointerdown', () => {
                    this.time.delayedCall(100, () => {
                        this.talkToDookin();
                    });
                });
        }
        else if (this.dookinTimes == 1) {
            this.displayMessageBox = true;
            this.showMessage("\"I'm so thirsty. If you have any blood on you, I can help you in return.\"");
            this.displayMessageBox = false;
            this.showMessageButton("       Next");
            this.dookinTimes++;
            this.messageButton.setInteractive()
                .on('pointerdown', () => {
                    this.time.delayedCall(100, () => {
                        this.talkToDookin();
                    });
                });
        }
        else if (this.dookinTimes == 2 || this.dookinTimes == 3) {
            this.displayMessageBox = true;
            if (this.dookinTimes == 3) {
                this.showMessage("\"Hi, do you have any blood for me?\"");
            }
            else {
                this.showMessage("Would you like to give Dookin your Blood Vial?");
            }
            this.displayMessageBox = false;
            this.showMessageButton("  Yes");
            this.messageButton.setInteractive()
                .on('pointerdown', () => {
                    if (this.hasItem('blood vial')) {
                        this.time.delayedCall(100, () => {
                            this.loseItem('blood vial');
                            this.pickUpObject(this.add.image(this.w * 0.7, this.h * 0.85, 'key'));
                            this.displayMessageBox = true;
                            this.showMessage("\"Thank you!\"");
                            this.stopMessageButton();
                            this.stopMessageButton2();
                            this.dookinTimes = 4;
                        });
                    }
                });

            this.showMessageButton2("    No");
            this.messageButton2.setInteractive()
                .on('pointerdown', () => {
                    this.time.delayedCall(100, () => {
                        this.displayMessageBox = true;
                        this.showMessage("\"Let me know if you change your mind.\"");
                        this.stopMessageButton();
                        this.stopMessageButton2();
                        this.dookinTimes = 3;
                    });
                });
        }
        else if (this.dookinTimes > 3) {
            this.stopMessage();
            this.stopMessageButton();
            this.stopMessageButton2();
        }
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: this.transitionDuration
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: this.transitionDuration
            });
        }
        if (this.inventoryTexts) {
            this.inventoryTexts.forEach((t) => t.destroy());
        }
        this.inventoryTexts = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e, i) => {
            let text = this.add.text(this.w * 0.75 + 2 * this.s, h, e)
                .setStyle({ fontSize: `${1.5 * this.s}px` })
                .setWordWrapWidth(this.w * 0.75 + 4 * this.s);
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    gainItem(item) {
        if (this.inventory.includes(item)) {
            console.warn('gaining item already held:', item);
            return;
        }
        this.inventory.push(item);
        this.updateInventory();
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x - 20, to: text.x },
                    alpha: { from: 0, to: 1 },
                    ease: 'Cubic.out',
                    duration: this.transitionDuration
                });
            }
        }
    }

    loseItem(item) {
        if (!this.inventory.includes(item)) {
            console.warn('losing item not held:', item);
            return;
        }
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x, to: text.x + 20 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Cubic.in',
                    duration: this.transitionDuration
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != item);
            this.updateInventory();
        });
    }

    gotoScene(key) {
        this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
        this.time.delayedCall(this.transitionDuration, () => {
            this.scene.start(key, {
                inventory: this.inventory,
                coins: this.coins,
            });
        });
    }

    initializeCoins() {
        let coin = this.add.image(this.w-15*this.s, this.h-2*this.s, 'coin')
            .setInteractive()
            .on('pointerover', () => this.showMessage('Coins: ' + this.coins))
            .on('pointerout', () => this.stopMessage());
        coin.scale = this.s * 0.04;

        this.coinText = this.add.text(this.w - 20 *this.s, this.h-3.2*this.s, this.coins)
            .setStyle({ fontSize: `${3 * this.s}px` });
    }

    increaseCoins(coin) {
        this.coins += coin;
        this.coinText.setText(this.coins);
    }

    initializeCharacter() {
        let vampire = this.physics.add.image(this.w * 0.1, this.h * 0.6, 'vampire');
        vampire.scale = this.s * 0.05;
        return vampire;
    }

    move(vampire, destination) {
        this.x = destination.x;
        this.y = destination.y;
        if (this.x > this.w * 0.71) {
            this.x = this.w * 0.71;
            if (vampire.x > this.w * 0.71) {
                this.vampire.setVelocityX(0);
            }
            return;
        }
        else if(this.x < this.w * 0.07) {
            this.x = this.w * 0.07;
        }
        if (this.y < this.h * 0.21) {
            this.y = this.h * 0.21;
        }
        else if(this.y > this.h * 0.83) {
            this.y = this.h * 0.83;
        }
        let x = this.x;
        let y = this.y;
        this.physics.moveToObject(vampire, {x , y}, this.w * 0.15);
    }

    moveAndPickup(vampire, object) {
        this.o = object;
        this.move(vampire, object);
        let d = Phaser.Math.Distance.Between(this.vampire.x, this.vampire.y, this.x, this.y);
        if (d < 300 && object.texture.key == "dookin") {
            this.vampire.setVelocityX(0);
            this.vampire.setVelocityY(0);
            this.o = this.vampire;
            this.talkToDookin();
        }
        else if (d < 100) {
            if (object.texture.key == "coin") {
                this.pickUpCoin(object);
            }
            else if (object.texture.key == "door" || object.texture.key == "locked door") {
                this.gotoScene(this.nextScene);
            }
            else {
                this.pickUpObject(object);
            }
            this.vampire.setVelocityX(0);
            this.vampire.setVelocityY(0);
            this.o = this.vampire;
        }
    }

    pickUpObject(object) {
        this.showMessage("You pick up the " + object.texture.key + ".");
        this.gainItem(object.texture.key);
        this.pickUpAnimation(object);
    }

    pickUpCoin(object) {
        this.showMessage("You gained 1 coin!");
        this.increaseCoins(1);
        this.pickUpAnimation(object);
    }

    pickUpAnimation(object) {
        object.x = this.vampire.x - this.s;
        object.y = object.y - this.h * 0.25;
        this.tweens.add({
            targets: object,
            y: `-=${2 * this.s}`,
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => object.destroy()
        });
    }

    update() {
        if (this.o != this.vampire && this.p.isDown && this.p.position != this.p.prevPosition) {
            let dis = Phaser.Math.Distance.Between(this.p.position.x, this.p.position.y, this.o.x, this.o.y);
            if (dis > 100 || dis < -100) {
                this.o = this.vampire;
            }
        }
        if(this.o != this.vampire) {
            this.moveAndPickup(this.vampire, this.o);
        }
        else if(this.p.isDown) {
            this.move(this.vampire, this.p.position);
        }

        let d = Phaser.Math.Distance.Between(this.vampire.x, this.vampire.y, this.x, this.y);
        if (d < 5) {
            this.vampire.setVelocityX(0);
            this.vampire.setVelocityY(0);
        }
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}