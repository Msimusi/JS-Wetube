import Video from "../models/Video";

// Video.find({}, (error, videos) => {})

// 홈
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

//비디오 시청
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  // 비디오 없음 에러
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }

  // 최종결과
  return res.render("watch", { pageTitle: video.title, video });
};

// 비디오 수정
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  const { title, description, hashtags } = req.body;

  // 에러!
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

// 비디오 업로드
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = (req, res) => res.send("Search");

// 비디오 삭제
export const deleteVideo = (req, res) =>
  res.render("deletevideo", { pageTitle: "Delete Video!" });
