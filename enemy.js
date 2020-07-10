class Enemy{
	constructor(){
		let xy_obj = game.map.get_random_south_street_coord();
		this.x = xy_obj.x *32;
		this.y = xy_obj.y *32;
		this.direction = "down";
		this.direction_weighted_set = new WeightedSet();

		this.image = {
			x: Math.floor(Math.random()*2),
			y: 3,
			flip:false
		}
	}

	make_trail(){
		game.map.change_team(this.x /32, this.y /32, 2);
	}

	get_backward_direction(direction){
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
		if(this.x % 32 == 0 && this.y % 32 == 0){
			if(game.map.get_tile(this.x / 32, this.y / 32).team == 1){
				this.dead = true;
				return;
			}
			let walkable_directions = game.map.get_walkable_directions(this.x / 32, this.y / 32);
			for (let i = 0; i < walkable_directions.length; i++) {
				if(walkable_directions[i] == this.get_backward_direction(this.direction)){
					this.direction_weighted_set.add(walkable_directions[i], 1);
				}else{
					this.direction_weighted_set.add(walkable_directions[i], 4);
				}
			}
			this.direction = this.direction_weighted_set.choose_random();
			this.direction_weighted_set.remove_all();

			this.make_trail();
		}
		this.walk();
	}
	walk(){
		if(this.direction == "up"){
			this.y--;
		}
		if(this.direction == "down"){
			this.y++;
		}
		if(this.direction == "left"){
			this.x--;
			this.image.flip = true;
		}
		if(this.direction == "right"){
			this.x++;
			this.image.flip = false;
		}
	}

	draw(ctx){
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