class Sound{
	constructor(src, volume){
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		this.sound.volume = volume || 0.2;
		document.body.appendChild(this.sound);
	}
	play(){
		this.sound.play();
	}
	loop(){
		this.sound.loop = true;
	}
	autoplay(){
		this.sound.autoplay = true;
	}
	pause(){
		this.sound.pause();
	}
}