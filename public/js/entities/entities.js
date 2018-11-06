game.BirdEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = 'clumsy';
        settings.width = 85;
        settings.height = 60;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.removeShapeAt(0);
        this.body.addShape(new me.Ellipse(5, 5, 71, 51));
        // collision shape
        this.collided = false;
        this.weapon = game.weapon[1];
        this.lastShot = 0;

        this.velY = 5;
        this.velX = 5;

        this.renderable.addAnimation("fly", [ 0, 1, 2]);
        this.renderable.setCurrentAnimation("fly");
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
        return true;
    },

    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'pipe') {
            me.device.vibrate(500);
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

/**
 * Santa entiry
 */
game.SantaEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y) {

        // call the super constructor
        this._super(me.Entity, "init", [200, 140, {width : 103, height : 107}]);

        // create an animation using the cap guy sprites, and add as renderable
        this.renderable = game.texture.createAnimationFromName([
            "santa1", "santa2", "santa3"
        ]);

        // enable this, since the entity starts off the viewport
        this.alwaysUpdate = true;
		
		// collision shape
        this.collided = false;
        this.weapon = game.weapon[1];
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
});

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
        this.type = 'bullet';
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
        return true;
    },

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
        this.type = 'laser';
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