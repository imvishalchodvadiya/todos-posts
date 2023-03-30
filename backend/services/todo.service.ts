/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';
const Todo = mongoose.model('Todo');

export const createTodo = async (todo, next) => {
    try {
        return new Promise(async resolve => {
            await Todo.create(todo).then((doTodo) => {
                return resolve(doTodo);
            }).catch((errTodo) => {
                return next(errTodo);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getOneTodo = async (todo, next) => {
    try {
        return new Promise(async resolve => {
            await Todo.findById(todo).then((doTodo) => {
                return resolve(doTodo);
            }).catch((errTodo) => {
                return next(errTodo);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const updateTodo = async (todo, req, next) => {
    try {
        return new Promise(async resolve => {
            await Todo.findByIdAndUpdate(todo,req, {
                new: true,
                runValidators: true,
            }).then((doTodo) => {
                return resolve(doTodo);
            }).catch((errTodo) => {
                return next(errTodo);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteTodo = async (todo, next) => {
    try {
        return new Promise(async resolve => {
            await Todo.findByIdAndRemove(todo).then((doTodo) => {
                return resolve(doTodo);
            }).catch((errTodo) => {
                return next(errTodo);
            });
        });
    } catch (error) {
        return next(error);
    }
};

export const getCompleteTodo = async (todo,req, next) => {
    try {
        return new Promise(async resolve => {
            await Todo.findByIdAndUpdate(todo,req, {
                new: true,
                runValidators: true,
            }).then((doTodo) => {
                return resolve(doTodo);
            }).catch((errTodo) => {
                return next(errTodo);
            });
        });
    } catch (error) {
        return next(error);
    }
};