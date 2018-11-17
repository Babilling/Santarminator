/**
 * Generators entities
 */
 /**
 * SnowGenerator
 */
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
			var enemiesHp = 10;
			var enemiesPoints = 10;
			if(randomIntFromInterval(1,2) == 1)
				me.game.world.addChild(new me.pool.pull('mageEnemy', posX, posY, enemiesHp, enemiesPoints), 13);
			else
				me.game.world.addChild(new me.pool.pull('mageEnemy', posX, posY, enemiesHp, enemiesPoints), 13);
        }
        this._super(me.Entity, "update", [dt]);
    },
});
/**
 * SnowGenerator
 */
game.PipeGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 80]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 80;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % Math.floor(this.pipeFrequency / 2) == 0) {
            var posY = Number.prototype.random(
                    me.video.renderer.getHeight() - 100,
                    150
            );
            me.game.world.addChild(new me.pool.pull('pipe', this.posX, posY), 10);
        }
        this._super(me.Entity, "update", [dt]);
    },
});
/**
 * SnowGenerator
 */
game.SnowGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 10]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 10;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % Math.floor(this.pipeFrequency / 2) == 0) {
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