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
        this.scorePopBoss = 500;
        this.bossPopped = 0;
        this.boss = false;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            let posX = me.game.viewport.width + 50;
            let posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
			let enemiesHp = 10;
            let enemiesPoints = 10;
			if(!this.boss && game.data.steps > (this.bossPopped + 1) * this.scorePopBoss + (this.bossPopped * 1000)) {
			    game.boss = new me.pool.pull('mageBoss', me.game.viewport.width + 50, 50);
                me.game.world.addChild(game.boss, 12);
                this.boss = true;
                this.bossPopped++;
                me.audio.play("bossComing");
            }else if (!this.boss)
                switch(me.Math.random(1, 4)) {
                    case 1 :
                        me.game.world.addChild(new me.pool.pull('meleeEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                        break;
                    case 2 :
                        me.game.world.addChild(new me.pool.pull('archerEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                        break;
                    case 3 :
                        //me.game.world.addChild(new me.pool.pull('mageEnemy', posX, posY, undefined, undefined, enemiesHp, enemiesPoints), 13);
                        break;
                }
        }
        this._super(me.Entity, "update", [dt]);
    },
});