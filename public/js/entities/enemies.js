/**
 * Enemies entities
 */
/**
 * MageEnemyEntity
 */
game.MageEnemyEntity = me.Entity.extend({
    init: function(x, y, hp, points) {
		
		this._super(me.Entity, "init", [x, y, {width : 80, height : 80}]);

		this.renderable = game.mageEnemyTexture.createAnimationFromName([
				"2_ATTACK_001", "2_ATTACK_002", "2_ATTACK_003"
		]);
		this.timerDelay = 1000;
		this.renderable.addAnimation ("attack", [0,1,2],this.timerDelay/3);
        this.startAttackTimer(this.timerDelay);
		this.renderable.setCurrentAnimation("attack");

        this.hp = hp;
        this.points = points;
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'ennemy';
        this.xGenere = -5;
        this.yGenere = me.Math.random(-2, 2);
        this.body.vel.set(this.xGenere, this.yGenere);
    },
	
	startAttackTimer : function (timerDelay) {
		var _this = this;
		this.intervalID = me.timer.setInterval(function () {
			me.game.world.addChild(new me.pool.pull('projectile', _this.pos.x - 5, _this.pos.y + 24, undefined, undefined, true, 3), 14);
		}, timerDelay);
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
		this.body.vel.set(this.xGenere, this.yGenere);
        me.Rect.prototype.updateBounds.apply(this);
		
        this._super(me.Entity, "update", [dt]);
		
		
        return true;
    },
	
    destroy: function(degat){
        this.hp -= degat;
        if (this.hp <= 0){
            game.data.steps += this.points;
            me.game.world.removeChild(this);
            // TODO Drop gifts (ils doivent �tre ramass�s ou pas ?)
            me.audio.play("hit");
        }
            
    },
	
	onDeactivateEvent : function () {
		me.timer.clearInterval(this.intervalID);
	}
});
/**
 * MeleeEnemyEntity
 */
game.MeleeEnemyEntity = me.Entity.extend({
    init: function(x, y, hp, points) {
		
		// call the super constructor
		this._super(me.Entity, "init", [x, y, {width : 80, height : 80}]);
		// create an animation using the cap guy sprites, and add as renderable
		this.renderable = game.meleeEnemyTexture.createAnimationFromName([
		"5_ATTACK_000", "5_ATTACK_002", "5_ATTACK_003", "5_ATTACK_004", "5_ATTACK_005"
		]);

		
        this.hp = hp;
        this.points = points;
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'ennemy';
        this.xGenere = -5;
        this.yGenere = me.Math.random(-2, 2);
        this.body.vel.set(this.xGenere, this.yGenere);
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
		this.body.vel.set(this.xGenere, this.yGenere);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
    destroy: function(degat){
        this.hp -= degat;
        if (this.hp <= 0){
            game.data.steps += this.points;
            me.game.world.removeChild(this);
            // TODO Drop gifts (ils doivent �tre ramass�s ou pas ?)
            me.audio.play("hit");
        }
            
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
			this.yGenere = me.Math.random(-1, 1);
        if(this.explode == undefined)
            this.explode = false;
        if(this.childs == undefined)
            this.childs = 0;
        this.body.vel.set(this.xGenere, this.yGenere);

        if (rad != undefined){
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
        if (this.rad != undefined)
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
