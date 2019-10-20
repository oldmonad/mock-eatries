import User from '../models/user.model';

const seedUsers = async () => {
  await User.deleteMany({});
  const user1 = new User({
    _id: '5dabf693872fcf3a7be60b4c',
    name: 'Admin',
    email: 'admin@admin.com',
    password: '$2a$10$.sX5jvdHN0fZx3oUN1U7JO.GSAauCtnouSfRwhcTg7MDrzz5m9L1S',
  });

  const user2 = new User({
    _id: '5dabf693872fcf3a7be60b4d',
    name: 'Test User',
    email: 'testuser@admin.com',
    password: '$2a$10$3J3qedoAsq0SpP789kvD2eTtDw.8wf2CkDj4wSg8fQJ8chpKw5E12',
  });

  await user1.save();
  await User.findOneAndUpdate({ email: 'admin@admin.com' }, { admin: true });
  await user2.save();
};

export default seedUsers;
