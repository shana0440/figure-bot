import { IFigure } from "../models/figure";
import * as _ from "lodash";

const validate = (figure: IFigure): boolean => {
  if (figure.id === "") {
    return false;
  }

  if (figure.name === "") {
    return false;
  }

  if (figure.company === "") {
    return false;
  }

  if (!/\d/.test(figure.price)) {
    return false;
  }

  if (!_.startsWith(figure.image, "https://")) {
    return false;
  }

  if (isNaN(figure.releaseDate.getTime())) {
    return false;
  }

  return true;
};

export const validateFigure = (
  figures: IFigure[]
): { validated: IFigure[]; invalidated: IFigure[] } => {
  const validated = figures.filter(figure => validate(figure));
  const invalidated = figures.filter(figure => !validate(figure));
  return { validated, invalidated };
};
