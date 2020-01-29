import * as Lowdb from 'lowdb';
import * as Memory from 'lowdb/adapters/Memory';

import { FigureRepository } from '../../repositories/FigureRepository';
import { Figure } from '../../models/Figure';

export class MockFigureRepoitory extends FigureRepository {
  constructor(data: Figure[] = []) {
    const memory = new Memory('db.json');
    const db = Lowdb(memory);
    db.defaults({
      figures: data,
    }).write();
    super(db);
  }
}
