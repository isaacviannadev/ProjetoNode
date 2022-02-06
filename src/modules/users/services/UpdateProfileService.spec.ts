import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@teste.com',
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('johntre@teste.com');
  });

  it('should not be able to update the email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'jd@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@teste.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be able to update the password whithout old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@teste.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password whith a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@teste.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
