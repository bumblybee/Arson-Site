const { Recipe, News } = require("../models");

// TODO: fix 404 so it isn't called when using non-root routes

exports.getHome = async (req, res, next) => {
  let recipes = await Recipe.find().sort({ date: -1 });
  let news = await News.find().sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news });
};

exports.getStory = (req, res) => {
  res.render("story");
};

exports.getNews = (req, res) => {
  News.find({}, (err, posts) => {
    if (err) throw err;

    res.render("news", { posts });
  }).sort({ date: -1 });
};

exports.getNewsPost = (req, res) => {
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
        title,
        content1,
        content2,
        content3,
        date,
        images,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.getRecipes = (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) throw err;
    // res.set("Content-Type", newRecipe.img.contentType);
    res.render("recipes", { recipes });
  }).sort({ date: -1 });
};
//TODO: set loggedIn to false here and create separate route for displaying single recipe with edit btn
exports.getRecipe = (req, res) => {
  const recipeID = req.params.recipeID;

  Recipe.findOne({ _id: recipeID }, (err, recipe) => {
    if (err) throw err;
    if (recipe) {
      const title = recipe.title;
      const content1 = recipe.content1;
      const content2 = recipe.content2;
      const content3 = recipe.content3;
      const date = recipe.date;
      const submittedBy = recipe.submittedBy;
      const images = recipe.images;
      res.render("recipe", {
        id: recipe._id,
        title,
        content1,
        content2,
        content3,
        date,
        submittedBy,
        images,
        loggedIn: true,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.getPricing = (req, res) => {
  //TODO: Add file upload POST
  const url = "https://arsonsauce.com/pdf/pricing.pdf";
  res.render("pricing", { url });
};

exports.compose = (req, res) => {
  console.log(req.token.data);
  const type = req.params.type;
  if (type === "recipe") {
    const newRecipe = new Recipe({
      title: req.body.title,
      date: req.body.date,
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      submittedBy: req.body.submittedBy,
      comment: req.body.comment,
      images: req.files,
    });

    newRecipe.save();
    res.redirect("/recipes");
  } else if (type === "news") {
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
    newPost.save();
    res.redirect("/news");
  }
};

exports.getEditForm = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  console.log(req);
  if (type === "news") {
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
        });
      } else {
        console.log("something went wrong");
      }
    });
  } else if (type === "recipe") {
    Recipe.findOne({ _id: id }, (err, recipe) => {
      if (err) throw err;
      if (recipe) {
        res.render("auth/editRecipeForm", {
          id: recipe._id,
          title: recipe.title,
          date: recipe.date,
          content1: recipe.content1,
          content2: recipe.content2,
          content3: recipe.content3,
          submittedBy: recipe.submittedBy,
          comment: recipe.comment,
          images: recipe.images,
        });
      } else {
        console.log("something went wrong");
      }
    });
  }
};

exports.editPost = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  console.log(req.body);

  if (type === "recipe") {
    Recipe.updateOne(
      { _id: id },
      {
        title: req.body.title,
        date: req.body.date,
        content1: req.body.content1,
        content2: req.body.content2,
        content3: req.body.content3,
        submittedBy: req.body.submittedBy,
        comment: req.body.comment,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect(`/recipes/${id}`);
        }
      }
    );
  }

  if (type === "news") {
    News.updateOne(
      { _id: id },
      {
        title: req.body.title,
        date: req.body.date,
        content1: req.body.content1,
        content2: req.body.content2,
        content3: req.body.content3,
        comment: req.body.comment,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.redirect(`/news/${id}`);
        }
      }
    );
  }
};
