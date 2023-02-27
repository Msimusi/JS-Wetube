const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsMovementTimeout = null;
let controlsTimeout = null;
let videoPlayStatus = false;
let setVideoPlayStatus = false;
let volumeValue = 0.5;
video.volume = volumeValue;

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 재생/일시정지 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handlePlayBySpace = (event) => {
  if (event.code == "Space") {
    handlePlayClick();
  }
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 볼륨 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //
const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  volumeRange.value = video.muted ? 0 : volumeValue;
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
};

handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 타임라인 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;

  if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
  }

  video.pause();
  video.currentTime = value;
};

const handleTimelineSet = () => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};

const handleVideoEnded = () => {
  video.currentTime = 0;
  timeLine.value = 0;
  playBtn.innerText = "Play";
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Fullscreen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Fullscreen";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  console.log(controlsMovementTimeout);
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  console.log(controlsTimeout);
  controlsTimeout = setTimeout(hideControls, 3000);
};

// 플레이, 일시정지
playBtn.addEventListener("click", handlePlayClick); // 플레이/일시정지 버튼
window.addEventListener("keydown", handlePlayBySpace); //Enter를 입력 시 플레이/일시정지
video.addEventListener("keydown", handlePlayBySpace); //Enter를 입력 시 플레이/일시정지
video.addEventListener("click", handlePlayClick); //Enter를 입력 시 플레이/일시정지

// 볼륨
muteBtn.addEventListener("click", handleMuteClick); // 음소거 버튼 On/Off
volumeRange.addEventListener("input", handleVolumeChange); // 볼륨 라인 조작

// 타임라인
video.addEventListener("loadedmetadata", handleLoadedMetadata); // 메타데이터에서 비디오지속시간 받아오기
video.addEventListener("timeupdate", handleTimeUpdate); // 시간이 업데이트 될 때마다, 타임라인 갱신
timeLine.addEventListener("input", handleTimelineChange); // 타임라인을 갱신하여 플레이타임 갱신
timeLine.addEventListener("change", handleTimelineSet); // 타임라인을 조작해도 재생/일시정지 값 유지
video.addEventListener("ended", handleVideoEnded); // 비디오 끝났을 때 초기화

//기타
fullScreenBtn.addEventListener("click", handleFullScreen); // 전체화면 버튼 on/Off
video.addEventListener("mousemove", handleMouseMove); // 마우스가 위에서 움직일 때 컨트롤러 보여주기
video.addEventListener("mouseleave", handleMouseLeave); // 마우스가 떨어지면 컨트롤러 감춤
