import { UserDocument } from './user.model';
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
