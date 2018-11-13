/**
 * Enemies entities
 */
 /**
 * SimpleEnemyEntity
 */
game.SimpleEnemyEntity = me.Entity.extend({
    init: function(x, y, enemyType) {

		if (enemyType == 1) {
			// call the super constructor
			this._super(me.Entity, "init", [x, y, {width : 80, height : 80}]);
			// create an animation using the cap guy sprites, and add as renderable
			this.renderable = game.meleeEnemyTexture.createAnimationFromName([
				"5_ATTACK_000", "5_ATTACK_002", "5_ATTACK_003", "5_ATTACK_004", "5_ATTACK_005"
			]);
		}else if (enemyType == 2) {
			// call the super constructor
			this._super(me.Entity, "init", [x, y, {width : 69, height : 77}]);
			// create an animation using the cap guy sprites, and add as renderable
			this.renderable = game.mageEnemyTexture.createAnimationFromName([
				"2_ATTACK_001", "2_ATTACK_002", "2_ATTACK_003"
			]);
		}
		
        this.hp = 10;
        this.points = 1;
        this.alwaysUpdate = true;
        this.pos.add(this.body.vel);
        this.body.gravity = 0;
        this.type = 'ennemy';
        this.xGenere = -5;
        this.yGenere = Number.prototype.random(-2, 2);
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
            // TODO Drop gifts (ils doivent être ramassés ou pas ?)
            me.audio.play("hit");
        }
            
    }
});