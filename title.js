class Title{
	constructor(){
		this._bounce = 0;
		this.bounce = 0;
	}
	update(){
		this._bounce = this._bounce + 0.05;
		if(this._bounce > Math.PI*2){
			this._bounce = 0;
		}
		this.bounce = Math.cos(this._bounce);

		if(keysDown["ArrowRight"] || keysDown["d"]) {
			if( !game.is_coop){
				sounds.select.play();
			}
			game.is_coop = true;
			sounds.bgm.play();
		}
		else if(keysDown["ArrowLeft"] || keysDown["a"]) {
			if(game.is_coop){
				sounds.select.play();
			}
			game.is_coop = false;
			sounds.bgm.play();
		}
		if(keysDown[" "] || keysDown["Enter"]){
			sounds.bgm.play();
			sounds.select.play();
			screen.in_title = false;
		}
	}

	draw(ctx){
		game.map.draw(ctx);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(0,0,800,610);
		ctx.font = "bold 50px Monospace";
		ctx.textAlign = 'center';
		ctx.strokeStyle = "rgb(125,0,25)";
		ctx.fillStyle = "pink";
		ctx.lineWidth = 5;
		ctx.strokeText("Love Island:", 400, 2+100 + 10* this.bounce);
		ctx.fillText("Love Island:", 400, 100 + 10* this.bounce);
		ctx.strokeText("Cats vs Monsters", 400, 2+150 + 10* this.bounce);
		ctx.fillText("Cats vs Monsters", 400, 150 + 10* this.bounce);

		ctx.font = "30px Monospace";
		ctx.lineWidth = 4;
		ctx.strokeText("WASD/Arrows to Move", 400 + 2* this.bounce, 1+300);
		ctx.fillText("WASD/Arrows to Move", 400 + 2* this.bounce, 300);

		ctx.strokeText("Spacebar to Start", 400 + -2* this.bounce, 1+350);
		ctx.fillText("Spacebar to Start", 400 + -2* this.bounce, 350);

		ctx.drawImage(
			images,
			2 *32, 3 *32,
			32, 32,
			300, 490+ 2* this.bounce,
			32, 32
			);
		ctx.drawImage(
			images,
			2 *32, 3 *32,
			32, 32,
			440, 490+ 2* this.bounce,
			32, 32
			);
		ctx.drawImage(
			images,
			3 *32, 3 *32,
			32, 32,
			490, 490+ 2* this.bounce,
			32, 32
			);
		if(game.is_coop){
			ctx.strokeText(" 1P Solo  [2P Coop]", 400, 1+550 + 2* this.bounce);
			ctx.fillText(" 1P Solo  [2P Coop]", 400, 550 + 2* this.bounce);
		}else{
			ctx.strokeText("[1P Solo]  2P Coop ", 400, 1+550 + 2* this.bounce);
			ctx.fillText("[1P Solo]  2P Coop ", 400, 550 + 2* this.bounce);
		}

		if(localStorage.high_score){
			ctx.font = "20px Monospace";
			ctx.lineWidth = 3;
			ctx.strokeText("High Score: " +localStorage.high_score, 400 + this.bounce, 1+600);
			ctx.fillText("High Score: " +localStorage.high_score, 400 + this.bounce, 600);
		}
	}
}