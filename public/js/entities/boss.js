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
        if (typeof hp === 'undefined') { this.hp = 1000; } else {this.hp = hp;}
        if (typeof points === 'undefined') { this.points = 400; } else {this.points = points;}
        /*************************************************************************/
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        this.type = 'ennemy';
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.vel.set(this.velX, this.velY);
        this.animationSpeed = 75;
        this.invulnerable = true;
        this.defaultHp = this.hp;
		this.deathSound = "hitBoss";
		this.hurtSounds = ["hit"];
		this.name = "";
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
        if (this.hp > 0 && !this.invulnerable){
            this.hp -= damage;
            if (this.hp <= 0){
                game.data.steps += this.points;
                me.game.world.removeChild(this);
                setTimeout(function(){
                    me.game.enemyGenerator.boss = false;
                }, 10000);
                
                // Drop gifts (600 points) + 2 weapons packs aléatoirement
                for(var i = 0; i < 30; i++){
                    me.game.world.addChild(new me.pool.pull('presentDrop', 
                        me.Math.random(this.pos.x, this.pos.x + this.width - 32), 
                        me.Math.random(this.pos.y, this.pos.y + this.height - 32)), 10);
                }
                for(var i = 0; i < 2; i++){
                    me.game.world.addChild(new me.pool.pull('weaponDrop', 
                        me.Math.random(this.pos.x, this.pos.x + this.width - 32), 
                        me.Math.random(this.pos.y, this.pos.y + this.height - 32)), 10);
                }
                me.game.enemyGenerator.difficulty++;
                me.audio.play(this.deathSound);
            }
            else {
                let lostHPPercent = (100-((game.boss.hp/game.bossHPBar.maxHP)*100));
                if (lostHPPercent > 0)
                    game.bossHPBar.lostHPPercent += (lostHPPercent-game.bossHPBar.lostHPPercent);
                me.audio.play(this.hurtSounds[me.Math.random(0,this.hurtSounds.length)]);
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
        this.body.addShape(new me.Ellipse(this.renderable.width/2,this.renderable.height/2,this.renderable.width,this.renderable.height));
        this.body.removeShapeAt(0);
        this.body.updateBounds();
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
		this.deathSound = "fougasse_death";
		this.hurtSounds = ["fougasse_hurt1","fougasse_hurt2","fougasse_hurt3"];
        this.name = "Pere Fougasse";
    },

    update: function(dt) {
        this.pos.add(this.body.vel);
        if (this.pos.x <= (me.game.viewport.width/3*2)-100 || (this.pos.x >= me.game.viewport.width-this.renderable.width && this.velX === 1)) {
            this.velX = -this.velX;
            this.invulnerable = false;
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
            me.game.world.addChild(new me.pool.pull('mageBossAttackEntity', this.pos.x, game.santa.pos.y + game.santa.height/2, -3, 0, true, me.game.enemyGenerator.difficulty + 6), 14);
            this.hasAttacked = true;
        }
        if(this.currentAttack === 1) {
            if (this.hasAttacked === false) {
                this.specialAttackEntities = [];
                for (let i = 0; i < this.specialAttackSettings.get('number'); i++) {
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
/**
 * TreeBossEntity
 */
game.TreeBossEntity = game.BossEntity.extend({

    init: function(x, y, velX, velY, hp, points) {
        // Texture and animation
        this._super(game.BossEntity, "init", [x, y, {width : 362, height : 402}, velX, velY, hp, points]);
        this.renderable = game.treeBossTexture.createAnimationFromName([
            "boss_tree_attack_000", "boss_tree_attack_001", "boss_tree_attack_002", "boss_tree_attack_003", "boss_tree_attack_004",
            "boss_tree_attack_005", "boss_tree_attack_006", "boss_tree_hurt_000", "boss_tree_hurt_001", "boss_tree_hurt_002",
            "boss_tree_hurt_003", "boss_tree_hurt_004", "boss_tree_idle_000", "boss_tree_idle_001", "boss_tree_idle_002",
            "boss_tree_idle_003", "boss_tree_idle_004"
        ]);
        this.animationSpeed = 100;
        this.renderable.alwaysUpdate = true;
        this.body.addShape(new me.Ellipse(this.renderable.width/2,this.renderable.height/2,this.renderable.width/2,this.renderable.height));
        this.body.removeShapeAt(0);
        this.body.updateBounds();
        this.attackFrames = [7,8,9,10,11,7,8,9,10,11,0,1,2,3,4,5,6];
        this.renderable.addAnimation ("attack", this.attackFrames,this.animationSpeed);
        this.renderable.addAnimation ("hurt", [7,8,9,10,11],this.animationSpeed+25);
        this.renderable.addAnimation ("idle", [12,13,14,15,16],this.animationSpeed*2);
        this.renderable.setCurrentAnimation("idle");
        this.currentAttack = 0;
        this.attackDelay = (this.animationSpeed * this.attackFrames.length) + 3000;
        this.lastAttack = Date.now();
        this.hasAttacked = false;
        this.specialAttackSettings = new Map([["number",3], ["delay", 4000], ["speed", -6]]);
        this.specialAttackEntities = [];
        this.nextAttackIsSpecial = false;
        this.specialAttackTriggers = new Map([[0, new Map([["hp",this.defaultHp*0.75],["triggered",false]])] , [1, new Map([["hp",this.defaultHp*0.50],["triggered",false]])] , [2, new Map([["hp",this.defaultHp*0.25],["triggered",false]])]]);
        this.name = "Michel Sapin";
    },

    update: function(dt) {
        this.pos.add(this.body.vel);
        if (this.pos.x <= (me.game.viewport.width/3*2)-100 || (this.pos.x >= me.game.viewport.width-this.renderable.width && this.velX === 1)) {
            this.velX = -this.velX;
            this.invulnerable = false;
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
        if(this.hasAttacked === false && this.currentAttack === 0 && this.renderable.getCurrentAnimationFrame() === 14) {
            me.game.world.addChild(new me.pool.pull('treeBossAttackEntity', this.pos.x,  me.Math.random(game.santa.pos.y, game.santa.pos.y + game.santa.height), -(me.game.enemyGenerator.difficulty + 4)), 14);
            this.hasAttacked = true;
        }
        if(this.currentAttack === 1) {
            if (this.hasAttacked === false) {
                this.specialAttackEntities = [];
                for (let i = 0; i < this.specialAttackSettings.get('number'); i++) {
                    let attack = new me.pool.pull('treeBossAttackEntity', me.Math.random(i*((me.game.viewport.width - this.renderable.width)/this.specialAttackSettings.get('number')),(i+1)*((me.game.viewport.width - this.renderable.width)/this.specialAttackSettings.get('number'))),
                    me.game.viewport.height , 0, -1, 0);
                    this.specialAttackEntities.push(attack);
                    me.game.world.addChild(attack);
                    this.hasAttacked = true;
                }
            }
            if (this.hasAttacked === true && this.renderable.getCurrentAnimationFrame() === 14) {
                for(let i = 0; i < this.specialAttackEntities.length; i++) {
                    this.specialAttackEntities[i].velY = this.specialAttackSettings.get('speed');
                    this.currentAttack = 0;
                    this.nextAttackIsSpecial = false;
                }
            }
        }

    }
});
/**
 * TreeBossAttackEntity
 */
game.TreeBossAttackEntity = me.Entity.extend({

    init: function(x, y, velX, velY, angle) {

        if (typeof velX === 'undefined') { this.velX = -3; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = 0; } else {this.velY = velY;}
        if (typeof angle === 'undefined') { this.angle = 270; } else {this.angle = angle;}
        let settings = {};
        settings.image = this.image = me.loader.getImage('treeBossAttack');
        settings.width = 114;
        settings.height= 140;
        settings.framewidth = 114;
        settings.frameheight = 140;
        this._super(me.Entity, 'init', [x, y, settings]);
        if(this.angle === 270)
            this.body.addShape(new me.Ellipse(0,0,this.height,this.width-20));
        else
            this.body.addShape(new me.Ellipse(0,0,this.width-20,this.height));
        this.body.removeShapeAt(0);
        this.body.updateBounds();
        this.renderable.currentTransform.rotate(me.Math.degToRad(this.angle));

        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'attack';
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
/**
 * UnicornBossEntity
 */
game.UnicornBossEntity = game.BossEntity.extend({

    init: function(x, y, velX, velY, hp, points) {
        // Texture and animation
        this._super(game.BossEntity, "init", [x, y, {width : 375, height : 402}, velX, velY, hp, points]);
        this.renderable = game.unicornBossTexture.createAnimationFromName([
            "boss_unicorn_attack_000", "boss_unicorn_attack_001", "boss_unicorn_attack_002", "boss_unicorn_attack_003", "boss_unicorn_attack_004",
            "boss_unicorn_attack_005", "boss_unicorn_attack_006", "boss_unicorn_hurt_000", "boss_unicorn_hurt_001", "boss_unicorn_hurt_002",
            "boss_unicorn_hurt_003", "boss_unicorn_idle_000", "boss_unicorn_idle_001", "boss_unicorn_idle_002"
        ]);
        this.animationSpeed = 120;
        this.body.addShape(new me.Ellipse(this.renderable.width/2,this.renderable.height/2,this.renderable.width,this.renderable.height));
        this.body.removeShapeAt(0);
        this.body.updateBounds();
        this.attackFrames = [7,8,9,10,7,8,9,10,0,1,2,3,4,5,6];
        this.renderable.addAnimation ("attack", this.attackFrames,this.animationSpeed);
        this.renderable.addAnimation ("hurt", [7,8,9,10],this.animationSpeed+25);
        this.renderable.addAnimation ("idle", [11,12,13],this.animationSpeed*2);
        this.renderable.setCurrentAnimation("idle");
        this.currentAttack = 0;
        this.attackDelay = (this.animationSpeed * this.attackFrames.length) + 3000;
        this.lastAttack = Date.now();
        this.hasAttacked = false;
        this.specialAttackSettings = new Map([["number",4], ["delay", 4000], ["speed", -2]]);
        this.nextAttackIsSpecial = false;
        this.specialAttackTriggers = new Map([[0, new Map([["hp",this.defaultHp*0.75],["triggered",false]])] , [1, new Map([["hp",this.defaultHp*0.50],["triggered",false]])] , [2, new Map([["hp",this.defaultHp*0.25],["triggered",false]])]]);
        this.name = "Gandoulfe le vert";
    },

    update: function(dt) {
        this.pos.add(this.body.vel);
        if (this.pos.x <= (me.game.viewport.width/3*2)-100 || (this.pos.x >= me.game.viewport.width-this.renderable.width && this.velX === 1)) {
            this.velX = -this.velX;
            this.invulnerable = false;
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
        if(this.hasAttacked === false && this.currentAttack === 0 && this.renderable.getCurrentAnimationFrame() === 12) {
            this.chainPattern(me.game.enemyGenerator.difficulty + 4, this.pos.x,  game.santa.pos.y + game.santa.height/2, me.Math.degToRad(me.Math.random(-90, 91)));
            me.audio.play("skraa");
            this.hasAttacked = true;
        }
            if (this.hasAttacked === false && this.currentAttack === 1 && this.renderable.getCurrentAnimationFrame() === 12) {
                for (let i = 0; i < this.specialAttackSettings.get('number'); i++) {
                    this.chainPattern(me.game.enemyGenerator.difficulty + 2, this.pos.x, me.Math.random(this.pos.y,this.pos.y + this.height/2), me.Math.degToRad(me.Math.random(-80, 81)));
                    this.hasAttacked = true;
                    this.currentAttack = 0;
                    this.nextAttackIsSpecial = false;
                }
            }
    },
    chainPattern: function(size, posX, posY, radX){
        if (posX === undefined) posX = me.game.viewport.width + 50;
        if (posY === undefined) posY = me.Math.random(100, me.video.renderer.getHeight() - 100);
        if (radX === undefined) radX = 0;

        for(var i = 0; i < size; i++){
            me.game.world.addChild(new me.pool.pull('unicornBossAttackEntity', posX, posY, 0, radX), 13);
            posX += 30;
            posY += 20 * Math.tan(radX);
        }
    },
});
/**
 * UnicornBossAttackEntity
 */
game.UnicornBossAttackEntity = me.Entity.extend({

    init: function(x, y, velX, velY) {

        if (typeof velX === 'undefined') { this.velX = -3; } else {this.velX = velX;}
        if (typeof velY === 'undefined') { this.velY = 0; } else {this.velY = velY;}
        this.settingsMap = {"0":{ width : 80, height : 76, framewidth : 80, frameheight : 76, image : me.loader.getImage('unicornBossAttackBig')},
        "1":{ width : 40, height : 38, framewidth : 40, frameheight : 38, image : me.loader.getImage('unicornBossAttackMedium')},
            "2":{ width : 20, height : 19, framewidth : 20, frameheight : 19, image : me.loader.getImage('unicornBossAttackSmall')}};
        this.attackSize = me.Math.random(0,3);
        this._super(me.Entity, 'init', [x, y, this.settingsMap[this.attackSize]]);
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'attack';
        switch (this.attackSize) {
            case 0: this.velX = -4;
                break;
            case 1: this.velX = -6;
                break;
            case 2: this.velX = -8;
                break;
        }
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
        this.renderable.currentTransform.rotate(me.Math.degToRad(1));
        this.body.vel.set(this.velX, this.velY);
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    }
});