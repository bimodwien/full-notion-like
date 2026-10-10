import { Request } from 'express';
import { Role } from '../generated/prisma/enums';

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
  member?: { role: Role };
}
