import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import * as postService from '../services/post.service';
import { filter } from '../helpers/factoryHandler';

const Post = mongoose.model('Post');

export const createOne = async (req, res, next) => {
    try {
        const _errors = validationResult(req);
        const _request = req.body;
        const _user = req.user;

        if (!_errors.isEmpty()) {
            return next(_errors);
        } else {
            const postData = {
                'userId': _user['userId'],
                'title': _request['title'],
                'body': _request['body'],
            }
            const docPost = await postService.createPost(postData, next);
            return res.send({
                success: true,
                title: 'Post Added successfully!',
                message: 'Post has been successfully.',
                data: {
                    Post: docPost
                }
            });
        }
    } catch (error) {
        return next(error);
    }
};

export const getAllPost = async (req, res, next) => {
    try {
        const _user = req.user;
        const [totalCount, result] = await filter(Post.find({ 'userId': _user['userId'] }).populate('title'), req.query);
        return res.json({
            success: true,
            title: 'Post sent !',
            message: 'Post sent successfully!',
            count: totalCount,
            data: {
                result
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllPostList = async (req, res, next) => {
    try {
        const [totalCount, result] = await filter(Post.find({}).populate('title'), req.query);
        return res.json({
            success: true,
            title: 'Post sent !',
            message: 'Post sent successfully!',
            count: totalCount,
            data: {
                result
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getOnePost = async (req, res, next) => {
    try {
        const docPost = await postService.getOnePost(req.params.id, next);
        return res.send({
            success: true,
            title: 'Post Added successfully!',
            message: 'Post has been successfully.',
            data: {
                Post: docPost
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const docPost = await postService.updatePost(req.params.id, req.body, next);
        return res.send({
            success: true,
            title: 'Post Updated successfully!',
            message: 'Post has been updated successfully.',
            data: {
                Post: docPost
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const docPost = await postService.deletePost(req.params.id, next);
        return res.send({
            success: true,
            title: 'Post Deleted successfully!',
            message: 'Post has been deleted successfully.',
            data: {
                docPost
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const completePost = async (req, res, next) => {
    try {
        const docPost = await postService.getOnePost(req.params.id, next);
        if (docPost) {
            const _request = {
                "completed": true,
                "updatedAt ": docPost
            }
            const result = await postService.getCompletePost(req.params.id, _request, next);
            console.log(result);
            return res.send({
                success: true,
                title: 'Post complate updated successfully!',
                message: 'Post has been complate updated successfully.',
                data: {
                    result
                }
            });
        }
    } catch (error) {
        return next(error);
    }
};