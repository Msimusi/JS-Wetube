import User from "../models/User";
import Video from "../models/Video";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "The username/email is already taken",
    });
  }

  try {
    await User.create({ name, username, email, password, location });
    return res.redirect("/login");
  } catch (error) {
    return res.render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.exists({ username });

  if (!exists) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists",
    });
  }
  //   {
  //     const videos = await Video.find({}).sort({ createdAt: "desc" });
  //     return res.render("home", { pageTitle: "Home", videos });
  //   }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("see");
