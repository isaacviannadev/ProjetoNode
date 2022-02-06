import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to Authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'jd@teste.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to Authenticate with no existent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jd@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to Authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'jd@teste.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
