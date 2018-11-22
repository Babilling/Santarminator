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

        this.boss = false;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            let posX = me.game.viewport.width + 50;
            let posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
			let enemiesHp = 10;
			let enemiesPoints = 10;
			if(!this.boss) {
			    game.boss = new me.pool.pull('mageBoss', me.game.viewport.width + 50, 50);
                me.game.world.addChild(game.boss, 13);
                this.boss = true;
            }
			switch(me.Math.random(1, 4)) {
                case 1 :
                    me.game.world.addChild(new me.pool.pull('meleeEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                    break;
                case 2 :
                    //me.game.world.addChild(new me.pool.pull('archerEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                    break;
                case 3 :
                    //me.game.world.addChild(new me.pool.pull('mageEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                    break;
            }
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
            var posY = me.Math.random(
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
            var posX = me.Math.random(100, me.video.renderer.getWidth());
            var posY = -5;
            me.game.world.addChild(new me.pool.pull('snow', posX, posY), 5);

            posX = me.video.renderer.getWidth() + 5;
            posY = me.Math.random(100, me.video.renderer.getHeight());
            me.game.world.addChild(new me.pool.pull('snow', posX, posY), 5);
        }
        this._super(me.Entity, "update", [dt]);
    },
});