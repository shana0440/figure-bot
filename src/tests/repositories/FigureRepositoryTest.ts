import 'mocha';
import { expect } from 'chai';
import * as Lowdb from 'lowdb';
import * as Memory from 'lowdb/adapters/Memory';

import { Figure } from '../../models/Figure';
import { FigureRepository } from '../../repositories/FigureRepository';

const figures: Figure[] = [
  {
    name: 'figure_1',
    cover: 'figure_cover_1',
    price: 'figure_price_1',
    publishAt: 'figure_publish_at_1',
    url: 'figure_url_1',
  },
  {
    name: 'figure_2',
    cover: 'figure_cover_2',
    price: 'figure_price_2',
    publishAt: 'figure_publish_at_2',
    url: 'figure_url_2',
  },
];

describe('FigureRepository', () => {
  it('saved', () => {
    const memory = new Memory('db.json');
    const db = Lowdb(memory);
    const repo = new FigureRepository(db);
    repo.save(figures);

    expect(
      db
        .read()
        .get('figures')
        .value()
    ).deep.equals(figures);
  });

  it('filter saved figures', () => {
    const memory = new Memory('db.json');
    const db = Lowdb(memory);
    const repo = new FigureRepository(db);
    repo.save([figures[0]]);
    const nonSavedFigures = repo.filterSavedFigures(figures);

    expect(nonSavedFigures).deep.equals([figures[1]]);
  });

  it('filter saved figure urls', () => {
    const memory = new Memory('db.json');
    const db = Lowdb(memory);
    const repo = new FigureRepository(db);
    repo.save([figures[0]]);
    const urls = figures.map((it) => it.url);
    const nonSavedFigureURLs = repo.filterSavedFigureURLs(urls);

    expect(nonSavedFigureURLs).deep.equals([figures[1].url]);
  });
});
