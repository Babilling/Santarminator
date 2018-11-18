/**
 * Enemies entities
 */
/**
 * EnemyEntity : basic enemies stats
 */
game.EnemyEntity = me.Entity.extend({
    init: function(x, y, settings, velX, velY, hp, points) {
        // Default params values
        /*************************************************************************/
        if (typeof velX === 'undefined') { this.velX = -5; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = me.Math.random(-2, 2); } else {this.velY = velY;}
        if (typeof hp === 'undefined') { this.hp = 1; } else {this.hp = hp;}
        if (typeof points === 'undefined') { this.points = 10; } else {this.points = points;}
        /*************************************************************************/
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'ennemy';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(this.velX, this.velY);
        this.animationSpeed = 333;
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.width || this.pos.y < -this.height || this.pos.y > me.game.viewport.width) {
            me.game.world.removeChild(this);
        }
        this.body.vel.set(this.velX, this.velY);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    destroy: function(damage){
        // Already dead ?
        if (this.hp >= 0){
            this.hp -= damage;
            if (this.hp <= 0){
                game.data.steps += this.points;
                me.game.world.removeChild(this);
                // TODO Drop gifts
                me.audio.play("hit");
            }
            else if (this.hp > 0)
                me.audio.play("hurt");
        }
    }
});
/**
 * RangedEnemyEntity : launch ranged attacks
 */
game.RangedEnemyEntity = game.EnemyEntity.extend({
    init: function (x, y, settings, velX, velY, hp, points) {
        this._super(game.EnemyEntity, "init", [x, y, settings, velX, velY, hp, points]);
        this.startAttackTimer(this.animationSpeed * this.attackFrames.length);
    },

    startAttackTimer : function (timerDelay) {
        let _this = this;
        this.intervalID = me.timer.setInterval(function () {
            me.game.world.addChild(new me.pool.pull('projectile', _this.pos.x - 5, _this.pos.y + 24, undefined, undefined, true, 3), 14);
        }, timerDelay);
    },

    onDeactivateEvent : function () {
        me.timer.clearInterval(this.intervalID);
    }
});
/**
 * MageEnemyEntity
 */
game.MageEnemyEntity = game.RangedEnemyEntity.extend({
    init: function(x, y, velX, velY, hp, points) {
        // Texture
        this.attackFrames = [0,1,2];
        this._super(game.RangedEnemyEntity, "init", [x, y, {width : 77, height : 69}, velX, velY, hp, points]);
        this.renderable = game.mageEnemyTexture.createAnimationFromName([
            "2_ATTACK_001", "2_ATTACK_002", "2_ATTACK_003"
        ]);
        this.renderable.addAnimation ("attack", [0,1,2], this.animationSpeed);
        this.renderable.setCurrentAnimation("attack");
    },

    update: function(dt) {
        this._super(game.RangedEnemyEntity, "update", [dt]);
        if(this.pos.x <= me.game.viewport.width-150) {this.body.vel.set(0, this.velY);}
    }

});
/**
 * MeleeEnemyEntity
 */
game.MeleeEnemyEntity = game.EnemyEntity.extend({
    init: function(x, y, velX, velY, hp, points) {
        // Texture and animation
        this._super(game.EnemyEntity, "init", [x, y, {width : 80, height : 80}, velX, velY, hp, points]);
        this.renderable = game.meleeEnemyTexture.createAnimationFromName([
            "5_ATTACK_000", "5_ATTACK_002", "5_ATTACK_003", "5_ATTACK_004", "5_ATTACK_005"
        ]);
        let attackFrames = [1,2,3,4,5];
        this.animationSpeed = 200;
        this.renderable.addAnimation ("attack", attackFrames,this.animationSpeed);
        this.renderable.setCurrentAnimation("attack");
    }
});
/**
 * MageAttackEntity
 */
game.MageAttackEntity = me.Entity.extend({

    init: function(x, y, velX, velY, explode, childs, rad) {
		var settings = {};
        settings.image = this.image = me.loader.getImage('projectile');
        settings.width = 22;
        settings.height= 22;
        settings.framewidth = 22;
        settings.frameheight = 22;
        this.explosionDelay = 500;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = new me.Vector2d(0,0);
        this.type = 'attack';
		this.xGenere = velX;
		this.yGenere = velY;
		this.explode = explode;
        this.childs = childs;
		this.timeCreated = Date.now();
		if(this.xGenere == undefined)
			this.xGenere = -10;
		if(this.yGenere == undefined)
			this.yGenere = 0;
        if(this.explode == undefined)
            this.explode = false;
        if(this.childs == undefined)
            this.childs = 0;
        this.body.vel.set(this.xGenere, this.yGenere);

        if (rad != undefined && !this.explode){
            this.body.vel = this.body.vel.rotate(rad);
            this.rad = rad;
        }
    },

    update: function(dt) {
        // mechanics
		
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.width || this.pos.y < -this.height || this.pos.y > me.game.viewport.width) {
            me.timer.clearTimeout(this.timeoutID);
            me.game.world.removeChild(this);
        }
        //explode
        if(((Date.now() - this.timeCreated) >= this.explosionDelay) && this.explode){
            this.createExplosion(this.childs);
            this.explode = false;
            me.game.world.removeChild(this);
        }
        this.body.vel.set(this.xGenere, this.yGenere);
        if (this.rad != undefined && !this.explode)
            this.body.vel = this.body.vel.rotate(this.rad);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
	
	destroy: function(){
		
	},

    createExplosion : function (childs) {
        var i;
        for(i = 0; i < childs; i++) {
            var rad = me.Math.degToRad(360 / childs * (i + 1));
            me.game.world.addChild(new me.pool.pull('projectile', this.pos.x, this.pos.y, 0, -5, false, 0, rad), 14);
        }
    }
});
