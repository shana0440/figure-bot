import { Figure } from '../models/Figure';

export interface FigureCrawler {
  fetchFigures: () => Promise<Figure[]>;
}
