var game = {
    data: {
        steps: 0,
        start: false
    },

    resources: [
        // Images
        {name: "bg", type:"image", src: "data/img/bg.png"},

        // Weapon
        {name: "bullet", type:"image", src: "data/img/bullet.png"},
        {name: "shotgun", type:"image", src: "data/img/shotgun.png"},
        {name: "ak", type:"image", src: "data/img/ak.png"},
		{name: "hadoken", type:"image", src: "data/img/hadoken.png"},
        {name: "laser", type:"image", src: "data/img/laser.png"},
        {name: "minigun", type:"image", src: "data/img/minigun.png"},

        // Ennemies
		{name: "meleeEnemy", type:"image", src: "data/img/meleehats.png"},
		{name: "meleeEnemy", type:"json", src: "data/img/meleehats.json"},
        {name: "archerEnemy", type:"image", src: "data/img/archerhats.png"},
        {name: "archerEnemy", type:"json", src: "data/img/archerhats.json"},
		{name: "mageEnemy", type:"image", src: "data/img/magehats.png"},
		{name: "mageEnemy", type:"json", src: "data/img/magehats.json"},
		{name: "mageAttack", type:"image", src: "data/img/mageAttack.png"},
        {name: "archerAttack", type:"image", src: "data/img/archerAttack.png"},
        // Boss
        {name: "mageBoss", type:"image", src: "data/img/boss_mage.png"},
        {name: "mageBoss", type:"json", src: "data/img/boss_mage.json"},

        // Santa
        {name: "santa", type:"image", src: "data/img/santa.png"},
        {name: "santa", type:"json", src: "data/img/santa.json"},

        // Gift
        {name: "present1", type:"image", src: "data/img/present1.png"},
        {name: "present2", type:"image", src: "data/img/present2.png"},
        {name: "present3", type:"image", src: "data/img/present3.png"},

        // Drop Weapon
        {name: "drop-bullet", type:"image", src: "data/img/present1.png"},
        {name: "drop-shotgun", type:"image", src: "data/img/present2.png"},
        {name: "drop-ak", type:"image", src: "data/img/present3.png"},
        {name: "drop-hadoken", type:"image", src: "data/img/present1.png"},
        {name: "drop-laser", type:"image", src: "data/img/present2.png"},
        {name: "drop-minigun", type:"image", src: "data/img/present3.png"},

        // Decoration
        {name: "pipe", type:"image", src: "data/img/pipe.png"},
        {name: "pipe2", type:"image", src: "data/img/pipe2.png"},
        {name: "pipe3", type:"image", src: "data/img/pipe3.png"},
        {name: "pipebis", type:"image", src: "data/img/pipebis.png"},
        {name: "pipe2bis", type:"image", src: "data/img/pipe2bis.png"},
        {name: "pipe3bis", type:"image", src: "data/img/pipe3bis.png"},
        {name: "snow", type:"image", src: "data/img/snow.png"},
        {name: "logo", type:"image", src: "data/img/logo.png"},
        {name: "gameover", type:"image", src: "data/img/gameover.png"},
		{name: "tablo", type:"image", src: "data/img/tablo.png"},
		{name: "tablo12", type:"image", src: "data/img/tablo12.png"},
        {name: "gameoverbg", type:"image", src: "data/img/gameoverbg.png"},
        {name: "hit", type:"image", src: "data/img/hit.png"},
        {name: "getready", type:"image", src: "data/img/getready.png"},
        {name: "new", type:"image", src: "data/img/new.png"},

        // sounds
        {name: "theme1", type: "audio", src: "data/bgm/"},
        {name: "theme2", type: "audio", src: "data/bgm/"},
        {name: "hit", type: "audio", src: "data/sfx/"},
        {name: "hurt", type: "audio", src: "data/sfx/"},
        {name: "lose", type: "audio", src: "data/sfx/"},
        {name: "bullet", type: "audio", src: "data/sfx/"},
        {name: "shotgun", type: "audio", src: "data/sfx/"},
        {name: "ak", type: "audio", src: "data/sfx/"},
        {name: "shotgunReloading", type: "audio", src: "data/sfx/"},
		{name: "hadoken", type: "audio", src: "data/sfx/"},
        {name: "laser", type: "audio", src: "data/sfx/"},
        {name: "minigunLoading", type: "audio", src: "data/sfx/"},
        {name: "minigunFire", type: "audio", src: "data/sfx/"},
        {name: "minigunRelease", type: "audio", src: "data/sfx/"},
		{name: "balledeboulepremium", type: "audio", src: "data/sfx/"},
        {name: "balle de boule", type: "audio", src: "data/sfx/"},
        {name: "cabiche", type: "audio", src: "data/sfx/"},
        {name: "cest du bon", type: "audio", src: "data/sfx/"},
        {name: "fatchdefitch", type: "audio", src: "data/sfx/"},
        {name: "onestbienla", type: "audio", src: "data/sfx/"},
        {name: "tesdanslaxe", type: "audio", src: "data/sfx/"},
        {name: "explosion", type: "audio", src: "data/sfx/"},
		{name: "skraa", type: "audio", src: "data/sfx/"},


    ],

    weapon: [
        // 0 is default
        {
            type: "bullet", 
            lastShot: 0,
            x: 50,
            y: 48,
            cd: 450, 
            sound: "bullet", 
            pressFire: function(posX, posY) {
                if (Date.now() - this.lastShot > this.cd){
                    this.lastShot = Date.now();
                    me.audio.play(this.sound);
                    me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y), 13);
                }
            },
            releaseFire: function(){
        
            },
            resetWeapon: function(){
                this.lastShot = 0;
            }
        },
        // 1 shotgun
        {
            type: "shotgun", 
            lastShot: 0,
            x: 107,
            y: 48,
            cd: 1000, 
            cartbridge: 8,
            reloadingCd : 4000,
            reloading: false,
            reloadingPlayed: false,
            pressFire: function(posX, posY) {
                var duration = Date.now() - this.lastShot;

                if (this.reloading && duration > this.reloadingCd){
                    this.reloading = false;
                    this.cartbridge = 8;
                    this.reloadingPlayed = false;
                }

                // On peut tirer
                if (duration > this.cd && ! this.reloading){
                    this.lastShot = Date.now();
                    me.audio.play("shotgun");
                    for (var i = -5; i < 6; i++)
                        me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y, 
                            me.Math.degToRad(i * me.Math.random(-15, 15))), 13);
                    //this.cartbridge -= 1;
                    if (this.cartbridge == 0) this.reloading = true;
                }

                // Check du rechargement
                if (this.reloading && ! this.reloadingPlayed){
                    this.reloadingPlayed = true;
                    me.audio.play("shotgunReloading");
                }
            },
            releaseFire: function(){
            },
            resetWeapon: function(){
                this.cartbridge = 8;
                this.lastShot = 0;
                this.reloading = false;
                this.reloadingPlayed = false;
            }
        },
        // 2 Ak
        {
            type: "ak",
            lastShot: 0,
            x: 70,
            y: 48,
            cd: 150,
            sound: "ak",
            pressFire: function(posX, posY) {
                if (Date.now() - this.lastShot > this.cd){
                    this.lastShot = Date.now();
                    me.audio.play(this.sound);
                    me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y), 13);
                }
            },
            releaseFire: function(){

            },
            resetWeapon: function(){
                this.lastShot = 0;
            }
        },
        // 3 hadoken
        {
            type: "hadoken", 
            lastShot: 0,
            x: 20,
            y: 15,
            cd: 800, 
            sound: "hadoken", 
            pressFire: function(posX, posY) {
                if (Date.now() - this.lastShot > this.cd){
                    this.lastShot = Date.now();
                    me.audio.play(this.sound);
                    me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y), 13);
                }
            },
            releaseFire: function(){
        
            },
            resetWeapon: function(){

            },
            resetWeapon: function(){
                this.lastShot = 0;
            }
        },
        //4 laser
        {
            type: "laser", 
            lastShot: 0,
            x: 97,
            y: 15,
            cd: 50, 
            sound: "laser", 
            pressFire: function(posX, posY) {
                if (Date.now() - this.lastShot > this.cd){
                    this.lastShot = Date.now();
                    me.audio.play(this.sound);
                    me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y), 13);
                }
            },
            releaseFire: function(){
        
            },
            resetWeapon: function(){
                this.lastShot = 0;
            }
        },
        // 5 minigun
        {
            type: "minigun", 
            lastShot: 0,
            firstShot: 0,
            x: 97,
            y: 64,
            cd: 50, 
            cdBeforeFire: 950,
            cdBeforeFirePlayed: false,
            isFiring: false, 
            pressFire: function(posX, posY) {
                if (Date.now() - this.lastShot > this.cd){
                    if (this.firstShot == 0) this.firstShot = Date.now();
                    this.lastShot = Date.now();

                    if (! this.cdBeforeFirePlayed && Date.now() - this.firstShot < this.cdBeforeFire){
                        this.cdBeforeFirePlayed = true;
                        me.audio.play("minigunLoading");
                        setSantaWeapon(5,"minigun_on");
                    }
                    else if (Date.now() - this.firstShot >= this.cdBeforeFire){
                        if (!this.isFiring) {
                            me.audio.play("minigunFire", true);
                            this.isFiring = true;
                        }
                        for (var i = -1; i < 2; i++)
                            me.game.world.addChild(new me.pool.pull(this.type, posX + this.x, posY + this.y, me.Math.degToRad(i * 2)), 13);
                    }
                }
            },
            releaseFire: function(){
                this.cdBeforeFirePlayed = false;
                this.isFiring = false;
                this.firstShot = 0;
                me.audio.stop("minigunLoading");
                me.audio.stop("minigunFire");
                me.audio.play("minigunRelease");
                setSantaWeapon(5,"minigun");
            },
            resetWeapon: function(){
                this.cdBeforeFirePlayed = false;
                this.isFiring = false;
                this.firstShot = 0;
                this.lastShot = 0;
                me.audio.stop("minigunFire");
            }
        },
    ],

    onload: function() {

        if (!me.video.init(900, 504, {
            wrapper: "screen",
            scale : "auto",
            scaleMethod: "fit"
        })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3");
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    loaded: function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.pool.register("bullet", game.BulletEntity, true);
        me.pool.register("shotgun", game.ShotgunEntity, true);
        me.pool.register("ak", game.AkEntity, true);
		me.pool.register("hadoken", game.HadokenEntity, true);
        me.pool.register("laser", game.LaserEntity, true);
        me.pool.register("minigun", game.MinigunEntity, true);
        me.pool.register("present", game.PresentEntity, true);
        me.pool.register("weaponDrop", game.WeaponDropEntity, true);
		me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("snow", game.SnowEntity, true);
		me.pool.register("mageEnemy", game.MageEnemyEntity, true);
        me.pool.register("mageBoss", game.MageBossEntity, true);
		me.pool.register("meleeEnemy", game.MeleeEnemyEntity, true);
        me.pool.register("archerEnemy", game.ArcherEnemyEntity, true);
		me.pool.register("mageAttackEntity", game.MageAttackEntity, true);
        me.pool.register("archerAttackEntity", game.ArcherAttackEntity, true);
        me.pool.register("bossHPBar", game.HUD.BossHPBar, true);

		//Melee enemy
		game.meleeEnemyTexture = new me.video.renderer.Texture(
			me.loader.getJSON("meleeEnemy"),
			me.loader.getImage("meleeEnemy")
		);
		
		//Mage enemy
		game.mageEnemyTexture = new me.video.renderer.Texture(
			me.loader.getJSON("mageEnemy"),
			me.loader.getImage("mageEnemy")
		);

        //Archer enemy
        game.archerEnemyTexture = new me.video.renderer.Texture(
            me.loader.getJSON("archerEnemy"),
            me.loader.getImage("archerEnemy")
        );

        //Mage boss
        game.mageBossTexture = new me.video.renderer.Texture(
            me.loader.getJSON("mageBoss"),
            me.loader.getImage("mageBoss")
        );

		//Santa
		game.santaTexture = new me.video.renderer.Texture(
			me.loader.getJSON("santa"),
            me.loader.getImage("santa")
		);

        me.state.change(me.state.MENU);
    }
};
