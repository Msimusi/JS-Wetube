import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

const isHeroku = process.env.NODE_ENV === "production";

// Video.find({}, (error, videos) => {})

// 홈
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    console.log(videos);
    console.log(videos[0].thumbUrl);
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("404");
  }
};

//비디오 시청
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log(video);
  console.log(video.fileUrl);

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
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }

  return res.render("edit", {
    pageTitle: `Edit: ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  const { title, description, hashtags } = req.body;

  // 에러!
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

// 비디오 업로드
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { video, thumb } = req.files;
  const {
    body: { title, description, hashtags },
    session: {
      user: { _id: owner },
    },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(owner);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// 비디오 삭제
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search Video", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views++;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();

  // 유저 데이터에 커멘트 데이터 연동

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { commentId },
  } = req;
  console.log(commentId);

  const comment = await Comment.findById(commentId).populate("owner");
  const videoId = comment.video;

  if (String(_id) !== String(comment.owner._id)) {
    console.log("Not Owner");
    return res.sendStatus(404);
  }
  const video = await Video.findById(videoId);
  if (!video) {
    console.log("Video not Find");
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();
  await Comment.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
