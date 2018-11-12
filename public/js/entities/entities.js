/**
 * Santa entiry
 */
game.SantaEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y) {

        // call the super constructor
        this._super(me.Entity, "init", [200, 140, {width : 72, height : 98}]);

        // create an animation using the cap guy sprites, and add as renderable
        this.renderable = game.texture.createAnimationFromName([
            "Armature_Fly_0", "Armature_Fly_1", "Armature_Fly_2", "Armature_Fly_3", "Armature_Fly_4",
			"Armature_Fly_5", "Armature_Fly_6", "Armature_Fly_7", "Armature_Fly_8", "Armature_Fly_9",
			"Armature_Fly_10", "Armature_Fly_11", "Armature_Fly_12", "Armature_Fly_13", "Armature_Fly_14",
			"Armature_Fly_15", "Armature_Fly_16", "Armature_Fly_17", "Armature_Fly_18", "Armature_Fly_19",
			"Armature_Fly_20", "Armature_Fly_21", "Armature_Fly_22", "Armature_Fly_23", "Armature_Fly_24",
			"Armature_Fly_25", "Armature_Fly_26", "Armature_Fly_27", "Armature_Fly_28", "Armature_Fly_29", 
			"Armature_Fly_30"
        ]);

        // enable this, since the entity starts off the viewport
        this.alwaysUpdate = true;
		
		// collision shape
        this.collided = false;
        this.weapon = game.weapon[0];
        this.lastShot = 0;

        this.velY = 5;
        this.velX = 5;
    },
	update: function(dt) {
        var that = this;
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.renderable.currentTransform.identity();
        if (me.input.isKeyPressed('shot')) {
            if (Date.now() - this.lastShot > this.weapon.cd){
                this.lastShot = Date.now();
                me.audio.play(this.weapon.sound);
                me.game.world.addChild(new me.pool.pull(this.weapon.type, this.pos.x + this.weapon.x, this.pos.y + this.weapon.y), 11);
            }
        }
        if (me.input.isKeyPressed('forward')) {
            this.pos.y -= this.velY * game.data.speed;
            if (this.pos.y < 25) this.pos.y = 25;
        }
        if (me.input.isKeyPressed('backward')) {
            this.pos.y += this.velY * game.data.speed;
            if (this.pos.y > me.game.viewport.height - 30) this.pos.y = me.game.viewport.height - 30;
        }
        if (me.input.isKeyPressed('left')) {
            this.pos.x -= this.velX * game.data.speed;
            if (this.pos.x < 37) this.pos.x = 37;
        }
        if (me.input.isKeyPressed('right')) {
            this.pos.x += this.velX * game.data.speed;
            if (this.pos.x > me.game.viewport.width - 47) this.pos.x = me.game.viewport.width - 47;
        }
        me.Rect.prototype.updateBounds.apply(this);

        if (this.collided) {
            game.data.start = false;
            me.audio.play("lose");
            this.endAnimation();
        }
        me.collision.check(this);

        if (Date.now() - game.data.dateStart > 25000)
            game.data.speed = 2;
		
		 // call the parent function
		this._super(me.Entity, "update", [dt]);
        return true;
    },

    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'ennemy') {
            me.device.vibrate(500);
            this.collided = true;
        }
        return false;
    },

    endAnimation: function() {
        me.game.viewport.fadeOut("#fff", 100);
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 96;
        this.endTween
            .to({y: currentPos}, 1000)
            .to({y: finalPos}, 1000)
            .onComplete(function() {
                me.state.change(me.state.GAME_OVER);
            });
        this.endTween.start();
    }
});

// =======================
//       WEAPON
// =======================
game.BulletEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('bullet');
        settings.width = 73;
        settings.height= 64;
        settings.framewidth = 73;
        settings.frameheight = 64;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(20 * game.data.speed, 0);
        this.type = 'weapon';
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x > me.game.viewport.width) {
            me.game.world.removeChild(this);
        }
		this.body.vel.set(20 * game.data.speed, 0);
		
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);

        if (this.collided) {
            // TODO
            me.game.world.removeChild(this);
        }
        //me.collision.check(this);
        return true;
    },

onCollision: function(response) {
    var obj = response.b;
    if (obj.type === 'ennemy') {
        me.device.vibrate(500);
        this.collided = true;
    }
    return false;
},

endAnimation: function() {
    me.game.viewport.fadeOut("#fff", 100);
    var currentPos = this.pos.y;
    this.endTween = new me.Tween(this.pos);
    this.endTween.easing(me.Tween.Easing.Exponential.InOut);
    this.renderable.currentTransform.identity();
    this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
    var finalPos = me.game.viewport.height - this.renderable.width/2 - 96;
    this.endTween
        .to({y: currentPos}, 1000)
        .to({y: finalPos}, 1000)
        .onComplete(function() {
            me.state.change(me.state.GAME_OVER);
        });
    this.endTween.start();
}
});

game.LaserEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('laser');
        settings.width = 1500;
        settings.height= 67;
        settings.framewidth = 1500;
        settings.frameheight = 67;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(0, 0);
        this.type = 'weapon';
        this.date = Date.now();
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > 50) {
            me.game.world.removeChild(this);
        }
		this.body.vel.set(0, 0);
		
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    }
});

// =======================
//       ENNEMIES
// =======================
game.SimpleEnemyEntity = me.Entity.extend({
    init: function(x, y, enemyType) {

		if (enemyType == 1) {
			// call the super constructor
			this._super(me.Entity, "init", [x, y, {width : 80, height : 80}]);
			// create an animation using the cap guy sprites, and add as renderable
			this.renderable = game.meleeEnemyTexture.createAnimationFromName([
				"5_ATTACK_000", "5_ATTACK_002", "5_ATTACK_003", "5_ATTACK_004", "5_ATTACK_005"
			]);
		}else if (enemyType == 2) {
			// call the super constructor
			this._super(me.Entity, "init", [x, y, {width : 69, height : 77}]);
			// create an animation using the cap guy sprites, and add as renderable
			this.renderable = game.mageEnemyTexture.createAnimationFromName([
				"2_ATTACK_001", "2_ATTACK_002", "2_ATTACK_003"
			]);
		}
		
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'ennemy';
        this.xGenere = -5;
        this.yGenere = Number.prototype.random(-2, 2);
        this.body.vel.set(this.xGenere, this.yGenere);
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.width || this.pos.y < -this.height || this.pos.y > me.game.viewport.width) {
            me.game.world.removeChild(this);
        }
		this.body.vel.set(this.xGenere, this.yGenere);
		
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.EnnemyGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 80]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 80;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            var posX = me.game.viewport.width + 50;
            var posY = Number.prototype.random(100, me.video.renderer.getHeight() - 100);
			me.game.world.addChild(new me.pool.pull('simpleEnemy', posX, posY, randomIntFromInterval(1,2)), 13);
        }
        this._super(me.Entity, "update", [dt]);
    },
});

// =======================
//       DECORATION
// =======================
game.PipeEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        var building = Math.random();
        if (building > 0.9)
            settings.image = this.image = me.loader.getImage('pipe');
        else if (building > 0.8)
            settings.image = this.image = me.loader.getImage('pipe2');
        else if (building > 0.7)
            settings.image = this.image = me.loader.getImage('pipe3');
        else if (building > 0.6)
            settings.image = this.image = me.loader.getImage('pipebis');
        else if (building > 0.5)
            settings.image = this.image = me.loader.getImage('pipe2bis');
        else 
            settings.image = this.image = me.loader.getImage('pipe3bis');
        settings.width = 250;
        settings.height= 554;
        settings.framewidth = 250;
        settings.frameheight = 554;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(-5 * game.data.speed, 0);
        this.type = 'pipe';
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
		this.body.vel.set(-10 * game.data.speed, 0);
		
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.PipeGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 80]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 80;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % Math.floor(this.pipeFrequency / (game.data.speed * 2)) == 0) {
            var posY = Number.prototype.random(
                    me.video.renderer.getHeight() - 100,
                    150
            );
            me.game.world.addChild(new me.pool.pull('pipe', this.posX, posY), 10);
        }
        this._super(me.Entity, "update", [dt]);
    },
});

game.SnowEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('snow');
        settings.width = 10;
        settings.height= 10;
        settings.framewidth = 10;
        settings.frameheight = 10;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(-5 * game.data.speed, 2);
        this.type = 'snow';
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width || this.pos.y < -this.image.height) {
            me.game.world.removeChild(this);
        }
		this.body.vel.set(-5 * game.data.speed, 2);
		
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.SnowGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 10]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 10;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % Math.floor(this.pipeFrequency / (game.data.speed * 2)) == 0) {
            var posX = Number.prototype.random(100, me.video.renderer.getWidth());
            var posY = -5;
            me.game.world.addChild(new me.pool.pull('snow', posX, posY), 5);

            posX = me.video.renderer.getWidth() + 5;
            posY = Number.prototype.random(100, me.video.renderer.getHeight());
            me.game.world.addChild(new me.pool.pull('snow', posX, posY), 5);
        }
        this._super(me.Entity, "update", [dt]);
    },
});

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}