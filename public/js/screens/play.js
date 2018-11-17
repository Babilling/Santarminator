game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        me.audio.play("theme", true,null,0.2);
        me.audio.setVolume(1);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.reset();
        me.audio.stop("theme");
        if (!game.data.muted){
            me.audio.play("theme", true,null,0.2);
        }

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

        me.game.world.addChild(new BackgroundLayer('bg', 1));

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);

        //this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height/2 - 100);
        //me.game.world.addChild(this.bird, 12);
		
		var SantaEntity = new game.SantaEntity();
		// add it to the scene
		me.game.world.addChild(SantaEntity, 12);

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
               // me.game.world.addChild(new game.PipeGenerator(), 0);
               // me.game.world.addChild(new game.SnowGenerator(), 0);
                me.game.world.addChild(new game.EnnemyGenerator(), 0);
                me.game.world.removeChild(that.getReady);
            }).start();
    },

    onDestroyEvent: function() {
        me.audio.stopTrack('theme');
        // free the stored instance
        this.HUD = null;
        this.bird = null;

        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});
