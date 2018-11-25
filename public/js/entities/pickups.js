/**
 * PresentEntity : basic enemies stats
 */
game.PresentEntity = me.Entity.extend({
    init: function(x, y, points) {
        // Default params values
        if (typeof points === 'undefined') { this.points = 10; } else {this.points = points * 5;}

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
        this.cd = 5000;
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
        this._super(me.Entity, "update", [dt]);
        return true;
    }
});

/**
 * WeaponDropEntity : basic enemies stats
 */
game.WeaponDropEntity = me.Entity.extend({
    init: function(x, y) {
        this.weapon =  game.weapon[me.Math.random(0, game.weapon.length)];

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
        this.cd = 5000;
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
        this._super(me.Entity, "update", [dt]);
        return true;
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
        this.cd = 5000;
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
        this._super(me.Entity, "update", [dt]);
        return true;
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
        this.cd = 5000;
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
        this._super(me.Entity, "update", [dt]);
        return true;
    }
});