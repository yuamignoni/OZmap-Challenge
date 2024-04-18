import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} ${res.statusMessage} - ${duration}ms`
    );
  });

  next();
};

export default loggerMiddleware;
