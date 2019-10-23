import request from 'supertest';
import app from '../../server';
import baseUrl from '../utils/constants';
import { adminUser2, mockUser2 } from '../mocks/mockUsers';
import { validRecipe, updatedRecipe } from '../mocks/mockRecipe';
import { validCategory, updateCategory } from '../mocks/mockRecipeCategory';
import User from '../../models/user.model';
import RecipeCategory from '../../models/recipeCategory.model';
import Recipe from '../../models/recipe.model';
import mongoose from 'mongoose';
import client from '../../db/redis';

const db = 'mongodb://127.0.0.1/mock-eatries-test';

let admin;
let user;
let categoryId;
let recipeId;

describe('TEST SUITE FOR RECIPE AND RECIPE CATEGORY', () => {
  beforeAll(async done => {
    jest.setTimeout(10000);
    await mongoose.connect(
      db,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    );

    await User.deleteMany({});

    admin = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(adminUser2);

    await User.findOneAndUpdate({ email: adminUser2.email }, { admin: true });

    user = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(mockUser2);
    done();
  });

  afterAll(async done => {
    await RecipeCategory.deleteMany({});
    await Recipe.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
    client.unref();
    done();
  });

  it('An admin should successfully create a recipe category', async done => {
    const res = await request(app)
      .post(`${baseUrl}/category`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(validCategory);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe category created');
    expect(res.body.data.category).toEqual(validCategory.category);
    expect(res.body.data.description).toEqual(validCategory.description);
    categoryId = res.body.data._id;
    done();
  });

  it('A user should not be able to successfully create a recipe category', async done => {
    const res = await request(app)
      .post(`${baseUrl}/category`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validCategory);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
    done();
  });

  it('An admin should be able to successfully update a recipe category', async done => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(updateCategory);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe category has been updated');
    expect(res.body.data.category).toEqual(updateCategory.category);
    expect(res.body.data.description).toEqual(updateCategory.description);
    done();
  });

  it('A user should not be able to successfully update a recipe category', async done => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(updateCategory);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
    done();
  });

  it('An admin should be able to successfully retrieve a recipe category', async () => {
    const res = await request(app)
      .get(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe Category');
    expect(res.body.data.category).toEqual(updateCategory.category);
    expect(res.body.data.description).toEqual(updateCategory.description);
  });

  it('A user should be able to successfully retrieve a recipe category', async done => {
    const res = await request(app)
      .get(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe Category');
    expect(res.body.data.category).toEqual(updateCategory.category);
    expect(res.body.data.description).toEqual(updateCategory.description);
    done();
  });

  it('An admin should be able to successfully create a recipe', async done => {
    const res = await request(app)
      .post(`${baseUrl}/category/${categoryId}/recipe`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(validRecipe);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe created');
    expect(res.body.data.ingredients).toEqual(validRecipe.ingredients);
    expect(res.body.data.name).toEqual(validRecipe.name);
    recipeId = res.body.data._id;
    done();
  });

  it('A user should not be able to successfully create a recipe', async done => {
    const res = await request(app)
      .post(`${baseUrl}/category/${categoryId}/recipe`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validRecipe);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
    done();
  });

  it('An admin should be able to successfully update a recipe', async done => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}/recipe/${recipeId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(updatedRecipe);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe has been updated');
    expect(res.body.data.ingredients).toEqual(updatedRecipe.ingredients);
    expect(res.body.data.name).toEqual(updatedRecipe.name);
    done();
  });

  it('A user should not be able to successfully update a recipe', async done => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}/recipe/${recipeId}`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validRecipe);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
    done();
  });

  it('A user should not be able to successfully delete a recipe category', async done => {
    const res = await request(app)
      .delete(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
    done();
  });

  it('An admin should be able to successfully delete a recipe category', async done => {
    const res = await request(app)
      .delete(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe category has been deleted');
    expect(res.body.data).toEqual(null);
    done();
  });
});
