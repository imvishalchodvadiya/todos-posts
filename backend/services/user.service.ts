/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';
const User = mongoose.model('User');

export const createUser = async (user, next) => {
    try {
        return new Promise(async resolve => {
            await User.create(user).then((docUser) => {
                return resolve(docUser);
            }).catch((errUser) => {
                if (errUser.code == 11000) {
                    return next({
                        status: 422,
                        errors: errUser,
                        title: 'Email is already exists',
                        message: 'This Email is already registered.'
                    });
                } else {
                    return next(errUser);
                }
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (user, mProjection, next) => {
    try {
        return await User.findOne(user, mProjection).then((docUser) => {
            return docUser;
        }).catch((errUser) => {
            return next(errUser);
        });
    } catch (error) {
        return next(error);
    }
};