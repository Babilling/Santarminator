/**
 * Santa entity
 */
game.SantaEntity = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y) {

        // call the super constructor
        this._super(me.Entity, "init", [200, 140, {width : 72, height : 98}]);

        // create an animation using the cap guy sprites, and add as renderable
        this.defaultRenderable = game.texture.createAnimationFromName([
            "Armature_Fly_0", "Armature_Fly_1", "Armature_Fly_2", "Armature_Fly_3", "Armature_Fly_4",
			"Armature_Fly_5", "Armature_Fly_6", "Armature_Fly_7", "Armature_Fly_8", "Armature_Fly_9",
			"Armature_Fly_10", "Armature_Fly_11", "Armature_Fly_12", "Armature_Fly_13", "Armature_Fly_14",
			"Armature_Fly_15", "Armature_Fly_16", "Armature_Fly_17", "Armature_Fly_18", "Armature_Fly_19",
			"Armature_Fly_20", "Armature_Fly_21", "Armature_Fly_22", "Armature_Fly_23", "Armature_Fly_24",
			"Armature_Fly_25", "Armature_Fly_26", "Armature_Fly_27", "Armature_Fly_28", "Armature_Fly_29", 
			"Armature_Fly_30"
        ]);
        this.renderable = this.defaultRenderable;

        // enable this, since the entity starts off the viewport
        this.alwaysUpdate = true;
		
		// collision shape
        this.collided = false;
        this.weapon = game.weapon[3];
        this.fireReleased = true;

        this.velY = 5;
        this.velX = 5;
    },
	update: function(dt) {
        var that = this;
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.renderable.currentTransform.identity();
        if (me.input.isKeyPressed('shot')) {
            this.fireReleased = false;
            this.weapon.pressFire(this.pos.x, this.pos.y);
        } else {
            if (!this.fireReleased){
                this.fireReleased = true;
                this.weapon.releaseFire();
            }
        }
        if (me.input.isKeyPressed('forward')) {
            this.pos.y -= this.velY * game.data.speed;
            if (this.pos.y < 25) this.pos.y = 25;
        }
        if (me.input.isKeyPressed('backward')) {
            this.pos.y += this.velY * game.data.speed;
            if (this.pos.y > me.game.viewport.height - 30) this.pos.y = me.game.viewport.height - 30;
        }
        if (me.input.isKeyPressed('left')) {
            this.pos.x -= this.velX * game.data.speed;
            if (this.pos.x < 37) this.pos.x = 37;
        }
        if (me.input.isKeyPressed('right')) {
            this.pos.x += this.velX * game.data.speed;
            if (this.pos.x > me.game.viewport.width - 47) this.pos.x = me.game.viewport.width - 47;
        }
        me.Rect.prototype.updateBounds.apply(this);

        if (this.collided) {
            this.weapon.resetWeapon();
            game.data.start = false;
            me.audio.play("lose");
            this.endAnimation();
        }
        me.collision.check(this);

        if (Date.now() - game.data.dateStart > 25000)
            game.data.speed = 2;
		
		 // call the parent function
		this._super(me.Entity, "update", [dt]);
        return true;
    },

    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'ennemy' || obj.type === 'attack') {
            me.device.vibrate(500);
            this.collided = true;
        }
        return false;
    },

    endAnimation: function() {
        me.game.viewport.fadeOut("#fff", 100);
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 96;
        this.endTween
            .to({y: currentPos}, 1000)
            .to({y: finalPos}, 1000)
            .onComplete(function() {
                me.state.change(me.state.GAME_OVER);
            });
        this.endTween.start();
    }
});