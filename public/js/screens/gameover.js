game.GameOverScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function() {
        //save section
        this.savedData = {
            pseudo:localStorage.getItem('me.save.pseudo'),
            pwd:localStorage.getItem('me.save.pwd'),
            steps: game.data.steps
        };
        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
        socket.emit('step', me.save.pseudo, me.save.pwd, game.data.steps);
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN,
            function (action, keyCode, edge) {
                if (action === "enter") {
                    me.state.change(me.state.MENU);
                }
            });

        me.game.world.addChild(new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/6,
            {image: 'gameover'}
        ), 12);
		
		me.game.world.addChild(new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'tablo12'}
        ), 12);

        var gameOverBG = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'gameoverbg'}
        );
        me.game.world.addChild(gameOverBG, 10);

        me.game.world.addChild(new BackgroundLayer('bg', 1));
        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {
                this._super(me.Renderable, 'init',
                    [0, 0, me.game.viewport.width/2, me.game.viewport.height/2]
                );
                this.font = new me.Font('gamefont', 25, 'white', 'left');
            },

            draw: function (renderer) {
                var margin = 0;
				var stepsTxt = "" + game.data.steps;
				var pseudoTxt = me.save.pseudo;
				while(pseudoTxt.length < 8) {
					pseudoTxt = pseudoTxt + " ";
				}
				while(stepsTxt.length < 3) {
						stepsTxt = "0" + stepsTxt;
				}
				var text = "    " + pseudoTxt + "    " + stepsTxt;
                var textFont =  this.font.measureText(renderer, text);
                this.font.draw(
                    renderer,"    " + text,
                     me.game.viewport.width/2 - textFont.width/2 - 65,
                     me.game.viewport.height/2 + margin - 230
                );
                for (var i = 0; i < me.save.rows.length; i++){
					var stepsTxt = "" + me.save.rows[i].step;
					while(me.save.rows[i].pseudo.length < 8) {
						me.save.rows[i].pseudo = me.save.rows[i].pseudo + " ";
					}
					while(stepsTxt.length < 3) {
						stepsTxt = "0" + stepsTxt;
					}
                    var text = me.save.rows[i].pseudo + "    " + stepsTxt;
                    textFont =  this.font.measureText(renderer, text);
					var pos = (i+1);
					if(pos < 10)
						pos = " " + pos;
                    this.font.draw(
                        renderer,
                        pos + "   " + text,
                        me.game.viewport.width/2 - textFont.width/2 - 50,
                        me.game.viewport.height/2 + margin - 140
                    );
                    margin = margin + 27;
                }
            }
        }));
        me.game.world.addChild(this.dialog, 13);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.Z);
        me.input.unbindKey(me.input.KEY.Q);
        me.input.unbindKey(me.input.KEY.S);
        me.input.unbindKey(me.input.KEY.D);

        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.RIGHT);

        this.font = null;
        me.audio.stop("theme");
    }
});
