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
        this.messageBox.setText(message);
        this.messageBox.setAlpha(1);
    }

    stopMessage() {
        this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 0.2 * this.transitionDuration
        });
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

    gotoItem() {

    }

    initializeCharacter() {
        let vampire = this.physics.add.image(this.w * 0.1, this.h * 0.6, 'vampire');
        vampire.scale = this.s * 0.05;
        return vampire;
    }

    move(vampire, destination) {
        this.x = destination.x;
        this.y = destination.y;
        if (this.x > this.w * 0.702) {
            this.x = this.w * 0.702;
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
        if (d < 10) {
            if (object.texture.key == "coin") {
                this.pickUpCoin(object);
            }
            else if (object.texture.key == "door") {
                this.gotoScene('demo1');
            }
            this.vampire.setVelocityX(0);
            this.vampire.setVelocityY(0);
            this.o = this.vampire;
        }
    }

    pickUpCoin(object) {
        this.showMessage("You gained 1 coin!");
        this.increaseCoins(1);
        this.tweens.add({
            targets: object,
            y: `-=${2 * this.s}`,
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => object.destroy()
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}