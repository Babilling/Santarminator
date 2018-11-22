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
        if (typeof velY === 'undefined') { this.velY = me.Math.random(-2, 3); } else {this.velY = velY;}
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
                
                if (Math.random() > 0.0){
                    // TODO Drop gifts
                    me.game.world.addChild(new me.pool.pull('weaponDrop', this.pos.x, this.pos.y), 10);
                }
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
    init: function (x, y, settings, velX, velY, hp, points, attackName, attackSplitNb, attackVelX, attackVelY) {
        this._super(game.EnemyEntity, "init", [x, y, settings, velX, velY, hp, points]);
        this.attackVelX = attackVelX;
        this.attackVelY = attackVelY;
        if (typeof attackName === 'undefined') { this.attackName = 'mageAttackEntity'; } else {this.attackName = attackName;}
        if (typeof attackSplitNb === 'undefined') { this.attackSplitNb = 0; } else {this.attackSplitNb = attackSplitNb;}
        this.startAttackTimer(this.animationSpeed * this.attackFrames.length);
    },

    startAttackTimer : function (timerDelay) {
        let _this = this;
        this.intervalID = me.timer.setInterval(function () {
            if(_this.attackName === 'mageAttackEntity')
                me.game.world.addChild(new me.pool.pull('mageAttackEntity', _this.pos.x - 5, _this.pos.y + 24, _this.attackVelX, _this.attackVelY, true, _this.attackSplitNb), 14);
            if(_this.attackName === 'archerAttackEntity')
                me.game.world.addChild(new me.pool.pull('archerAttackEntity', _this.pos.x - 5, _this.pos.y + 40, _this.attackVelX, _this.attackVelY, false), 14);
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
    init: function(x, y, velX, velY, hp, points, attackSplitNb, attackVelX, attackVelY) {
        if (typeof attackSplitNb === 'undefined') { this.attackSplitNb = 3; } else {this.attackSplitNb = attackSplitNb;}
		if (typeof attackVelX === 'undefined') { this.attackVelX = -3; } else {this.attackVelX = attackVelX;}
		if (typeof attackVelY === 'undefined') { this.attackVelY = 0; } else {this.attackVelY = attackVelY;}
        // Texture
        this.attackFrames = [0,1,2];
        this._super(game.RangedEnemyEntity, "init", [x, y, {width : 77, height : 69}, velX, velY, hp, points, 'mageAttackEntity', this.attackSplitNb, this.attackVelX, this.attackVelY]);
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
 * ArcherEnemyEntity
 */
game.ArcherEnemyEntity = game.RangedEnemyEntity.extend({
    init: function(x, y, velX, velY, hp, points) {
        // Texture
        this.attackFrames = [0,1,2];
        this._super(game.RangedEnemyEntity, "init", [x, y, {width : 78, height : 80}, velX, velY, hp, points, 'archerAttackEntity']);
        this.renderable = game.archerEnemyTexture.createAnimationFromName([
            "ARCHER_ATTACK_000", "ARCHER_ATTACK_001", "ARCHER_ATTACK_002"
        ]);
        this.renderable.addAnimation ("attack", [0,1,2], this.animationSpeed);
        this.renderable.setCurrentAnimation("attack");
    },

    update: function(dt) {
        this._super(game.RangedEnemyEntity, "update", [dt]);
        if(this.pos.x <= me.game.viewport.width-200) {this.body.vel.set(0, this.velY);}
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

    init: function(x, y, velX, velY, explode, explodesIntoNb, rad) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('mageAttack');
        settings.width = 22;
        settings.height= 22;
        settings.framewidth = 22;
        settings.frameheight = 22;
        this.explosionDelay = me.Math.random(1000,2000);
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'attack';
        if (typeof velX === 'undefined') { this.velX = -3; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = 0; } else {this.velY = velY;}
        if (typeof explode === 'undefined') { this.explode = false; } else {this.explode = explode;}
        if (typeof explodesIntoNb === 'undefined') { this.explodesIntoNb = 0; } else {this.explodesIntoNb = explodesIntoNb;}
        this.body.vel.set(this.velX, this.velY);
        if (typeof rad != 'undefined' && !this.explode) {
            this.body.vel = this.body.vel.rotate(rad);
            this.rad = rad;
        }
        this.timeCreated = Date.now();
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
        //explode
        if(((Date.now() - this.timeCreated) >= this.explosionDelay) && this.explode){
            this.createExplosion();
            this.explode = false;
            me.game.world.removeChild(this);
        }
        this.body.vel.set(this.velX, this.velY);
        if (this.rad != undefined && !this.explode)
            this.body.vel = this.body.vel.rotate(this.rad);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

    createExplosion : function () {
        for(let i = 0; i < this.explodesIntoNb; i++) {
            let rad = me.Math.degToRad(360 / this.explodesIntoNb * (i + 1));
            me.game.world.addChild(new me.pool.pull('mageAttackEntity', this.pos.x, this.pos.y, 0, -5, false, this.explodesIntoNb, rad), 14);
            me.audio.play("explosion",false,null,0.1);
        }
    }
});
/**
 * ArcherAttackEntity
 */
game.ArcherAttackEntity = me.Entity.extend({

    init: function(x, y, velX, velY) {
        let settings = {};
        settings.image = this.image = me.loader.getImage('archerAttack');
        settings.width = 50;
        settings.height= 9;
        settings.framewidth = 50;
        settings.frameheight = 9;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0.2;
        this.type = 'attack';
        if (typeof velX === 'undefined') { this.velX = -10; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = 0; } else {this.velY = velY;}

        this.body.vel.set(this.velX, this.velY);
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
        this._super(me.Entity, 'update', [dt]);
        return true;
    }
});

