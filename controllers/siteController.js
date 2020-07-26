const multer = require("multer");
const { memoryStorage } = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

// --------------- Multer Setup ---------

const multerOptions = {
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};
exports.upload = multer(multerOptions, upload.array("imgFiles", 3));

exports.resize = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
   if (req.body.postType === "news") {
   
        const images = req.files;
        req.body.imgs = [];
        images.forEach(image => {
            const ext = image.mimetype.split("/")[1];
            const imgPath = `${uuid.v4()}.${ext}`;
            req.body.imgs.push(imgPath);
            const photo = await jimp.read(image.buffer);
            await photo.resize(800, jimp.AUTO);
            await photo.write(`/public/img/${req.body.imgPath}`);

        });

        const newPost = new News(req.body);
    

        console.log("It worked", newPost);

        await newPost.save();
        res.redirect("/news");
    }else if (req.body.postType === "recipe") {
    console.log("It's a recipe");
    const newRecipe = new Recipe({
      title: req.body.title,
      date: req.body.date,
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      submittedBy: req.body.submittedBy,
      comment: req.body.comment,
      imgs: req.files,
      // imgSrc: `/img/${req.file.filename}`,
    });

    await newRecipe.save();
    res.redirect("/recipes");
  }
   
    next();

};
