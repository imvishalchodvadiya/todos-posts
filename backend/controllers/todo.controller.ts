import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import * as todoService from '../services/todo.service';
import { filter } from '../helpers/factoryHandler';

const Todo = mongoose.model('Todo');

export const createOne = async (req, res, next) => {
    try {
        const _errors = validationResult(req);
        const _request = req.body;
        const _user = req.user;

        if (!_errors.isEmpty()) {
            return next(_errors);
        } else {
            const todoData = {
                'userId': _user['userId'],
                'title': _request['title'],
            }
            const docTodo = await todoService.createTodo(todoData, next);
            return res.send({
                success: true,
                title: 'Todo Added successfully!',
                message: 'Todo has been added successfully.',
                data: {
                    todo: docTodo
                }
            });
        }
    } catch (error) {
        return next(error);
    }
};

export const getAllTodo = async (req, res, next) => {
    try {
        const _user = req.user;
        const [totalCount, result] = await filter(Todo.find({ 'userId': _user['userId'] }).populate('title'), req.query);
        return res.json({
            success: true,
            title: 'Todo sent !',
            message: 'Todo sent successfully!',
            count: totalCount,
            data: {
                result
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllTodoList = async (req, res, next) => {
    try {
        const [totalCount, result] = await filter(Todo.find({}).populate('title'), req.query);
        return res.json({
            success: true,
            title: 'Todo sent !',
            message: 'Todo sent successfully!',
            count: totalCount,
            data: {
                result
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getOneTodo = async (req, res, next) => {
    try {
        const docTodo = await todoService.getOneTodo(req.params.id, next);
        return res.send({
            success: true,
            title: 'Todo Added successfully!',
            message: 'Todo has been successfully.',
            data: {
                todo: docTodo
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const updateTodo = async (req, res, next) => {
    try {
        const docTodo = await todoService.updateTodo(req.params.id, req.body, next);
        return res.send({
            success: true,
            title: 'Todo Updated successfully!',
            message: 'Todo has been updated successfully.',
            data: {
                todo: docTodo
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteTodo = async (req, res, next) => {
    try {
        const docTodo = await todoService.deleteTodo(req.params.id, next);
        return res.send({
            success: true,
            title: 'Todo Deleted successfully!',
            message: 'Todo has been deleted successfully.',
            data: {
                docTodo
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const completeTodo = async (req, res, next) => {
    try {
        const docTodo = await todoService.getOneTodo(req.params.id, next);
        if (docTodo) {
            const _request = {
                "completed": true,
                "updatedAt ": docTodo
            }
            const result = await todoService.getCompleteTodo(req.params.id, _request, next);
            console.log(result);
            return res.send({
                success: true,
                title: 'Todo complate updated successfully!',
                message: 'Todo has been complate updated successfully.',
                data: {
                    result
                }
            });
        }
    } catch (error) {
        return next(error);
    }
};