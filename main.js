import Phaser from 'phaser';

class Anasahne extends Phaser.Scene {
    constructor() {
        super('Anasahne');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.createKarakterDokular();

        this.karakter = this.physics.add.sprite(400, 300, 'karakter_1');
        this.karakter.setDepth(10);
        this.karakter.body.setCollideWorldBounds(true);
         this.createHarita();

        this.cursors = this.input.keyboard.createCursorKeys();
                this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        

                this.npc = this.physics.add.sprite(600, 500, 'karakter_1');
        this.npc.setDepth(10);
        this.npc.setTint(0xff6666);
        this.npc.body.setImmovable(true);
        this.physics.add.collider(this.karakter, this.npc);

       this.add.text(10, 10, 'Kurtulus RPG', { font: '16px Arial', fill: '#ffffff' }).setScrollFactor(0).setDepth(30);

        this.diyalogKutusu = this.add.rectangle(400, 500, 760, 100, 0x000000, 0.9)
            .setStrokeStyle(4, 0xffffff)
            .setScrollFactor(0)
            .setDepth(30)
            .setVisible(false);

         this.diyalogYazi = this.add.text(50, 485, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            wordWrap: { width: 700 }
        }).setScrollFactor(0).setDepth(31).setVisible(false);
       this.diyalogIsim = this.add.text(50, 458, '', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffdd00',
            fontStyle: 'bold'
        }).setScrollFactor(0).setDepth(31).setVisible(false);

        this.diyalogAktif = false;
        this.yazmaBitmedi = false;
        this.tamMetin = '';
        this.metinIndex = 0;
        this.diyalogIndex = 0;
        this.yazmaTimer = null;

            this.npcDiyaloglar = [
            { kim: "Komutan", metin: "Merhaba asker! Cepheye hoşgeldin!" },
            { kim: "Komutan", metin: "Sağ taraftaki koğuşta diğer askerler var, onlarla tanışabilirsin." },
            { kim: "Komutan", metin: "Dikkatli ol, düşman her yerde..." },
            { kim: "Komutan", metin: "Allah yardımcın olsun." },
            { kim: "Sen", metin: "Emredersiniz komutanım!" }
        ];
        
        this.etkilesimYazi = this.add.text(this.npc.x, this.npc.y - 40, 'E ile konuş', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setDepth(20).setVisible(false);
    }

    createKarakterDokular() {
        const g1 = this.make.graphics({ add: false });
        g1.fillStyle(0x2e7d32);
        g1.fillRect(6, 12, 20, 18);
        g1.fillStyle(0xf5cba7);
        g1.fillRect(8, 2, 16, 12);
        g1.fillStyle(0x000000);
        g1.fillRect(11, 6, 2, 2);
        g1.fillRect(19, 6, 2, 2);
        g1.fillStyle(0x1b4d1b);
        g1.fillRect(10, 30, 4, 2);
        g1.fillRect(18, 30, 4, 2);
        g1.generateTexture('karakter_1', 32, 32);
        g1.destroy();

        const g2 = this.make.graphics({ add: false });
        g2.fillStyle(0x2e7d32);
        g2.fillRect(6, 12, 20, 18);
        g2.fillStyle(0xf5cba7);
        g2.fillRect(8, 2, 16, 12);
        g2.fillStyle(0x000000);
        g2.fillRect(11, 6, 2, 2);
        g2.fillRect(19, 6, 2, 2);
        g2.fillStyle(0x1b4d1b);
        g2.fillRect(7, 30, 4, 2);
        g2.fillRect(21, 30, 4, 2);
        g2.generateTexture('karakter_2', 32, 32);
        g2.destroy();

        this.anims.create({
            key: 'yuru',
            frames: [
                { key: 'karakter_1' },
                { key: 'karakter_2' }
            ],
            frameRate: 8,
            repeat: -1
        });
    }
        createTileTextures() {
        // Çimen
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x3a7d3a);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0x2d6d2d);
        g.fillRect(4, 8, 3, 3);
        g.fillRect(20, 4, 2, 4);
        g.fillRect(12, 20, 4, 2);
        g.generateTexture('cimen', 32, 32);
        g.destroy();

        // Yol
        const p = this.make.graphics({ add: false });
        p.fillStyle(0x8b7355);
        p.fillRect(0, 0, 32, 32);
        p.fillStyle(0x9b8365);
        p.fillRect(6, 6, 4, 3);
        p.fillRect(18, 14, 5, 3);
        p.generateTexture('yol', 32, 32);
        p.destroy();

        // Ağaç
        const t = this.make.graphics({ add: false });
        t.fillStyle(0x5d4037);
        t.fillRect(13, 22, 6, 10);
        t.fillStyle(0x1b5e20);
        t.fillRect(4, 2, 24, 22);
        t.fillStyle(0x2e7d32);
        t.fillRect(8, 6, 16, 14);
        t.generateTexture('agac', 32, 32);
        t.destroy();

        // Su
        const w = this.make.graphics({ add: false });
        w.fillStyle(0x1565c0);
        w.fillRect(0, 0, 32, 32);
        w.fillStyle(0x1976d2);
        w.fillRect(4, 8, 6, 3);
        w.fillRect(18, 20, 8, 3);
        w.generateTexture('su', 32, 32);
        w.destroy();
    }

    createHarita() {
        const TS = 32;
        const COLS = 30;
        const ROWS = 25;
        const W = COLS * TS;
        const H = ROWS * TS;

        this.createTileTextures();

        // Çimen zemini
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                this.add.image(c * TS + TS / 2, r * TS + TS / 2, 'cimen');
            }
        }

        // Yatay yol
        for (let c = 0; c < COLS; c++) {
            this.add.image(c * TS + TS / 2, 10 * TS + TS / 2, 'yol');
            this.add.image(c * TS + TS / 2, 11 * TS + TS / 2, 'yol');
        }
        // Dikey yol
        for (let r = 0; r < ROWS; r++) {
            this.add.image(14 * TS + TS / 2, r * TS + TS / 2, 'yol');
            this.add.image(15 * TS + TS / 2, r * TS + TS / 2, 'yol');
        }

        // Engeller (ağaç + su)
        const engeller = this.physics.add.staticGroup();

        // Gölet
        for (let r = 3; r < 6; r++) {
            for (let c = 20; c < 24; c++) {
                engeller.create(c * TS + TS / 2, r * TS + TS / 2, 'su');
            }
        }

        // Sınır ağaçları
        for (let c = 0; c < COLS; c++) {
            engeller.create(c * TS + TS / 2, TS / 2, 'agac');
            engeller.create(c * TS + TS / 2, (ROWS - 1) * TS + TS / 2, 'agac');
        }
        for (let r = 1; r < ROWS - 1; r++) {
            engeller.create(TS / 2, r * TS + TS / 2, 'agac');
            engeller.create((COLS - 1) * TS + TS / 2, r * TS + TS / 2, 'agac');
        }

        // Dağınık ağaçlar
        const daginikAgaclar = [
            [4, 4], [6, 4], [4, 6],
            [22, 15], [24, 15], [22, 17],
            [5, 18], [7, 18], [5, 20]
        ];
        daginikAgaclar.forEach(([c, r]) => {
            engeller.create(c * TS + TS / 2, r * TS + TS / 2, 'agac');
        });

        // Çarpışma
        this.physics.add.collider(this.karakter, engeller);

        // Dünya sınırları + kamera
        this.physics.world.setBounds(0, 0, W, H);
        this.cameras.main.setBounds(0, 0, W, H);
        this.cameras.main.startFollow(this.karakter);
    }

    update() {
        // Diyalog aciksa: hareket kilitli, sadece E ile ilerle
        if (this.diyalogAktif) {
            this.karakter.body.setVelocity(0, 0);
            this.karakter.anims.stop();
            this.karakter.setTexture('karakter_1');

            if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
                if (this.yazmaBitmedi) {
                    // Yazma suruyorsa: tam metni goster
                    if (this.yazmaTimer) {
                        this.yazmaTimer.remove();
                        this.yazmaTimer = null;
                    }
                    this.diyalogYazi.setText(this.tamMetin);
                    this.yazmaBitmedi = false;
                } else {
                    // Yazma bittiyse: sonraki cumle veya kapat
                    this.diyalogIndex++;
                    if (this.diyalogIndex < this.npcDiyaloglar.length) {
                        this.daktiloYaz(this.npcDiyaloglar[this.diyalogIndex]);
                    } else {
                        this.diyalogKapat();
                    }
                }
            }
            return;
        }

        // Hareket
        this.karakter.body.setVelocity(0, 0);
        const hiz = 200;
        let hareket = false;

                if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.karakter.body.setVelocityX(-hiz);
            this.karakter.setFlipX(true);
            hareket = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.karakter.body.setVelocityX(hiz);
            this.karakter.setFlipX(false);
            hareket = true;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.karakter.body.setVelocityY(-hiz);
            hareket = true;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.karakter.body.setVelocityY(hiz);
            hareket = true;
        }

        if (hareket) {
            this.karakter.anims.play('yuru', true);
        } else {
            this.karakter.anims.stop();
            this.karakter.setTexture('karakter_1');
        }

        // NPC'ye yaklasinca E ile konus
        const mesafe = Phaser.Math.Distance.Between(
            this.karakter.x, this.karakter.y,
            this.npc.x, this.npc.y
        );
        this.etkilesimYazi.setVisible(mesafe < 80);
        if (mesafe < 80 && Phaser.Input.Keyboard.JustDown(this.eKey)) {
            this.diyalogBaslat();
        }
    }

    diyalogBaslat() {
        this.diyalogAktif = true;
        this.diyalogIndex = 0;
        this.diyalogKutusu.setVisible(true);
        this.diyalogYazi.setVisible(true);
        this.diyalogIsim.setVisible(true);
        this.daktiloYaz(this.npcDiyaloglar[0]);
    }

        daktiloYaz(satir) {
        this.diyalogIsim.setText(satir.kim);
        this.tamMetin = satir.metin;
        this.metinIndex = 0;
        this.yazmaBitmedi = true;
        this.diyalogYazi.setText('');

        if (this.yazmaTimer) {
            this.yazmaTimer.remove();
        }

        this.yazmaTimer = this.time.addEvent({
            delay: 40,
            callback: () => {
                this.diyalogYazi.text += satir.metin[this.metinIndex];
                this.metinIndex++;
                if (this.metinIndex >= satir.metin.length) {
                    this.yazmaBitmedi = false;
                    if (this.yazmaTimer) {
                        this.yazmaTimer.remove();
                        this.yazmaTimer = null;
                    }
                }
            },
            loop: true
        });
    }

    diyalogKapat() {
        this.diyalogAktif = false;
        this.diyalogKutusu.setVisible(false);
        this.diyalogYazi.setVisible(false);
        this.diyalogIsim.setVisible(false);
        if (this.yazmaTimer) {
            this.yazmaTimer.remove();
            this.yazmaTimer = null;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Anasahne]
};

new Phaser.Game(config);