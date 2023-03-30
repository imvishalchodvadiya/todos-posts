/* eslint-disable @typescript-eslint/no-var-requires */
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
chai.should();

const endPoint = 'http://localhost:3007/api/v1/';
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZjQ2YmY1MS0zMGFmLTQ3NDYtOTQ5Mi0xOGE3ODliOWQzZmEiLCJlbWFpbCI6ImFkbWluQHlvcG1haWwuY29tIiwicGhvbmUiOiI5NzI0MDM1NzczIiwicm9sZXMiOlsiYWRtaW4iXSwiY291bnRyeSI6IkluIiwiaWF0IjoxNjgwMTc3NDgxLCJleHAiOjE2ODAxNzgzODF9.b1Q2nNuybChrPjgJa4VeS8sBxIcMvnl12NfeuleD4mU';

describe('User Registration and Login', () => {

  // Test the user registration endpoint
  describe('POST /register', () => {
    it('should return a 200 status code and create a new user', (done) => {
      const randomEmail = (Math.random() + 1).toString(36).substring(7);
      const user = {
        "email" : `${randomEmail}@yopmail.com`,
        "firstName" : "Vishal",
        "lastName" : "Chodvadiya",
        "country" : "In",
        "password" : "123456",
        "confirmPassword" : "123456",
        "phone" : "9724035773",
        "role":"admin"
    };

      chai.request(endPoint)
        .post('register')
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          const userData = JSON.parse(res.text);
          token = userData.data.accessToken;
          chai.assert.equal(userData.message, 'User has been register successfully.');
          done();
        });
    });
  });

   // Test the user login endpoint
   describe('POST /login', () => {
    it('should return a 200 status code and create a new user', (done) => {
      const user = {
        "email" : 'admin1@yopmail.com',
        "password" : "123456",
    };

      chai.request(endPoint)
        .post('login')
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'You have successfully login.');
          done();
        });
    });
  });
});

// Todo APIs
describe('Todo APIs', () => {
  
  // Get All Todo
  describe('GET /todo/all', () => {    
    const tokenz = token;
    it('should return a todo 200 and get All todo', (done) => {
      chai.request(endPoint)
        .get('todo/all')
        .set({ Authorization: `Bearer ${tokenz}` })
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'Todo sent successfully!');
          done();
        });
    });
  });

  // Get Todo
  describe('GET /todo', () => {    
    const tokenz = token;
    it('should return a todo 200 and get todo', (done) => {
      chai.request(endPoint)
        .get('todo/all')
        .set({ Authorization: `Bearer ${tokenz}` })
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'Todo sent successfully!');
          done();
        });
    });
  });

  // Get Todo by Id
  describe('GET /todo/:id', () => {    
    const tokenz = token;
    it('should return a todo 200 and get todo by Id', (done) => {
      chai.request(endPoint)
        .get('todo/6423ff572f88ad6c345093b5')
        .set({ Authorization: `Bearer ${tokenz}` })
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'Todo has been successfully.');
          done();
        });
    });
  });

  // Create Todo 
  describe('POST /todo', () => {    
    const tokenz = token;
    it('should return a todo 200 and create a new todo', (done) => {

      const todoData = {
        "title": "Lorem Ipsum is simply dummy text of the printing and typesetting industry - admin123"
      };

      chai.request(endPoint)
        .post('todo')
        .set({ Authorization: `Bearer ${tokenz}` })
        .send(todoData)
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'Todo has been added successfully.');
          done();
        });
    });
  });

  // Change compelete flag
  describe('POST /todo/:id/complete', () => {    
    const tokenz = token;
    it('should return a todo 200 and change the status', (done) => {

      chai.request(endPoint)
        .patch('/todo/64257a670a4af943dbb50f12/complete')
        .set({ Authorization: `Bearer ${tokenz}` })
        .end((err, res) => {
          if (err) return done(err);
          chai.assert.equal(JSON.parse(res.text).message, 'Todo has been complate updated successfully.');
          done();
        });
    });
  });

});