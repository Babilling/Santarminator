game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
    init: function() {
        this._super(me.Container, 'init');
        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(me.game.viewport.width/9, 5));
        this.addChild(new game.HUD.SpecialWeaponItem(me.game.viewport.width/9, 55));
    }
});


game.HUD.ScoreItem = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [x, y, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('gamefont', 50, '#000', 'center');

        // make sure we use screen coordinates
        this.floating = true;
    },

    draw: function (renderer) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(renderer, game.data.steps, this.pos.x, this.pos.y);
    }

});

/* Time left for special weapons
*/
game.HUD.SpecialWeaponItem = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [x, y, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('gamefont', 50, '#000', 'center');

        // make sure we use screen coordinates
        this.floating = true;
    },

    draw: function (renderer) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY) && game.santa.weapon.class === "special")
            this.stepsFont.draw(renderer, 
                (Math.round(game.santa.weapon.duration - (Date.now() - game.santa.pickWeaponTime)) / 1000).toFixed(2) + " s", 
                this.pos.x, this.pos.y);
    }

});

game.HUD.BossHPBar = me.Renderable.extend({
    init: function(x, y, maxHP) {
        this._super(me.Renderable, "init", [x, y, 500, 20]);
        if (typeof maxHP === 'undefined') { this.maxHP = 1000; } else {this.maxHP = maxHP;}
        // make sure we use screen coordinates
        this.floating = true;
        this.lostHPPercent = 0;
    },

    draw: function(renderer) {
        if(game.boss.hp === this.maxHP) {
            renderer.save();
            if(game.boss.invulnerable)
                renderer.setColor('#3b86ff');
            else
                renderer.setColor('#0f0');
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            renderer.setColor('#ffba2d');
            renderer.fillRect(this.pos.x+this.width/4, this.pos.y, 2, this.height);
            renderer.fillRect(this.pos.x+this.width/2, this.pos.y, 2, this.height);
            renderer.fillRect(this.pos.x+(this.width/4)*3, this.pos.y, 2, this.height);
            renderer.restore();
        }
        else {
            renderer.save();
            renderer.setColor('#f00');
            renderer.fillRect(this.pos.x + this.width - (this.lostHPPercent*5), this.pos.y, this.width - (this.width - (this.lostHPPercent*5)), this.height);
            renderer.setColor('#0f0');
            renderer.fillRect(this.pos.x, this.pos.y, this.width - (this.lostHPPercent*5), this.height);
            renderer.restore();
        }
    },

    update: function (dt) {
        this._super(me.Renderable, "update", [dt]);
        if(!me.game.enemyGenerator.boss || game.boss.hp <= 0)
            me.game.world.removeChild(this);
    }

});

var BackgroundLayer = me.ImageLayer.extend({
    init: function(image, z, speed) {
        var settings = {};
        settings.name = image;
        settings.width = 900;
        settings.height = 600;
        settings.image = image;
        settings.z = z;
        settings.ratio = 1;
        // call parent constructor
        this._super(me.ImageLayer, 'init', [0, 0, settings]);
    },

    update: function() {
        return true;
    }
});
