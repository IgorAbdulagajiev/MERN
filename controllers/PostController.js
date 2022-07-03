import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = Array.from(new Set(posts.map(obj => obj.tags).flat())).slice(0, 5)

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить теги",
    });
  }
};

export const getAllNew = async (req, res) => {
  try {
    const newPosts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res.json(newPosts);
  } catch(err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось получить новые статьи",
      });
  }
}

export const getAllPopular = async (req, res) => {
  try {
    const popularPosts = await PostModel.find()
      .sort({ viewsCount: -1 })
      .populate("user")
      .exec();

    res.json(popularPosts);
  } catch(err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось получить популярные статьи",
      });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      $inc: { viewsCount: 1 },
    },
    {
      returnDocument: 'after'
    },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось вернуть статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }

      res.json(doc);
    }
    ).populate('user');
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Не удалось удалить статью",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }

      res.json({
        success: true,
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
}