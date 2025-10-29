import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users and Posts E2E (CRUD)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(['log', 'debug', 'error', 'warn']);

    await app.init();
    console.log('\n starting E2E Tests \n');
  });

  const logRequest = (title: string, body: any) => {
    console.log(`\n ${title} request:`);
    console.log(JSON.stringify(body, null, 2));
  };

  const logResponse = (res: any) => {
    console.log(`response:`);
    console.log(JSON.stringify(res.body, null, 2));
  };

  // --- USERS CRUD ---
  // post register
  it('register a new user', async () => {
    const body = {
      firstName: 'E2E',
      lastName: 'Tester',
      email: 'e2e@email.com',
      password: '1234ABCD',
    };

    const res = await request(app.getHttpServer())
      .post('/users')
      .send(body)
      .expect(201);

    logResponse(res);

    expect(res.body.data.email).toBe('e2e@email.com');
    userId = res.body.data.id;
  });

  // post login
  it('login and receive JWT token', async () => {
    const body = { email: 'e2e@email.com', password: '1234ABCD' };
    logRequest('login', body);

    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(body)
      .expect(201);

    logResponse(res);
    token = res.body.access_token;
    expect(token).toBeDefined();
  });

  // get all users
  it('get all users', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(200);
    logResponse(res);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // get user by id
  it('get one user by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);
    logResponse(res);
    expect(res.body.data.id).toBe(userId);
  });

  // put user data
  it('update user data', async () => {
    const body = {
      firstName: 'E2E',
      lastName: 'Update',
      email: 'e2e@email.com',
      password: '1234ABCD',
    };
    logRequest('update user', body);

    const res = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(body)
      .expect(200);

    logResponse(res);
    expect(res.body.data.firstName).toBe('E2E');
  });

  // --- POSTS CRUD ---
  // post posts data
  it('create a post', async () => {
    const body = {
      title: 'E2E Test Post',
      content: 'This post was created during testing',
    };
    logRequest('create post', body);

    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(201);

    logResponse(res);
    postId = res.body.data.id;
    expect(res.body.data.title).toBe('E2E Test Post');
  });

  // get all posts data
  it('get all posts', async () => {
    const res = await request(app.getHttpServer()).get('/posts').expect(200);
    logResponse(res);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // post posts data by id
  it('get one post by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .expect(200);
    logResponse(res);
    expect(res.body.data.id).toBe(postId);
  });

  // update posts data
  it('update a post', async () => {
    const body = {
      title: 'Updated E2E Post',
      content: 'Post content updated successfully',
    };
    logRequest('Update Post', body);

    const res = await request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);

    logResponse(res);
    expect(res.body.data.title).toBe('Updated E2E Post');
  });

  // delete post
  it('delete a post', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    console.log(`deleted post with id: ${postId}`);
  });

  // delete user
  it('delete a user', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(204);

    console.log(`deleted user with id: ${userId}`);
  });

  afterAll(async () => {
    console.log('\n all E2E tests done\n');
    await app.close();
  });
});
