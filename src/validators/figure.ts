import { IFigure } from "../models/figure";

export const validateFigure = (
  figures: IFigure[]
): { validated: IFigure[]; invalidated: IFigure[] } => {
  const validated = figures.filter(figure => figure.name !== "");
  const invalidated = figures.filter(figure => figure.name === "");
  return { validated, invalidated };
};
