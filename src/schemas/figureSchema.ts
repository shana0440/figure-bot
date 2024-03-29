import * as yup from 'yup';
import { Figure } from '../models/Figure';

export const figureSchema: yup.SchemaOf<Figure> = yup.object().shape({
  name: yup.string().required(),
  price: yup.string().required(),
  cover: yup.string().required(),
  publishAt: yup.string().required(),
  url: yup.string().required(),
});
