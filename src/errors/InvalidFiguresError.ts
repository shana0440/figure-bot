import { Figure } from '../models/Figure';

export class InvalidFiguresError extends Error {
  constructor(figures: Figure[]) {
    const json = JSON.stringify(figures, null, 2);
    super(json);
  }
}
