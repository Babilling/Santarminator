/**
 * Generators entities
 */
 /**
 * EnnemyGenerator
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
        this.difficulty = 1;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            let posX = me.game.viewport.width + 50;
            let posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
            let enemiesHp = this.difficulty * 5;
            if (enemiesHp > 20) enemiesHp = 20;
            let enemiesPoints = 10;
			if(!this.boss && game.data.steps > (this.bossPopped + 1) * this.scorePopBoss + (this.bossPopped * 1000)) {
                switch(me.Math.random(1, 4)) {
                    case 1 :
                        game.boss = new me.pool.pull('mageBoss', me.game.viewport.width + 50, 50, undefined, undefined, enemiesHp * 50);
						me.audio.play("intro_pere_fougasse");
                        break;
                    case 2 :
                        game.boss = new me.pool.pull('treeBoss', me.game.viewport.width + 50, 50, undefined, undefined, enemiesHp * 50);
                        break;
                    case 3 :
                        game.boss = new me.pool.pull('unicornBoss', me.game.viewport.width + 50, 50, undefined, undefined, enemiesHp * 50);
                        break;
                }
			    
                me.game.world.addChild(game.boss, 12);
                this.boss = true;
                this.bossPopped++;
                
            }else if (!this.boss)
                switch(me.Math.random(1, 4)) {
                    case 1 :
                        this.chainPattern(me.Math.random(this.difficulty + 1, this.difficulty + 3), posX, posY, undefined, me.Math.degToRad(me.Math.random(-80, 81)), enemiesHp, enemiesPoints);
                        break;
                    case 2 :
                        this.linePattern(me.Math.random(this.difficulty, this.difficulty + 2), posX, posY, -2, me.Math.degToRad(me.Math.random(-80, 81)), enemiesHp, enemiesPoints, me.Math.random() >= 0.5);
                        break;
                    case 3 :
                        this.linePattern(me.Math.random(this.difficulty, this.difficulty + 2), posX, posY, -2, me.Math.degToRad(me.Math.random(-80, 81)), enemiesHp, enemiesPoints, me.Math.random() >= 0.5);
                        break;
                }
        }
        this._super(me.Entity, "update", [dt]);
    },
    chainPattern: function(size, posX, posY, speed, radX, enemiesHp, enemiesPoints){
        if (posX === undefined) posX = me.game.viewport.width + 50;
        if (posY === undefined) posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
        if (radX === undefined) radX = 0;

        for(var i = 0; i < size; i++){
            me.game.world.addChild(new me.pool.pull('meleeEnemy', posX, posY, speed, radX, enemiesHp, enemiesPoints), 13);
            posX += 30;
            posY += 20 * Math.tan(radX);
        }
    },
    linePattern: function(size, posX, posY, speed, radX, enemiesHp, enemiesPoints, vertical){
        if (posX === undefined) posX = me.game.viewport.width + 50;
        if (posY === undefined) posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
        if (radX === undefined) radX = 0;

        for(var i = 0; i < size; i++){
            let enemy = new me.pool.pull(Math.random() < 0.5 ? 'mageEnemy' : 'archerEnemy', posX, posY, speed, radX, enemiesHp, enemiesPoints, 2);
            me.game.world.addChild(enemy,13);
            if(vertical)
                posY += enemy.height + 10;
            else
                posX += enemy.width;
        }
    },
});


