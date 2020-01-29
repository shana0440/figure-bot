import * as Lowdb from 'lowdb';

import { Figure } from '../models/Figure';

export interface FigureSchema {
  figures: Figure[];
}

export class FigureRepository {
  private db: Lowdb.LowdbSync<FigureSchema>;
  constructor(db: Lowdb.LowdbSync<any>) {
    this.db = db;
    db.defaults({ figures: [] }).write();
  }

  filterSavedFigureURLs(urls: string[]): string[] {
    const urlSet = urls.reduce<Set<string>>((acc, it) => {
      acc.add(it);
      return acc;
    }, new Set());

    const savedFigures = this.db
      .read()
      .get('figures')
      .filter((it) => urlSet.has(it.url))
      .value();

    savedFigures.forEach((figure) => {
      urlSet.delete(figure.url);
    });
    return Array.from(urlSet);
  }

  filterSavedFigures(figures: Figure[]): Figure[] {
    const urlFigureMap = figures.reduce<{ [key: string]: Figure }>(
      (acc, it) => ({
        ...acc,
        [it.url]: it,
      }),
      {}
    );

    const savedFigures = this.db
      .read()
      .get('figures')
      .filter((it) => it.url in urlFigureMap)
      .value();

    savedFigures.forEach((figure) => {
      delete urlFigureMap[figure.url];
    });
    return Object.values(urlFigureMap);
  }

  save(figures: Figure[]): void {
    this.db
      .read()
      .get('figures')
      .push(...figures)
      .write();
  }
}
