import PostModel from '../models/Post.js';

export const getAll = async(req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося отримати пости'
        })
    }
}

export const getOne = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
                _id: postId
            }, {
                $inc: { viewsCount: 1 }
            }, {
                returnDocument: 'after'
            },
            (e, doc) => {
                if (e) {
                    console.log(e);
                    return res.status(500).json({
                        message: 'Не вдалося отримати пост'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статя не знайдена'
                    })
                }

                res.json(doc);
            });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося отримати пост'
        })
    }
}

export const remove = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId
        }, (e, doc) => {
            if (e) {
                console.log(e);
                return res.status(500).json({
                    message: 'Не вдалося видалити пост'
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статя не знайдена'
                })
            }

            res.json({
                success: true
            })
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося отримати пост'
        })
    }
}

export const create = async(req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося створити пост'
        })
    }
}

export const update = async(req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });

        res.json({
            success: true
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося обновити пост'
        })
    }
}