/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';

const Post = mongoose.model('Post');

export const createPost = async (post, next) => {
    try {
        return new Promise(async resolve => {
            await Post.create(post).then((doPost) => {
                return resolve(doPost);
            }).catch((errPost) => {
                return next(errPost);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getOnePost = async (post, next) => {
    try {
        return new Promise(async resolve => {
            await Post.findById(post).then((doPost) => {
                return resolve(doPost);
            }).catch((errPost) => {
                return next(errPost);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const updatePost = async (post, req, next) => {
    try {
        return new Promise(async resolve => {
            await Post.findByIdAndUpdate(post, req, {
                new: true,
                runValidators: true,
            }).then((doPost) => {
                return resolve(doPost);
            }).catch((errPost) => {
                return next(errPost);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const deletePost = async (post, next) => {
    try {
        return new Promise(async resolve => {
            await Post.findByIdAndRemove(post).then((doPost) => {
                return resolve(doPost);
            }).catch((errPost) => {
                return next(errPost);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getCompletePost = async (post, req, next) => {
    try {
        return new Promise(async resolve => {
            await Post.findByIdAndUpdate(post, req, {
                new: true,
                runValidators: true,
            }).then((doPost) => {
                return resolve(doPost);
            }).catch((errPost) => {
                return next(errPost);
            });
        });
    } catch (error) {
        return next(error);
    }
};