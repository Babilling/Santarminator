/**
 * Weapons entities
 */
/**
 * WeaponEntity
 */
game.WeaponEntity = me.Entity.extend({
    init: function(x, y, settings, degat) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        if (typeof degat === 'undefined') { this.degat = 5; } else {this.degat = degat;}
        this.pos.add(this.body.vel);
        this.body.speed = 40;
        this.body.vel.set(this.body.speed, 0);
        this.enemies = [];
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
        this.body.vel.set(this.body.speed, 0);

        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'ennemy' && !this.enemies.includes(obj) && (obj.pos.x + obj.width / 2) < me.game.viewport.width) {
            this.enemies.push(obj);
            obj.destroy(this.degat + game.santa.damage);
        }
        return false;
    }
});
 /**
 * BulletEntity
 */
game.BulletEntity = game.WeaponEntity.extend({
    init: function(x, y) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('bullet');
        settings.width = 29;
        settings.height= 6;
        settings.framewidth = 29;
        settings.frameheight = 6;

        this._super(game.WeaponEntity, 'init', [x, y, settings]);
        this.body.speed = 40;
        this.body.vel.set(this.body.speed, 0);
    },
    onCollision: function(response) {
        this._super(game.WeaponEntity, 'onCollision', [response]);
        if (response.b.type === 'ennemy')
            me.game.world.removeChild(this);
        return false;
    }
});
/**
 * ShotgunEntity
 */
game.ShotgunEntity = game.WeaponEntity.extend({
    init: function(x, y, rad) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('shotgun');
        settings.width = 6;
        settings.height= 6;
        settings.framewidth = 6;
        settings.frameheight = 6;

        this._super(game.WeaponEntity, 'init', [x, y, settings, 10]);
        this.defaultSpeed = 10 + me.Math.random(5, 10);
        this.duration = 500;
        this.minDegat = 5;
        this.body.vel.set(this.defaultSpeed, 0);
        this.body.vel = this.body.vel.rotate(rad);
        this.rad = rad;
        this.date = Date.now();
    },

    update: function(dt) {
        this._super(game.WeaponEntity, 'update', [dt]);
        if (Date.now() - this.date > this.duration)
            me.game.world.removeChild(this);
		this.body.vel.set(this.defaultSpeed - (Date.now() - this.date) * this.defaultSpeed / this.duration, 0);
        this.body.vel = this.body.vel.rotate(this.rad);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'ennemy' ) {
            let partDegat = this.degat - this.minDegat;
            obj.destroy(partDegat - (Date.now() - this.date) * partDegat / this.duration + this.minDegat);
            me.game.world.removeChild(this);
        }
        return false;
    },
});
/**
 * AkEntity
 */
game.AkEntity = game.WeaponEntity.extend({
    init: function(x, y) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('ak');
        settings.width = 29;
        settings.height= 6;
        settings.framewidth = 29;
        settings.frameheight = 6;

        this._super(game.WeaponEntity, 'init', [x, y, settings, 3]);
        this.body.speed = 20;
        this.body.vel.set(this.body.speed, 0);
    },
    onCollision: function(response) {
        this._super(game.WeaponEntity, 'onCollision', [response]);
        if (response.b.type === 'ennemy')
            me.game.world.removeChild(this);
        return false;
    }
});
/**
 * HadokenEntity
 */
game.HadokenEntity = game.WeaponEntity.extend({
    init: function(x, y) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('hadoken');
        settings.width = 73;
        settings.height= 64;
        settings.framewidth = 73;
        settings.frameheight = 64;

        this._super(game.WeaponEntity, 'init', [x, y, settings, 50]);
        this.body.speed = 20;
        this.body.vel.set(this.body.speed, 0);
        this.enemies = [];
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'ennemy' && !this.enemies.includes(obj) && (obj.pos.x + obj.width / 2) < me.game.viewport.width) {
            this.enemies.push(obj);
            obj.destroy(this.degat + game.santa.damage);
        }
        else if (obj.type === 'attack')
            me.game.world.removeChild(obj);
            
        return false;
    }
});
/**
 * LaserEntity
 */
game.LaserEntity = game.WeaponEntity.extend({
    init: function(x, y) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('laser');
        settings.width = 1500;
        settings.height= 67;
        settings.framewidth = 1500;
        settings.frameheight = 67;

        this._super(game.WeaponEntity, 'init', [x, y, settings, 5]);
        this.body.vel.set(0, 0);
        this.date = Date.now();
    },

    update: function(dt) {
        this._super(game.WeaponEntity, 'update', [dt]);
        this.body.vel.set(0, 0);
        if (Date.now() - this.date > 50)
            me.game.world.removeChild(this);
        return true;
    }
});

/**
 * MinigunEntity
 */
game.MinigunEntity = game.WeaponEntity.extend({
    init: function(x, y, rad) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('minigun');
        settings.width = 29;
        settings.height= 6;
        settings.framewidth = 29;
        settings.frameheight = 6;

        this._super(game.WeaponEntity, 'init', [x, y, settings]);
        this.body.speed = 20;
        this.body.vel.set(this.body.speed, 0);
        this.body.vel = this.body.vel.rotate(rad);
        this.rad = rad;
    },

    update: function(dt) {
        this._super(game.WeaponEntity, 'update', [dt]);
        this.body.vel = this.body.vel.rotate(this.rad);
        return true;
    },

    onCollision: function(response) {
        this._super(game.WeaponEntity, 'onCollision', [response]);
        if (response.b.type === 'ennemy')
            me.game.world.removeChild(this);
        return false;
    }
});