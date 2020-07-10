class Map{
	constructor(){
		this.width = 25;
		this.height = 19;
		this.size = this.width*this.height;
		this.tiles = [];
		for (let index = 0; index < this.size; index++) {
			this.tiles[index] = {
				image: {
					x: 3,
					y: 2
				},
				team: 0,
				team_timer: 0,
				walkable: false,
				water: false
			}
		}
		this.team_timer_weighted_set = new WeightedSet();
		this.team_timer_weighted_set.add("do_nothing", 100000);

		this.create_random();
		this.polish();
	}

	polish(){
		this.change_island_shape();
		this.add_beach();
		this.remove_unreachable_roads();
	}
	change_island_shape(){
		let weighted_set = new WeightedSet();
		for (let index = 0; index < this.size; index++) {
			if(this.tiles[index].water){
				weighted_set.add(index, 1);
			}
		}
		for (let i = 0; i < this.size /game.level; i++) {
			let current_water_tile = weighted_set.choose_random();
			weighted_set.remove(current_water_tile);
			let neighbors = this.get_neighbors(current_water_tile);
			for (let loop = 0; loop < neighbors.length; loop++) {
				weighted_set.add(neighbors[loop], 1);
				this.change_to_water(neighbors[loop]);
			}
		}
		for (let index = 0; index < this.size; index++) {
			if(! this.tiles[index].water){
				let neighbors = this.get_neighbors(index);
				let neighbors_with_water = 0
				for (let loop = 0; loop < neighbors.length; loop++) {
					if(this.tiles[ neighbors[loop] ].water){
						neighbors_with_water++;
					}
				}
				if(neighbors_with_water == 3){
					this.change_to_water(index);
				}
			}
		}
	}
	add_beach(){
		for (let index = 0; index < this.size; index++) {
			if(this.tiles[index].water){
				let neighbors = this.get_neighbors(index);
				for (let loop = 0; loop < neighbors.length; loop++) {
					if(! this.tiles[ neighbors[loop] ].water){
						this.change_to_sand(neighbors[loop]);
					}
				}
			}
		}
	}
	set_road_images(){
		for (let index = 0; index < this.size; index++) {
			if(this.tiles[index].walkable){
				let walkable_directions = this.get_walkable_directions(index);
				if (walkable_directions.length > 2){
					this.tiles[index].image.y = 0;
				}else{
					if(walkable_directions[0] == "up" && walkable_directions[1] == "down"){
						this.tiles[index].image.y = 2;
					}else{
						if(walkable_directions[0] == "left" && walkable_directions[1] == "right"){
							this.tiles[index].image.y = 1;
						}else{
							this.tiles[index].image.y = 0;
						}
					}
				}
			}
		}
	}
	get_all_connected_roads(connected_roads, index){
		let neighbors = this.get_neighbors(index);
		for (let i = 0; i < neighbors.length; i++) {
			if(this.tiles[ neighbors[i] ].walkable){
				if(! connected_roads[ neighbors[i] ]){
					connected_roads[ neighbors[i] ] = neighbors[i];
					this.get_all_connected_roads(connected_roads, neighbors[i]);
				}
			}
		}
		return connected_roads;
	}
	remove_unreachable_roads(){
		let connected_roads = {};
		for (let index = 0; index < this.size; index++){
			if (this.tiles[index].walkable){
				if (! connected_roads[index]){
					let newly_connected_roads = {};
					newly_connected_roads[index] = index;
					this.get_all_connected_roads(newly_connected_roads, index);

					if (Object.keys(newly_connected_roads).length > Object.keys(connected_roads).length){
						let swap = connected_roads;
						connected_roads = newly_connected_roads;
						newly_connected_roads = swap;
					}
					for (const index of Object.keys(newly_connected_roads)) {
						this.change_to_tree(index);
					}
				}
			}
		}
		this.set_road_images();
	}
	get_tile(x,y){
		return this.tiles[this.convert_xy_to_index(x,y)];
	}

	get_neighbors(index){
		let {x,y} = this.convert_index_to_xy(index);
		let neighbors = [];
		if(this.in_bounds(x, y-1)){
			neighbors.push(this.convert_xy_to_index(x, y-1));
		}
		if(this.in_bounds(x, y+1)){
			neighbors.push(this.convert_xy_to_index(x, y+1));
		}
		if(this.in_bounds(x-1, y)){
			neighbors.push(this.convert_xy_to_index(x-1, y));
		}
		if(this.in_bounds(x+1, y)){
			neighbors.push(this.convert_xy_to_index(x+1, y));
		}
		return neighbors;
	}
	get_walkable_directions(x,y){
		if (y == null){
			let index = x;
			x = this.convert_index_to_xy(index).x;
			y = this.convert_index_to_xy(index).y;
		}
		let walkables = [];
		if(this.tiles[this.convert_xy_to_index(x,y-1)].walkable){
			walkables.push("up");
		}
		if(this.tiles[this.convert_xy_to_index(x,y+1)].walkable){
			walkables.push("down");
		}
		if(this.tiles[this.convert_xy_to_index(x-1,y)].walkable){
			walkables.push("left");
		}
		if(this.tiles[this.convert_xy_to_index(x+1,y)].walkable){
			walkables.push("right");
		}
		return walkables;
	}
	change_team(x,y,team){
		this.tiles[this.convert_xy_to_index(x,y)].team = team;
		this.tiles[this.convert_xy_to_index(x,y)].team_timer = 0;
	}

	convert_index_to_xy(index){
		return {
			x: index % this.width,
			y: Math.floor(index / this.width)
		}
	}
	convert_xy_to_index(x,y){
		return y * this.width + x;
	}

	get_random_south_street_coord(){
		let weighted_set = new WeightedSet();
		let chance = 1;
		for (let index = 0; index < this.size; index++) {
			chance *= 1.05;
			if(this.tiles[index].walkable){
				weighted_set.add(index, chance);
			}
		}
		let picked_index = weighted_set.choose_random();
		return this.convert_index_to_xy(picked_index);
	}
	get_random_north_street_coord(){
		let weighted_set = new WeightedSet();
		let chance = 1;
		for (let index = this.size-1; index >=0; index--) {
			chance *= 1.05;
			if(this.tiles[index].walkable){
				weighted_set.add(index, chance);
			}
		}
		let picked_index = weighted_set.choose_random();
		return this.convert_index_to_xy(picked_index);
	}

	in_bounds(x,y){
		return x>-1 && x<this.width && y>-1 && y<this.height
	}

	is_walkable(x,y,direction){
		if(direction == "up"){
			y--;
		}else{
			if(direction == "down"){
				y++;
			}
		}
		if(direction == "left"){
			x--;
		}else{
			if(direction == "right"){
				x++;
			}
		}
		if (! this.in_bounds(x,y)){
			return false;
		}
		return this.tiles[y * this.width + x].walkable;
	}

	create_random(){
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let index = y * this.width + x;

				if (x == 0 || y == 0 || x == this.width-1 || y == this.height-1) {
					this.change_to_water(index);
					continue;
				}
				if (x % 3 == 0 || y % 3 == 0) {
					if(Math.random()<0.95){
						this.change_to_road(index);
					}
					continue;
				}
				this.change_to_builds(index);
			}
		}
	}

	change_to_road(index){
		this.tiles[index].image.x = 0;
		this.tiles[index].image.y = 0;
		this.tiles[index].walkable = true;
		this.tiles[index].water = false;
	}
	change_to_tree(index){
		this.tiles[index].image.x = 3;
		this.tiles[index].image.y = 2;
		this.tiles[index].walkable = false;
		this.tiles[index].water = false;
	}
	change_to_water(index){
		this.tiles[index].image.x = 3;
		this.tiles[index].image.y = 0;
		this.tiles[index].walkable = false;
		this.tiles[index].water = true;
	}
	change_to_sand(index){
		this.tiles[index].image.x = 3;
		this.tiles[index].image.y = 1;
		this.tiles[index].walkable = false;
		this.tiles[index].water = false;
	}
	change_to_builds(index){
		this.tiles[index].image.x = Math.floor(Math.random()*2)+1;
		this.tiles[index].image.y = Math.floor(Math.random()*2);
		this.tiles[index].walkable = false;
		this.tiles[index].water = false;
	}
	update(){
		for (let index = this.size-1; index >=0; index--) {
			if(this.tiles[index].team == 1){
				this.tiles[index].team_timer++;
				this.tiles[index].team_timer *= 1.075;
				this.team_timer_weighted_set.add(index, this.tiles[index].team_timer);
			}
			if(this.tiles[index].team == 2){
				this.tiles[index].team_timer++;
				this.team_timer_weighted_set.add(index, this.tiles[index].team_timer);
			}
		}
		let tile_with_team = this.team_timer_weighted_set.choose_random();
		if(tile_with_team && tile_with_team != "do_nothing"){
			this.tiles[tile_with_team].team = 0;
			this.tiles[tile_with_team].team_timer = 0;
			this.team_timer_weighted_set.remove(tile_with_team);
		}
	}
	draw(ctx){
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let index = y * this.width + x;
				ctx.drawImage(
					images,
					this.tiles[index].image.x *32, this.tiles[index].image.y *32,
					32, 32,
					x *32, y *32,
					32, 32
					);
				if(this.tiles[index].water && index>25 && !this.tiles[index-25].water){
					ctx.fillStyle = "rgba(0,0,0,0.25)";
					ctx.fillRect(x *32, y *32, 32, 8);
				}
				if(this.tiles[index].team == 1){
					ctx.drawImage(
						images,
						2 *32, 2 *32,
						32, 32,
						x *32, y *32 +Math.cos(this.tiles[index].team_timer/100),
						32, 32
						);
				}
				if(this.tiles[index].team == 2){
					ctx.drawImage(
						images,
						1 *32, 2 *32,
						32, 32,
						x *32, y *32 +Math.cos(this.tiles[index].team_timer/10),
						32, 32
						);
				}
			}
		}
	}
}