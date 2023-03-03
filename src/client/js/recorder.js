import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const transcodeBtn = document.getElementById("transcode");
const autoThumbnailBtn = document.getElementById("autoThumbnail");
const videoInput = document.getElementById("video");
const thumbInput = document.getElementById("thumb");
const ffmpeg = createFFmpeg({ log: true });

let stream;
let recorder;
let videoFile;
let uploadingFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const transcodeVideo = async (file) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", files.input, await fetchFile(file));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  const mp4File = ffmpeg.FS("readFile", files.output);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  downloadFile(mp4Url, "MyRecording.mp4");

  const videoFileObj = new File([mp4Blob], "TranscodedVideo.jpg", {
    type: "video/mp4",
  });
  const dataTransfer = new DataTransfer();

  dataTransfer.items.add(videoFileObj);
  videoInput.files = dataTransfer.files;

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(uploadingFile);
};

const thumbnailExport = async (file) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", files.input, await fetchFile(file));
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(thumbUrl, "MyThumbnail.jpg");

  const thumbFileObj = new File([thumbBlob], "AutoThumbnail.jpg", {
    type: "image/jpg",
  });
  const dataTransfer = new DataTransfer();

  dataTransfer.items.add(thumbFileObj);
  thumbInput.files = dataTransfer.files;

  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(thumbUrl);
};

const uploadingFiletranscode = async () => {
  transcodeBtn.removeEventListener("click", uploadingFiletranscode);
  transcodeBtn.innerText = "Transcoding...";
  transcodeBtn.disabled = true;

  await transcodeVideo(uploadingFile);
  await thumbnailExport(uploadingFile);

  transcodeBtn.disabled = false;
  transcodeBtn.innerText = "Transcode Complete";
};

/////////////////////////////////////////////////////////////////////////

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  await transcodeVideo(videoFile);
  await thumbnailExport(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  video.srcObject = stream;
  video.play();
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download the Record";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };

  recorder.start();
};
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 640, height: 360 },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);

videoInput.addEventListener("change", (event) => {
  uploadingFile = event.target.files[0];

  transcodeBtn.disabled = false;
  transcodeBtn.style.display = "block";
  autoThumbnailBtn.disabled = false;
  autoThumbnailBtn.style.display = "block";

  transcodeBtn.addEventListener("click", uploadingFiletranscode);
  autoThumbnailBtn.addEventListener("click", () => {
    thumbnailExport(uploadingFile);
  });
});
