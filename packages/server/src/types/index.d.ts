import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

export type PrismaTx = Omit<PrismaClient, ITXClientDenyList>;

export * from './mediasoup';
