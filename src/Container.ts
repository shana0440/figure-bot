import { resolve } from 'path';

import * as Lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

import { Config } from './config/Config';
import { UserSchema, UserRepository } from './repositories/UserRepository';
import { FigureSchema, FigureRepository } from './repositories/FigureRepository';
import { LineFigureSender } from './senders/LineFigureSender';

type Schema = UserSchema & FigureSchema;

export class Container {
  config: Config;
  db: Lowdb.LowdbSync<Schema>;
  private userRepo?: UserRepository;
  private figureRepo?: FigureRepository;
  private lineSender?: LineFigureSender;

  constructor(config: Config) {
    this.config = config;
    const file = new FileSync(resolve(__dirname, '../db.json'));
    this.db = Lowdb(file);
  }

  get userRepository(): UserRepository {
    if (!this.userRepo) {
      this.userRepo = new UserRepository(this.db);
    }
    return this.userRepo;
  }

  get figureRepository(): FigureRepository {
    if (!this.figureRepo) {
      this.figureRepo = new FigureRepository(this.db);
    }
    return this.figureRepo;
  }

  get lineFigureSender(): LineFigureSender {
    if (!this.lineSender) {
      this.lineSender = new LineFigureSender(this.config, this.userRepository);
    }
    return this.lineSender;
  }
}
