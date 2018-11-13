/**
 * Decoration entities
 */
 /**
 * PipeEntity
 */
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
/**
 * SnowEntity
 */
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