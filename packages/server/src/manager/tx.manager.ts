import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { PrismaTx } from '../types';

const RPSIMA_TX = '__PrismaTx';

type RunAction<T> = (tx: PrismaTx) => Promise<T>;

@Injectable()
export class TxManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly cls: ClsService,
  ) {}

  async runWithCls<T = any>(runAction: RunAction<T>): Promise<T> {
    return this.cls.run(() => this.run(runAction));
  }

  async run<T = any>(runAction: RunAction<T>): Promise<T> {
    const parentTx = this.cls.get(RPSIMA_TX);
    if (parentTx) {
      return await runAction(parentTx);
    }

    return this.prisma
      .$transaction(async (tx) => {
        this.cls.set(RPSIMA_TX, tx);
        return await runAction(tx);
      })
      .finally(() => {
        this.cls.set(RPSIMA_TX, undefined);
      });
  }
}
