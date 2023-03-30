import express from 'express';
const router = express.Router();

//import Controllers
import * as authController from "../controllers/auth.controller"
import * as todoController from "../controllers/todo.controller"
import * as postController from "../controllers/post.controller"
import * as commentsController from "../controllers/comments.controller"

// importing validators
import * as authValidator from '../validators/auth.validator';
import * as todoValidator from '../validators/todo.validator';
import * as postValidator from '../validators/post.validator';

// importing middleware
import * as authMiddleware from '../middlewares/middleware';

// Auth
router.post('/register',authValidator.register, authController.register);
router.post('/login', authMiddleware.accountLockoutPolicy(), authValidator.login, authController.login);
router.post('/auth/token', authValidator.refreshToken, authController.refreshToken);

// Todo
router.get('/todo/all', authMiddleware.authenticate, todoController.getAllTodoList);
router.post('/todo', authMiddleware.authenticate, todoValidator.todoCreate, todoController.createOne);
router.get('/todo', authMiddleware.authenticate,  todoController.getAllTodo);
router.get('/todo/:id', authMiddleware.authenticate,  todoController.getOneTodo);
router.put('/todo/:id', authMiddleware.authenticate,todoValidator.todoCreate,  todoController.updateTodo);
router.delete('/todo/:id', authMiddleware.authenticate,  todoController.deleteTodo);
router.patch('/todo/:id/complete', authMiddleware.authenticate,  todoController.completeTodo);

// Post
router.get('/post/all', authMiddleware.authenticate, postController.getAllPostList);
router.post('/post', authMiddleware.authenticate, postValidator.postCreate, postController.createOne);
router.get('/post', authMiddleware.authenticate,  postController.getAllPost);
router.get('/post/:id', authMiddleware.authenticate,  postController.getOnePost);
router.put('/post/:id', authMiddleware.authenticate,postValidator.postCreate,  postController.updatePost);
router.delete('/post/:id', authMiddleware.authenticate,  postController.deletePost);

// Comments
router.post('/posts/:id/comments', authMiddleware.authenticate, commentsController.createOne);
router.get('/comments/:id', authMiddleware.authenticate,  commentsController.getAllComments);


export const apisV1 = router;