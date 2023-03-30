/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';

const Comments = mongoose.model('Comments');

export const createComments = async (comments, next) => {
    try {
        return new Promise(async resolve => {
            await Comments.create(comments).then((doComments) => {
                return resolve(doComments);
            }).catch((errComments) => {
                return next(errComments);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getOneComments = async (comments, next) => {
    try {
        return new Promise(async resolve => {
            await Comments.findById(comments).then((doComments) => {
                return resolve(doComments);
            }).catch((errComments) => {
                return next(errComments);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getCompleteComments = async (comments, req, next) => {
    try {
        return new Promise(async resolve => {
            await Comments.findByIdAndUpdate(comments, req, {
                new: true,
                runValidators: true,
            }).then((doComments) => {
                return resolve(doComments);
            }).catch((errComments) => {
                return next(errComments);
            });
        });
    } catch (error) {
        return next(error);
    }
};