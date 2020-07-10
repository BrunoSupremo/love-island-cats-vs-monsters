class WeightedSet{
	constructor(){
		this._map = {};
		this._total_weight = 0;
		this._total_is_valid = true;
	}

	add(item, weight){
		this._map[item] = weight;
		this._total_is_valid = false;
	}
	remove(item){
		delete this._map[item];
		this._total_is_valid = false;
	}
	remove_all(){
		this._map = {};
		this._total_weight = 0;
		this._total_is_valid = true;
	}

	get_total_weight(){
		this._calculate_total_weight();

		return this._total_weight;
	}

	is_empty(){
		return this.get_total_weight() == 0;
	}

	choose_random(){
		this._calculate_total_weight()

		if (this._total_weight == 0){
			return null;
		}

		let roll = Math.random() * this._total_weight;
		let sum = 0;
		let safety_net = 0;

		for (const [item, weight] of Object.entries(this._map)) {
			sum = sum + weight;

			if (roll < sum){
				return item;
			}

			safety_net = item;
		}

		return safety_net;
	}

	_calculate_total_weight(){
		if (this._total_is_valid){
			return null;
		}

		let sum = 0;

		for (const [item, weight] of Object.entries(this._map)) {
			sum = sum + weight;
		}

		this._total_weight = sum;
		this._total_is_valid = true;
	}

}