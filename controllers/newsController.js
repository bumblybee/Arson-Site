const { News } = require("../models");
const { checkAuth } = require("../middleware/isAuth");

// Controller Fns

exports.getNews = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  News.find({}, (err, posts) => {
    if (err) throw err;

    res.render("news", { posts, auth });
  }).sort({ date: -1 });
};

exports.getNewsPost = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  const postId = req.params.id;
  News.findOne({ _id: postId }, (err, post) => {
    if (err) throw err;
    if (post) {
      const title = post.title;
      const content1 = post.content1;
      const content2 = post.content2;
      const content3 = post.content3;
      const date = post.date;
      const images = post.images;

      res.render("newsPost", {
        id: post._id,
        title,
        content1,
        content2,
        content3,
        date,
        images,
        auth,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.getComposeNews = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  res.render("auth/composeNews", { auth });
};

exports.composeNews = (req, res) => {
  const newPost = new News({
    title: req.body.title,
    date: req.body.date,
    content1: req.body.content1,
    content2: req.body.content2,
    content3: req.body.content3,
    submittedBy: req.body.submittedBy,
    comment: req.body.comment,
    images: req.files,
  });
  // newPost.save();
  console.log(newPost);
  res.redirect("/news");
};

exports.getEditNewsForm = (req, res) => {
  const id = req.params.id;
  const { auth, token } = checkAuth(req.cookies["PAS"]);

  News.findOne({ _id: id }, (err, post) => {
    if (err) throw err;
    if (post) {
      res.render("auth/editNewsForm", {
        id: post._id,
        title: post.title,
        content1: post.content1,
        content2: post.content2,
        content3: post.content3,
        comment: post.comment,
        date: post.date,
        images: post.images,
        auth,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.editNews = (req, res) => {
  const id = req.params.id;
  console.log(req.params, req.body);

  // News.updateOne(
  //   { _id: id },
  //   {
  //     title: req.body.title,
  //     date: req.body.date,
  //     content1: req.body.content1,
  //     content2: req.body.content2,
  //     content3: req.body.content3,
  //     comment: req.body.comment,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(result);
  //       res.redirect(`/news/${id}`);
  //     }
  //   }
  // );
};
