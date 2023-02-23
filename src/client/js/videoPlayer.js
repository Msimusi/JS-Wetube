const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const mute = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

console.log(play, mute, time, volume);

const handlePlayClick = (e) => {
  // if video was playing, pause, vice versa
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handlePause = (e) => {
  playBtn.innerText = "Play";
};
const handlePlay = (e) => {
  playBtn.innerText = "Pause";
};

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayClick);
mute.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
