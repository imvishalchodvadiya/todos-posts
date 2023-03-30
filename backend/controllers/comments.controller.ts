import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import * as CommentsService from '../services/Comments.service';
import { filter } from '../helpers/factoryHandler';

const Comments = mongoose.model('Comments');

export const createOne = async (req, res, next) => {
    try {
        const _errors = validationResult(req);
        const _request = req.body;
        const _user = req.user;
        const _postId = req.params.id;

        if (!_errors.isEmpty()) {
            return next(_errors);
        } else {
            const CommentsData = {
                'userId': _user['userId'],
                'email': _user['email'],
                'postId': _postId,
                'title': _request['title'],
                'body': _request['body'],
            }
            const docComments = await CommentsService.createComments(CommentsData, next);
            return res.send({
                success: true,
                title: 'Comments Added successfully!',
                message: 'Comments has been successfully.',
                data: {
                    Comments: docComments
                }
            });
        }
    } catch (error) {
        return next(error);
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const _user = req.user;
        const [totalCount, result] = await filter(Comments.find({ 'userId': _user['userId'] }).populate('title'), req.query);
        return res.json({
            success: true,
            title: 'Comments sent !',
            message: 'Comments sent successfully!',
            count: totalCount,
            data: {
                result
            },
        });
    } catch (error) {
        return next(error);
    }
};
