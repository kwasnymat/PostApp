const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                posts: posts
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, enter correct data!');
        error.statusCode = 422;
        throw error;
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
            res.status(201).json({
                message: 'Post added successfully!',
                post: result
            });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                const error = new Error('Could not find post');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({post: post});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const error = new Error('Validation failed, enter correct data!');
      error.statusCode = 422;
      throw error;
  }
  const title = req.body.title;
  const content = req.body.content;

  Post.findById(postId)
      .then(post => {
          if(!post){
              const error = new Error('Could not find post');
              error.statusCode = 404;
              throw error;
          }
          post.title = title;
          post.content = content;
          post.image = 'images/trophy.jpg'
          ;
          return post.save();
      })
      .then(result => {
          res.status(200).json({
              message: 'Post updated',
              post: result
          })
      })
      .catch(err => {
          if(!err.statusCode){
              err.statusCode = 500;
          }
          next(err);
      });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId)
      .then(result => {
          res.status(200).json({
              message: 'Post deleted!'
          });
      })
      .catch( err => {
          if(!err.statusCode){
              err.statusCode = 500;
          }
          next(err);
      });
};