/**
 *
 *  Boss entities
 *
 **/
/**
 * EnemyEntity : basic enemies stats
 */
game.BossEntity = me.Entity.extend({
    init: function(x, y, settings, velX, velY, hp, points) {
        // Default params values
        /*************************************************************************/
        if (typeof velX === 'undefined') { this.velX = -1; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = 0; } else {this.velY = velY;}
        if (typeof hp === 'undefined') { this.hp = 100; } else {this.hp = hp;}
        if (typeof points === 'undefined') { this.points = 1000; } else {this.points = points;}
        /*************************************************************************/
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'ennemy';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.body.vel.set(this.velX, this.velY);
        this.animationSpeed = 75;
        this.defaultHp = this.hp;
        game.bossHPBar = new me.pool.pull('bossHPBar',me.game.viewport.width/2,25,this.hp);
        me.game.world.addChild(game.bossHPBar, 50);
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    destroy: function(damage){
        // Already dead ?
        if (this.hp > 0){
            this.hp -= damage;
            if (this.hp <= 0){
                game.data.steps += this.points;
                me.game.world.removeChild(this);
                me.game.enemyGenerator.boss = false;
                // TODO Drop gifts
                me.audio.play("hitBoss");
            }
            else {
                let lostHPPercent = (100-((game.boss.hp/game.bossHPBar.maxHP)*100));
                if (lostHPPercent > 0)
                    game.bossHPBar.lostHPPercent += (lostHPPercent-game.bossHPBar.lostHPPercent);
                me.audio.play("hurt");
            }
        }
    }
});
game.MageBossEntity = game.BossEntity.extend({

    init: function(x, y, velX, velY, hp, points) {
        // Texture and animation
        this._super(game.BossEntity, "init", [x, y, {width : 282, height : 382}, velX, velY, hp, points]);
        this.renderable = game.mageBossTexture.createAnimationFromName([
            "5_animation_attack_001", "5_animation_attack_002", "5_animation_attack_003", "5_animation_attack_004", "5_animation_attack_005",
            "5_animation_attack_006", "5_animation_attack_007", "5_animation_attack_008", "5_animation_attack_009", "5_animation_attack_010",
            "5_animation_attack_011", "5_animation_attack_012", "5_animation_attack_013", "5_animation_attack_014", "5_animation_attack_015",
            "5_animation_attack_016", "5_animation_attack_017", "5_animation_attack_018", "5_animation_attack_019", "5_animation_attack_000",
            "5_animation_hurt_000", "5_animation_hurt_003", "5_animation_hurt_006", "5_animation_hurt_009",
            "5_animation_hurt_010", "5_animation_hurt_013", "5_animation_hurt_016", "5_animation_hurt_019",
            "5_animation_idle_000", "5_animation_idle_003", "5_animation_idle_006", "5_animation_idle_009",
            "5_animation_idle_010", "5_animation_idle_013", "5_animation_idle_016", "5_animation_idle_019",
            "5_animation_walk_000", "5_animation_walk_003", "5_animation_walk_006", "5_animation_walk_009",
            "5_animation_walk_010", "5_animation_walk_013", "5_animation_walk_016", "5_animation_walk_019",
        ]);
        this.animationSpeed = 75;
        this.renderable.anchorPoint = {"x" : 0, "y" : 0};
        this.anchorPoint = {"x" : 0, "y" : 0};
        this.attackFrames = [20,21,22,23,24,25,26,27,20,21,22,23,24,25,26,27,20,21,22,23,24,25,26,27,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
        this.renderable.addAnimation ("attack", this.attackFrames,this.animationSpeed);
        this.renderable.addAnimation ("hurt", [20,21,22,23,24,25,26,27],this.animationSpeed+25);
        this.renderable.addAnimation ("idle", [28,29,30,31,32,33,34,35],this.animationSpeed*2);
        this.renderable.addAnimation ("walk", [36,37,38,39,40,41,42,43],this.animationSpeed*2);
        this.renderable.setCurrentAnimation("idle");
        this.currentAttack = 0;
        this.attackDelay = (this.animationSpeed * this.attackFrames.length) + 3000;
        this.lastAttack = Date.now();
        this.hasAttacked = false;
        this.specialAttackSettings = new Map([["number",4], ["delay", 4000], ["speed", -2]]);
        this.specialAttackEntities = [];
        this.nextAttackIsSpecial = false;
        this.specialAttackTriggers = new Map([[0, new Map([["hp",this.defaultHp*0.75],["triggered",false]])] , [1, new Map([["hp",this.defaultHp*0.50],["triggered",false]])] , [2, new Map([["hp",this.defaultHp*0.25],["triggered",false]])]]);
    },

    update: function(dt) {
        this.pos.add(this.body.vel);
        if (this.pos.x <= (me.game.viewport.width/3*2)-100 || (this.pos.x >= me.game.viewport.width-this.renderable.width && this.velX === 1)) {
            this.velX = -this.velX;
            if(this.velY === 0)
                this.velY = -1;
        }
        if (this.pos.y <= 0 || (this.pos.y >= me.game.viewport.height-this.renderable.height)) {
            this.velY = -this.velY;
        }
        for (let i = 0; i < this.specialAttackTriggers.size; i++) {
            if(this.hp <= this.specialAttackTriggers.get(i).get("hp") && !this.specialAttackTriggers.get(i).get("triggered")){
                this.nextAttackIsSpecial = true;
                this.specialAttackTriggers.get(i).set("triggered",true);
                break;
            }
        }
        if(Date.now() - this.lastAttack >= this.attackDelay) {
            this.renderable.setCurrentAnimation("attack", "idle");
            this.lastAttack = Date.now();
            this.hasAttacked = false;
            if(this.nextAttackIsSpecial)
                this.currentAttack = 1;
        }
        this.checkAttack();
        this.body.vel.set(this.velX, this.velY);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(game.BossEntity, "update", [dt]);
    },

    checkAttack: function () {
        if(this.hasAttacked === false && this.currentAttack === 0 && this.renderable.getCurrentAnimationFrame() === 34) {
            me.game.world.addChild(new me.pool.pull('mageBossAttackEntity', this.pos.x, this.pos.y + this.renderable.height/2, -3, 0, true, 5), 14);
			me.audio.play("skraa");
            this.hasAttacked = true;
        }
        if(this.currentAttack === 1) {
            if (this.hasAttacked === false) {
                this.specialAttackEntities = [];
                for (let i = 0; i <= this.specialAttackSettings.get('number'); i++) {
                    let attack = new me.pool.pull('mageBossAttackEntity', (me.game.viewport.width / 3 * 2) - 100,
                        me.game.viewport.height/this.specialAttackSettings.get('number')/2 + i * me.game.viewport.height/this.specialAttackSettings.get('number'), 0, 0, true, 3);
                    attack.explosionDelay = this.specialAttackSettings.get('delay') + me.Math.random(1000, 2000);
                    this.specialAttackEntities.push(attack);
                    me.game.world.addChild(attack);
                    this.hasAttacked = true;
                }
            }
            if (this.hasAttacked === true && this.renderable.getCurrentAnimationFrame() === 34) {
                for(let i = 0; i < this.specialAttackEntities.length; i++) {
                    this.specialAttackEntities[i].velX = this.specialAttackSettings.get('speed');
                    this.currentAttack = 0;
                    this.nextAttackIsSpecial = false;
                }
            }
        }

    }
});
/**
 * MageBossAttackEntity
 */
game.MageBossAttackEntity = me.Entity.extend({

    init: function(x, y, velX, velY, explode, explodesIntoNb, rad) {
        this.explosionDelay = me.Math.random(1000,2000);
        this._super(me.Entity, 'init', [x, y, {width : 30, height : 30}]);
        this.renderable = game.mageBossAttackTexture.createAnimationFromName([
            "Mage_Boss_Attack_01", "Mage_Boss_Attack_02", "Mage_Boss_Attack_03", "Mage_Boss_Attack_04", "Mage_Boss_Attack_05",
            "Mage_Boss_Attack_06", "Mage_Boss_Attack_07", "Mage_Boss_Attack_08", "Mage_Boss_Attack_09", "Mage_Boss_Attack_10",
            "Mage_Boss_Attack_11", "Mage_Boss_Attack_12", "Mage_Boss_Attack_13", "Mage_Boss_Attack_14", "Mage_Boss_Attack_15",
            "Mage_Boss_Attack_16", "Mage_Boss_Attack_17", "Mage_Boss_Attack_18", "Mage_Boss_Attack_19", "Mage_Boss_Attack_20",
            "Mage_Boss_Attack_21", "Mage_Boss_Attack_22", "Mage_Boss_Attack_23", "Mage_Boss_Attack_24", "Mage_Boss_Attack_25"
        ]);

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
            me.game.world.addChild(new me.pool.pull('mageBossAttackEntity', this.pos.x, this.pos.y, 0, -5, false, this.explodesIntoNb, rad), 14);
            me.audio.play("explosion",false,null,0.1);
        }
    }
});