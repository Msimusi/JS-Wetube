const videos = [
  {
    title: "First Video",
    rating: 3,
    comments: 4,
    createdAt: "5 minutes ago",
    views: 50,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 30,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 3,
    createdAt: "1 minutes ago",
    views: 20,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = (req, res) =>
  res.render("deletevideo", { pageTitle: "Delete Video!" });
export const upload = (req, res) => res.send("Upload Video");
export const search = (req, res) => res.send("Search");
