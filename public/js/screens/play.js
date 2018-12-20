game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        me.audio.play("theme", true, null, 0.3);
        me.audio.setVolume(1);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.reset();
        me.audio.stop("theme");
        me.audio.play("theme", true);

        me.input.bindKey(me.input.KEY.SPACE, "shot");
        me.input.bindKey(me.input.KEY.Z, "forward");
        me.input.bindKey(me.input.KEY.Q, "left");
        me.input.bindKey(me.input.KEY.S, "backward");
        me.input.bindKey(me.input.KEY.D, "right");

        me.input.bindKey(me.input.KEY.UP, "forward");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.DOWN, "backward");
        me.input.bindKey(me.input.KEY.RIGHT, "right");

        game.data.steps = 0;
        game.data.start = false;
        game.data.dateStart = Date.now();

        me.game.world.addChild(new BackgroundLayer(game.bg, 1));

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);

		this.santa = new game.SantaEntity();
		// add it to the scene
		me.game.world.addChild(this.santa, 12);
        game.santa = this.santa;
        //inputs
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);

        this.getReady = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'getready'}
        );
        me.game.world.addChild(this.getReady, 11);

        var that = this;
        var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
            .easing(me.Tween.Easing.Linear.None)
            .onComplete(function() {
                game.data.start = true;
                me.game.enemyGenerator = new game.EnnemyGenerator();
                me.game.world.addChild(me.game.enemyGenerator, 0);
                me.game.world.removeChild(that.getReady);
            }).start();
    },

    onDestroyEvent: function() {
        me.audio.stopTrack('theme');
        // free the stored instance
        me.game.world.removeChild(this.HUD);
		me.game.world.removeChild(this.santa);

        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});
