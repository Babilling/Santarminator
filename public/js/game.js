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
		{name: "hadoken", type:"image", src: "data/img/hadoken.png"},
        {name: "laser", type:"image", src: "data/img/laser.png"},

        // Ennemies
		{name: "meleeEnemy", type:"image", src: "data/img/enemy1.png"},
		{name: "meleeEnemy", type:"json", src: "data/img/enemy1.json"},
		{name: "mageEnemy", type:"image", src: "data/img/enemy2.png"},
		{name: "mageEnemy", type:"json", src: "data/img/enemy2.json"},
		{name: "projectile", type:"image", src: "data/img/projectile2.png"},

        // Decoration
        {name: "pipe", type:"image", src: "data/img/pipe.png"},
        {name: "pipe2", type:"image", src: "data/img/pipe2.png"},
        {name: "pipe3", type:"image", src: "data/img/pipe3.png"},
        {name: "pipebis", type:"image", src: "data/img/pipebis.png"},
        {name: "pipe2bis", type:"image", src: "data/img/pipe2bis.png"},
        {name: "pipe3bis", type:"image", src: "data/img/pipe3bis.png"},
        {name: "snow", type:"image", src: "data/img/snow.png"},
        {name: "logo", type:"image", src: "data/img/logo.png"},
		{name: "santa_default", type:"image", src: "data/img/santa_default.png"},
		{name: "santa_default", type:"json", src: "data/img/santa_default.json"},

        {name: "gameover", type:"image", src: "data/img/gameover.png"},
		{name: "tablo", type:"image", src: "data/img/tablo.png"},
		{name: "tablo12", type:"image", src: "data/img/tablo12.png"},
        {name: "gameoverbg", type:"image", src: "data/img/gameoverbg.png"},
        {name: "hit", type:"image", src: "data/img/hit.png"},
        {name: "getready", type:"image", src: "data/img/getready.png"},
        {name: "new", type:"image", src: "data/img/new.png"},

        // sounds
        {name: "theme", type: "audio", src: "data/bgm/"},
        {name: "hit", type: "audio", src: "data/sfx/"},
        {name: "hurt", type: "audio", src: "data/sfx/"},
        {name: "lose", type: "audio", src: "data/sfx/"},
        {name: "bullet", type: "audio", src: "data/sfx/"},
		{name: "hadoken", type: "audio", src: "data/sfx/"},
        {name: "laser", type: "audio", src: "data/sfx/"},
		{name: "balledeboulepremium", type: "audio", src: "data/sfx/"},
        {name: "balle de boule", type: "audio", src: "data/sfx/"},
        {name: "cabiche", type: "audio", src: "data/sfx/"},
        {name: "cest du bon", type: "audio", src: "data/sfx/"},
        {name: "fatchdefitch", type: "audio", src: "data/sfx/"},
        {name: "onestbienla", type: "audio", src: "data/sfx/"},
        {name: "tesdanslaxe", type: "audio", src: "data/sfx/"},

    ],

    weapon: [
        // 0 is default
        {type: "bullet", x: 40, y: 45, cd: 300, sound: "bullet"},
		{type: "hadoken", x: 40, y: 9, cd: 300, sound: "hadoken"},
        {type: "laser", x: 60, y: 9, cd: 50, sound: "laser"}
    ],

    "onload": function() {
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

    "loaded": function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.pool.register("bullet", game.BulletEntity, true);
		me.pool.register("hadoken", game.BulletEntity, true);
        me.pool.register("laser", game.LaserEntity, true);
		me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("snow", game.SnowEntity, true);
		me.pool.register("mageEnemy", game.MageEnemyEntity, true);
		me.pool.register("meleeEnemy", game.MeleeEnemyEntity, true);
		me.pool.register("projectile", game.MageAttackEntity, true);

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

		//Santa
		game.texture = new me.video.renderer.Texture(
			me.loader.getJSON("santa_default"),
			me.loader.getImage("santa_default")
		);

        me.state.change(me.state.MENU);
    }
};
