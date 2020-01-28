import { Figure } from '../models/Figure';

export interface FigureSender {
  handleRequestBody: (json: any) => Promise<void>;
  send: (figures: Figure[]) => Promise<void>;
}
