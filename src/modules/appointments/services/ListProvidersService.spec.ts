// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let ListProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    ListProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jd@teste.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'jt@teste.com',
      password: '123456',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'jq@teste.com',
      password: '123456',
    });

    const providers = await ListProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
