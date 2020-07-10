class Player{
	constructor(player_n){
		this.player_n = player_n;
		let xy_obj = game.map.get_random_north_street_coord();
		this.x = xy_obj.x *32;
		this.y = xy_obj.y *32;
		let walkable_directions = game.map.get_walkable_directions(this.x / 32, this.y / 32);
		let random_direction = walkable_directions[Math.floor(Math.random()*walkable_directions.length)];
		this.direction = random_direction;
		this.last_input = random_direction;
		this.image = {
			x: 1 +this.player_n,
			y: 3,
			flip:false
		}
	}

	make_trail(){
		game.map.change_team(this.x /32, this.y /32, 1);
	}

	get_backward_direction(direction){
		sounds.select.play();
		if(direction == "up"){
			return "down";
		}
		if(direction == "down"){
			return "up";
		}
		if(direction == "left"){
			return "right";
		}
		if(direction == "right"){
			return "left";
		}
	}
	update(){
		if (this.dead){
			return;
		}
		if(this.x % 32 == 0 && this.y % 32 == 0){
			if(game.map.get_tile(this.x / 32, this.y / 32).team == 2){
				this.dead = true;
				sounds.lost.play();
				return;
			}
			if(game.map.is_walkable(this.x / 32, this.y / 32, this.last_input)){
				this.direction = this.last_input;
			}else{
				if(! game.map.is_walkable(this.x / 32, this.y / 32, this.direction)){
					this.direction = this.get_backward_direction(this.direction);
					this.last_input = this.direction;
				}
			}
			this.make_trail();
		}
		this.walk();
	}

	walk(){
		if(this.direction == "up"){
			this.y--;
			this.y--;
		}
		if(this.direction == "down"){
			this.y++;
			this.y++;
		}
		if(this.direction == "left"){
			this.x--;
			this.x--;
			this.image.flip = true;
		}
		if(this.direction == "right"){
			this.x++;
			this.x++;
			this.image.flip = false;
		}
	}

	draw(ctx){
		if (this.dead){
			return;
		}
		ctx.save();
		if(this.image.flip){
			ctx.scale(-1, 1);
			ctx.drawImage(
				images,
				this.image.x *32, this.image.y *32,
				32, 32,
				-this.x, this.y,
				-32, 32
				);
		}else{
			ctx.drawImage(
				images,
				this.image.x *32, this.image.y *32,
				32, 32,
				this.x, this.y,
				32, 32
				);
		}
		ctx.restore();
	}
}