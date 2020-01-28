import * as Lowdb from 'lowdb';

import { User } from '../models/User';

export interface UserSchema {
  users: User[];
}

export class UserRepository {
  private db: Lowdb.LowdbSync<UserSchema>;
  constructor(db: Lowdb.LowdbSync<UserSchema>) {
    this.db = db;
    db.defaults({ users: [] }).write();
  }

  save(user: User) {
    this.db
      .read()
      .get('users')
      .push(user)
      .write();
  }

  delete(user: User) {
    this.db
      .read()
      .get('users')
      .remove(user)
      .write();
  }

  list(type: string): User[] {
    return this.db
      .read()
      .get('users')
      .filter((it) => it.type == type)
      .value();
  }
}
