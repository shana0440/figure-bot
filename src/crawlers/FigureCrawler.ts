import { Figure } from '../models/Figure';

export interface FigureCrawler {
  name: string;
  fetchFigures: () => Promise<Figure[]>;
}
