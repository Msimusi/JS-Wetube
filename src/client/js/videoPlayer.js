const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const textarea = document.querySelector("textarea");

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
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 볼륨 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //
const handleMuteClick = () => {
  if (volumeValue != 0 && !video.muted) {
    volumeRange.value = 0;
    video.muted = true;
  } else {
    if (volumeValue == 0) {
      volumeValue = 0.5;
    }
    video.volume = volumeValue;
    volumeRange.value = volumeValue;
    video.muted = false;
  }

  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
};

handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }

  if (value == 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
};

const handleVolumeByArrow = (volume) => {
  volumeValue += volume;
  volumeValue = volumeValue > 1 ? (volumeValue = 1) : volumeValue;
  volumeValue = volumeValue < 0 ? (volumeValue = 0) : volumeValue;

  volumeRange.value = volumeValue;
  video.volume = volumeValue;
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 타임라인 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handletimelineChange = (event) => {
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

const handletimelineSet = () => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};

const handleVideoEnded = async () => {
  video.currentTime = 0;
  timeline.value = 0;
  playBtnIcon.className = "fas fa-play";

  const { id } = videoContainer.dataset;
  await fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleTimelineByArrow = (seconds) => {
  video.currentTime += seconds;
};

// 기타
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
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
  controlsTimeout = setTimeout(hideControls, 3000);
};

// 플레이, 일시정지
playBtn.addEventListener("click", handlePlayClick); // 플레이/일시정지 버튼
video.addEventListener("click", handlePlayClick); //비디오 클릭시 시 플레이/일시정지

// 볼륨
muteBtn.addEventListener("click", handleMuteClick); // 음소거 버튼 On/Off
volumeRange.addEventListener("input", handleVolumeChange); // 볼륨 라인 조작

// 타임라인
video.addEventListener("canplaythrough", handleLoadedMetadata); // 메타데이터에서 비디오지속시간 받아오기
video.addEventListener("timeupdate", handleTimeUpdate); // 시간이 업데이트 될 때마다, 타임라인 갱신
videoContainer.addEventListener("mousemove", handleMouseMove); // 마우스가 위에서 움직일 때 컨트롤러 보여주기
videoContainer.addEventListener("mouseleave", handleMouseLeave); // 마우스가 떨어지면 컨트롤러 감춤
timeline.addEventListener("input", handletimelineChange); // 타임라인을 갱신하여 플레이타임 갱신
timeline.addEventListener("change", handletimelineSet); // 타임라인을 조작해도 재생/일시정지 값 유지
video.addEventListener("ended", handleVideoEnded); // 비디오 끝났을 때 초기화

//기타
fullScreenBtn.addEventListener("click", handleFullScreen); // 전체화면 버튼 on/Off

// 키 입력 대응
document.addEventListener("keyup", (event) => {
  if (event.target == textarea) {
    return;
  } else {
    if (event.key === "m") {
      // M 누르면 음소거 on/off
      handleMuteClick();
    }

    if (event.key === "f") {
      // f 누르면 전체화면 on/off
      handleFullScreen();
    }
  }
});
document.addEventListener("keydown", (event) => {
  if (event.target == textarea) {
    return;
  } else {
    if (event.code == "Space") {
      // 스페이스 재생, 일시정지
      handlePlayClick();
    }
    if (event.key === "ArrowUp") {
      // 위 화살표 볼륨 업
      handleVolumeByArrow(0.1);
    }
    if (event.key === "ArrowDown") {
      // 아래 화살표 볼륨 다운
      handleVolumeByArrow(-0.1);
    }

    if (event.key === "ArrowRight") {
      // 왼쪽 화살표 시간 되감기
      handleTimelineByArrow(5);
    }
    if (event.key === "ArrowLeft") {
      // 오른쪽 화살표 시간 빨리감기
      handleTimelineByArrow(-5);
    }
  }
});
