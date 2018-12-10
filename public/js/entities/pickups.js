/**
 * PresentEntity : basic enemies stats
 */
game.PresentEntity = me.Entity.extend({
    init: function(x, y, points) {
        // Default params values
        if (typeof points === 'undefined') { this.points = 20; } else {this.points = points * 2;}

        var settings = {};
        settings.image = this.image = me.loader.getImage('present' + me.Math.random(1, 4));
        settings.width = 32;
        settings.height= 32;
        settings.framewidth = 32;
        settings.frameheight = 32;
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'present';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(0, 0);
        this.date = Date.now();
        this.cd = 10000;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > this.cd)
            me.game.world.removeChild(this);

        this.body.vel.set(0, 0);
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'santa'){
            game.data.steps += this.points;
            me.game.world.removeChild(this);
            me.audio.play("presentDrop");
        }
            
        return false;
    }
});

/**
 * WeaponDropEntity : basic enemies stats
 */
game.WeaponDropEntity = me.Entity.extend({
    init: function(x, y) {
        this.weapon =  game.weapon[me.Math.random(1, game.weapon.length)];

        var settings = {};
        settings.image = this.image = me.loader.getImage('drop-' + this.weapon.type);
        settings.width = 32;
        settings.height= 32;
        settings.framewidth = 32;
        settings.frameheight = 32;
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'weaponDrop';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(0, 0);
        this.date = Date.now();
        this.cd = 10000;
        this.pickedup = false;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > this.cd)
            me.game.world.removeChild(this);

        this.body.vel.set(0, 0);
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'santa' && !this.pickedup) {
            this.pickedup = true;
            if (this.weapon.class === "basic") game.santa.defaultWeapon = this.weapon;
            if (game.santa.weapon.class != "special" || this.weapon.class === "special") {
                game.santa.weapon.resetWeapon();
                game.santa.weapon = this.weapon;
                game.santa.renderable.setCurrentAnimation(this.weapon.type);
            }
            me.game.world.removeChild(this);
            me.audio.play("weaponDrop");
        }
            
        return false;
    }
});

/**
 * DamageUpEntity : dégat+ sur santa
 */
game.DamageUpEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('damageUp');
        settings.width = 32;
        settings.height= 32;
        settings.framewidth = 32;
        settings.frameheight = 32;
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'damageUpDrop';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(0, 0);
        this.date = Date.now();
        this.cd = 10000;
        this.pickedup = false;
        this.points = 10;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > this.cd)
            me.game.world.removeChild(this);

        this.body.vel.set(0, 0);
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'santa' && !this.pickedup){
            this.pickedup = true;
            game.santa.damage++;
            if (game.santa.damage > 5) {
                game.santa.damage = 5;
                game.data.steps += this.points;
            }
            me.game.world.removeChild(this);
            me.audio.play("damageDrop");
        }
            
        return false;
    }
});

/**
 * SpeedUpEntity : speed+ sur santa
 */
game.SpeedUpEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('speedUp');
        settings.width = 32;
        settings.height= 32;
        settings.framewidth = 32;
        settings.frameheight = 32;
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'speedUpDrop';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(0, 0);
        this.date = Date.now();
        this.cd = 10000;
        this.pickedup = false;
        this.points = 10;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > this.cd)
            me.game.world.removeChild(this);

        this.body.vel.set(0, 0);
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'santa' && !this.pickedup){
            this.pickedup = true;
            game.santa.speed++;
            if (game.santa.speed > 5) {
                game.santa.speed = 5;
                game.data.steps += this.points;
            }
            me.game.world.removeChild(this);
            me.audio.play("speedDrop");
        }
            
        return false;
    }
});

/**
 * ShieldDropEntity : shield sur santa
 */
game.ShieldDropEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('shieldDrop');
        settings.width = 32;
        settings.height= 32;
        settings.framewidth = 32;
        settings.frameheight = 32;
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'shieldDrop';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(0, 0);
        this.date = Date.now();
        this.cd = 10000;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (Date.now() - this.date > this.cd)
            me.game.world.removeChild(this);

        this.body.vel.set(0, 0);
        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'santa'){
            if (!game.santa.isProtected)
                me.game.world.addChild(new me.pool.pull("shield", game.santa.pos.x, game.santa.pos.y), 13);
            me.game.world.removeChild(this);
            me.audio.play("shieldDrop");
        }
            
        return false;
    }
});

/**
 * ShieldEntity
 */
game.ShieldEntity = me.Entity.extend({
    init: function(x, y) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('shield');
        settings.width = 120;
        settings.height= 118;
        settings.framewidth = 120;
        settings.frameheight = 118;

        this._super(me.Entity, "init", [x - 21, y - 9, settings]);
        this.body.vel.set(0, 0);
        this.renderable.anchorPoint = {"x" : 0, "y" : 0};
        this.anchorPoint = {"x" : 0, "y" : 0};
        this.body.addShape(new me.Ellipse(70,60,120,120));
        this.body.removeShapeAt(0);
        this.type = "shield";
        game.santa.isProtected = true;
    },
    update: function(dt) {
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.x = game.santa.pos.x - 21;
        this.pos.y = game.santa.pos.y - 9;
        this.body.vel.set(0, 0);

        me.Rect.prototype.updateBounds.apply(this);
        me.collision.check(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    onCollision: function(response) {
        let obj = response.b;
        if (obj.type === 'ennemy'){
            me.game.world.removeChild(this);
            game.santa.isProtected = false;
            me.audio.play("bubblePop");
        }
        else if (obj.type === 'attack'){
            me.game.world.removeChild(obj);
            me.game.world.removeChild(this);
            game.santa.isProtected = false;
            me.audio.play("bubblePop");
        }
            
        return false;
    }
});