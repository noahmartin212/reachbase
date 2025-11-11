import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

/**
 * Middleware to validate request data using Joi schemas
 */
export const validate = (schema: {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      abortEarly: false, // Return all errors
      allowUnknown: true, // Allow unknown keys that will be ignored
      stripUnknown: true, // Remove unknown keys from validated data
    };

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, validationOptions);
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new ValidationError(errorMessage));
      }
      req.body = value;
    }

    // Validate query
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, validationOptions);
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new ValidationError(errorMessage));
      }
      req.query = value;
    }

    // Validate params
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, validationOptions);
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new ValidationError(errorMessage));
      }
      req.params = value;
    }

    next();
  };
};
