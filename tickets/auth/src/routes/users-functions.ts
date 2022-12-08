import express, { Application, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import { nextTick } from 'process';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ data: 'please provide email and password' });
  res
    .status(200)
    .json({ data: { email, password }, msg: 'Email Password Success!' });
}
export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ data: 'please provide email and password' });
  res
    .status(200)
    .json({ data: { email, password }, msg: 'Email Password Success!' });
}
export async function signOut(req: Request, res: Response, next: NextFunction) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  res.status(200).json({ data: {}, msg: 'Sign out successful!' });
}
export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const { email, password } = req.body;
  // if (!email || !password)
  //   return res.status(400).json({ data: 'please provide email and password' });
  res.status(200).json({ data: { user: {} }, msg: 'Current User' });
}
