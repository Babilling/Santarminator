/**
 * Weapons entities
 */
 /**
 * BulletEntity
 */
game.BulletEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('bullet');
        settings.width = 29;
        settings.height= 6;
        settings.framewidth = 29;
        settings.frameheight = 6;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.degat = 5;
        this.pos.add(this.body.vel);
        this.body.speed = 20;
        this.body.vel.set(this.body.speed * game.data.speed, 0);
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
		this.body.vel.set(this.body.speed * game.data.speed, 0);
		
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'ennemy') {
            me.audio.play("hurt");
            obj.destroy(this.degat);
            me.game.world.removeChild(this);
        }
        return false;
    },
    endAnimation: function() {
        this.body.speed = 0;
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 96;
        this.endTween
            .to({y: currentPos}, 100)
            .to({y: finalPos}, 100);
        this.endTween.start();
    }
});
/**
 * HadokenEntity
 */
game.HadokenEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('hadoken');
        settings.width = 73;
        settings.height= 64;
        settings.framewidth = 73;
        settings.frameheight = 64;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.degat = 5;
        this.pos.add(this.body.vel);
        this.body.speed = 20;
        this.body.vel.set(this.body.speed * game.data.speed, 0);
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
		this.body.vel.set(this.body.speed * game.data.speed, 0);
		
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'ennemy') {
            me.audio.play("hurt");
            obj.destroy(this.degat);
            me.game.world.removeChild(this);
        }
        return false;
    },
    endAnimation: function() {
        this.body.speed = 0;
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 96;
        this.endTween
            .to({y: currentPos}, 100)
            .to({y: finalPos}, 100);
        this.endTween.start();
    }
});
/**
 * LaserEntity
 */
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
