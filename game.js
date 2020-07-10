var game = {
	hearts: [],
	poison: [],
	enemies: [],
	map: null,
	player_1: null,
	player_2: null,
	is_coop: false,
	state: "playing",
	level: 1
};
var screen = {
	title: new Title(),
	in_title: true,
	in_game: false,
}
var sounds = {
	lost: new Sound("lost.ogg"),
	monster_defeated: new Sound("monster_defeated.ogg"),
	next_level: new Sound("next_level.ogg"),
	select: new Sound("select.ogg"),
	bgm: new Sound("bgm.mp3", 0.3)
}
sounds.bgm.autoplay();
sounds.bgm.loop();

var images = new Image();
images.src = "images.png";

const canvas = document.getElementById("canvas");
canvas.focus();
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var keysDown = {};
window.addEventListener("keydown", function (event) {
	keysDown[event.key] = true;
	event.preventDefault();
}, true);
window.addEventListener("keyup", function (event) {
	keysDown[event.key] = false;
	event.preventDefault();
}, true);

var AnimationFrame;
function main_start(){
	cancelAnimationFrame(AnimationFrame);
	game.map = new Map();
	game.player_1 = new Player(1);
	game.player_2 = new Player(2);

	for (let i = 0; i < game.level; i++) {
		game.enemies.push(new Enemy());
	}
	AnimationFrame = requestAnimationFrame(updateGame);
}

function next_level(){
	sounds.monster_defeated.pause();
	sounds.next_level.play();
	game.level++;
	main_start();
}
function game_over(){
	if(game.level > (localStorage.high_score || 0)){
		localStorage.high_score = game.level;
	}
	game.level = 1;
	game.enemies = [];
	screen.in_title = true;
	main_start();
}
function updateGame(){
	AnimationFrame = requestAnimationFrame(updateGame);
	if(screen.in_title){
		screen.title.update();
		screen.title.draw(ctx);
		return;
	}
	if(game.enemies.length == 0) {
		next_level();
		return;
	}
	if(game.is_coop){
		if (game.player_1.dead && game.player_2.dead){
			game_over();
			return;
		}
	}else{
		if (game.player_1.dead){
			game_over();
			return;
		}
	}

	game.map.update();
	input();
	game.player_1.update();
	if(game.is_coop){
		game.player_2.update();
	}
	for (let i = game.enemies.length - 1; i >= 0; i--) {
		game.enemies[i].update();
		if (game.enemies[i].dead){
			sounds.monster_defeated.play();
			game.enemies.splice(i,1);
		}
	}

	drawGame();
}

function input(){
	if(game.is_coop){
		if(keysDown["ArrowRight"]) {
			game.player_1.last_input = "right";
		}
		else if(keysDown["ArrowLeft"]) {
			game.player_1.last_input = "left";
		}
		if(keysDown["ArrowDown"]) {
			game.player_1.last_input = "down";
		}
		else if(keysDown["ArrowUp"]) {
			game.player_1.last_input = "up";
		}

		if(keysDown["d"]) {
			game.player_2.last_input = "right";
		}
		else if(keysDown["a"]) {
			game.player_2.last_input = "left";
		}
		if(keysDown["s"]) {
			game.player_2.last_input = "down";
		}
		else if(keysDown["w"]) {
			game.player_2.last_input = "up";
		}
	}else{
		if(keysDown["ArrowRight"] || keysDown["d"]) {
			game.player_1.last_input = "right";
		}
		else if(keysDown["ArrowLeft"] || keysDown["a"]) {
			game.player_1.last_input = "left";
		}
		if(keysDown["ArrowDown"] || keysDown["s"]) {
			game.player_1.last_input = "down";
		}
		else if(keysDown["ArrowUp"] || keysDown["w"]) {
			game.player_1.last_input = "up";
		}
	}
}

function drawGame(){
	game.map.draw(ctx);
	game.player_1.draw(ctx);
	if(game.is_coop){
		game.player_2.draw(ctx);
	}

	for (let i = 0; i < game.enemies.length; i++) {
		game.enemies[i].draw(ctx);
	}
	ctx.font = "20px Monospace";
	ctx.textAlign = 'left';
	ctx.strokeStyle = "rgb(125,0,25)";
	ctx.fillStyle = "pink";
	ctx.lineWidth = 5;
	ctx.strokeText("Level: "+game.level, 20, 2+30);
	ctx.fillText("Level: "+game.level, 20, 30);
}

main_start();