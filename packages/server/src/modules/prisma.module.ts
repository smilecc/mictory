import { Global, Logger, Module } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';
import { ClsService } from 'nestjs-cls';
import { TxManager } from 'src/manager/tx.manager';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      inject: [ClsService],
      useFactory() {
        const client = new PrismaClient({
          log: [
            {
              emit: 'event',
              level: 'query',
            },
          ],
        });

        client.$on('query', async (e) => {
          Logger.debug(`${e.query} params: ${e.params} duration: ${e.duration}ms`, 'PrismaClient');
        });

        // 查询所有包含deletedTime字段的字段作为中间件启动参数
        const deletedMiddlewareModels: Record<string, boolean> = Prisma.dmmf.datamodel.models
          .filter((it) => !!it.fields.find((field) => field.name === 'deletedTime'))
          .reduce((pre, model) => {
            pre[model.name] = true;
            return pre;
          }, {});

        client.$use(
          createSoftDeleteMiddleware({
            models: deletedMiddlewareModels,
            defaultConfig: {
              field: 'deletedTime',
              allowToOneUpdates: true,
              createValue: (deleted) => {
                if (deleted) return new Date();
                return null;
              },
            },
          }),
        );

        return client;
      },
    },
    TxManager,
  ],
  exports: [PrismaClient, TxManager],
})
export class PrismaModule {}
