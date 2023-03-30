# nodejs-todo

<h2> Todo and Post Node Js and Express app in Typescript with Monogodb database</h2>

<ul>
<li>User can sign up and login using JWT token - /user , /login </li>
<li>User can create multiple Todos and manage them (Delete, Edit, Mark as Complete) - /todo, /todo/:id</li>
<li>User can create posts</li>
<li>Posts will accept only text -  /post/:id, /posts</li>
<li>Posts can have one or multiple comments</li>
<li>User can query other users and view their details</li>
<li>They can comment on other users’ posts</li>
<li>They can ONLY view other users’ todos</li>
<li>Mocha and Chai Test Cases.</li>
</ul>

<br>

<p> How to run the app locally: </p>

<ol>
<li> Run <code> npm install </code> to install all needed dependencies </li>

<li> Then start the server using <code> npm run dev-start </code> </li>

<li> Navigate to your browser <code> http://localhost:3007/ </code> to view the app </li>

<li> Test Cases <code> npm run test </code> </li>
</ol>

<h2>API list</h2>

<code>
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

</code>

