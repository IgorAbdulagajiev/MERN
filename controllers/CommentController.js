import CommentModel from "../models/Comment.js";

export const getAllNew = async (req, res) => {
  try {
    const newComments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .populate('user')
      .exec();
    res.json(newComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
}

export const getAllByPostId = async (req, res) => {
  const postId = req.params.id;
  try {
    const newComments = await CommentModel.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();
    res.json(newComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.body.postId,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
}
