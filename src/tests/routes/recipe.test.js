import request from 'supertest';
import app from '../../server';
import baseUrl from '../utils/constants';
import { adminUser2, mockUser2 } from '../mocks/mockUsers';
import { validRecipe, updatedRecipe } from '../mocks/mockRecipe';
import { validCategory, updateCategory } from '../mocks/mockRecipeCategory';
import User from '../../models/user.model';
import RecipeCategory from '../../models/recipeCategory.model';
import Recipe from '../../models/recipe.model';

let admin;
let user;
let categoryId;
let recipeId;

beforeAll(async () => {
  jest.setTimeout(10000);
  admin = await request(app)
    .post(`${baseUrl}/auth/signup`)
    .send(adminUser2);

  await User.findOneAndUpdate({ email: adminUser2.email }, { admin: true });

  user = await request(app)
    .post(`${baseUrl}/auth/signup`)
    .send(mockUser2);
});

afterAll(async () => {
  await RecipeCategory.deleteMany({});
  await Recipe.deleteMany({});
  await User.deleteMany({});
});

describe('TEST SUITE FOR RECIPE AND RECIPE CATEGORY', () => {
  it('An admin should successfully create a recipe category', async () => {
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
  });

  it('A user should not be able to successfully create a recipe category', async () => {
    const res = await request(app)
      .post(`${baseUrl}/category`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validCategory);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
  });

  it('An admin should be able to successfully update a recipe category', async () => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(updateCategory);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe category has been updated');
    expect(res.body.data.category).toEqual(updateCategory.category);
    expect(res.body.data.description).toEqual(updateCategory.description);
  });

  it('A user should not be able to successfully update a recipe category', async () => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(updateCategory);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
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

  it('A user should be able to successfully retrieve a recipe category', async () => {
    const res = await request(app)
      .get(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe Category');
    expect(res.body.data.category).toEqual(updateCategory.category);
    expect(res.body.data.description).toEqual(updateCategory.description);
  });

  it('An admin should be able to successfully create a recipe', async () => {
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
  });

  it('A user should not be able to successfully create a recipe', async () => {
    const res = await request(app)
      .post(`${baseUrl}/category/${categoryId}/recipe`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validRecipe);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
  });

  it('An admin should be able to successfully update a recipe', async () => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}/recipe/${recipeId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`)
      .send(updatedRecipe);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe has been updated');
    expect(res.body.data.ingredients).toEqual(updatedRecipe.ingredients);
    expect(res.body.data.name).toEqual(updatedRecipe.name);
  });

  it('A user should not be able to successfully update a recipe', async () => {
    const res = await request(app)
      .patch(`${baseUrl}/category/${categoryId}/recipe/${recipeId}`)
      .set('authorization', `Bearer ${user.body.data.token}`)
      .send(validRecipe);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
  });

  it('A user should not be able to successfully delete a recipe category', async () => {
    const res = await request(app)
      .delete(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${user.body.data.token}`);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'You are not authorized to make this action',
    );
  });

  it('An admin should be able to successfully delete a recipe category', async () => {
    const res = await request(app)
      .delete(`${baseUrl}/category/${categoryId}`)
      .set('authorization', `Bearer ${admin.body.data.token}`);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('Recipe category has been deleted');
    expect(res.body.data).toEqual(null);
  });
});
