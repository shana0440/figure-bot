import * as Lowdb from 'lowdb';
import * as Memory from 'lowdb/adapters/Memory';

import { User } from '../../models/User';
import { UserSchema, UserRepository } from '../../repositories/UserRepository';

const users: User[] = [
  {
    type: 'line',
    id: 'line_1',
  },
  {
    type: 'fb',
    id: 'fb_1',
  },
];

describe('UserRepository', () => {
  it('save', () => {
    const memory = new Memory<UserSchema>('db.json');
    const db = Lowdb(memory);
    const repo = new UserRepository(db);
    repo.save(users[0]);

    expect(db.read().get('users').find(users[0]).value()).toStrictEqual(users[0]);
  });

  it('delete', () => {
    const memory = new Memory<UserSchema>('db.json');
    const db = Lowdb(memory);
    const repo = new UserRepository(db);
    repo.save(users[0]);
    repo.delete(users[0]);

    expect(db.read().get('users').find(users[0]).value()).toBeUndefined();
  });

  it('list', () => {
    const memory = new Memory<UserSchema>('db.json');
    const db = Lowdb(memory);
    const repo = new UserRepository(db);
    repo.save(users[0]);
    repo.save(users[1]);
    const lineUsers = repo.list('line');

    expect(lineUsers).toStrictEqual([users[0]]);
  });
});
