const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
          title: 'First Post',
          content: 'This is first post!',
          imageUrl: 'images/trophy.jpg',
          creator: {
              name: 'Mateusz'
          },
          createdAt: new Date()
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, enter correct data!',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/trophy.jpg',
        creator: {
            name: 'Mateusz'
        },
    });
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post added successfully!',
                post: result
            });
        })
        .catch(err => console.log(err));
};