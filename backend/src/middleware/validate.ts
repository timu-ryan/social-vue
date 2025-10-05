import { AnyZodObject, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const toValidate: any = { body: req.body, query: req.query, params: req.params };
      const parsed = schema.parse(toValidate);

      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map(i => ({
          path: i.path.join("."), // например "body.username"
          message: i.message,
        }));
        return res.status(400).json({ error: "Validation error", issues });
      }
      return next(err);
    }
  };
}
