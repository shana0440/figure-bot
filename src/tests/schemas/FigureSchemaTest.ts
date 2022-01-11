import { ValidationError } from 'yup';

import { figureSchema } from '../../schemas/figureSchema';

describe('figureSchema', function () {
  it('not allow empty string', function () {
    expect(() => {
      figureSchema.validateSync({
        name: '',
        price: '',
        cover: '',
        publishAt: '',
        url: '',
      });
    }).toThrow(ValidationError);
  });
});
