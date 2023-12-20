import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { appEnv } from '../utils';
import { Request } from 'express';
import { RequestUser, AuthModule, JwtUserClaims } from './auth.module';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { AuthenticationError } from '@nestjs/apollo';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { PrismaModule } from './prisma.module';
import { PrismaClient } from '@prisma/client';
import { ClsModule, ClsService } from 'nestjs-cls';
import { CLS_REQUEST_USER, CTX_USER } from 'src/consts';
import { JwtService } from '@nestjs/jwt';

function directiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const userDirective = getDirective(schema, fieldConfig, 'user')?.[0];
      const adminDirective = getDirective(schema, fieldConfig, 'admin')?.[0];

      if (userDirective || adminDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          const requestUser = context[CTX_USER] as RequestUser;
          if (!requestUser) {
            throw new AuthenticationError('请登录后再进行操作');
          }

          if (userDirective && !requestUser.isUser) {
            throw new AuthenticationError('请登录后再进行操作');
          }

          if (adminDirective && !requestUser.isAdmin) {
            throw new AuthenticationError('请登录后再进行操作');
          }

          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

@Module({
  providers: [],
})
export class GraphQlModule {
  static register(): DynamicModule {
    return NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [GraphQlModule, PrismaModule, ClsModule, AuthModule],
      inject: [PrismaClient, ClsService, JwtService],
      useFactory: (prisma: PrismaClient, cls: ClsService, jwtService: JwtService) => ({
        autoSchemaFile: true,
        installSubscriptionHandlers: true,
        transformSchema: directiveTransformer,
        context: async (ctx: { req?: Request }) => {
          try {
            if (appEnv() === 'dev' && ctx.req && ctx.req?.headers?.['x-debug']) {
              cls.set(CLS_REQUEST_USER, ctx.req?.headers?.['x-debug']);
              return {
                ...ctx,
                [CTX_USER]: new RequestUser(JSON.parse(ctx.req?.headers?.['x-debug'] as string), prisma),
              };
            }

            if (ctx.req && ctx.req?.headers?.authorization) {
              const claims: JwtUserClaims = await jwtService.verifyAsync(ctx.req.headers.authorization);
              cls.set(CLS_REQUEST_USER, `${claims.type}:${claims.userId}`);
              return { ...ctx, [CTX_USER]: new RequestUser(claims, prisma) };
            }
          } catch {}

          return { ctx, [CTX_USER]: new RequestUser(null, prisma) };
        },
        buildSchemaOptions: {
          directives: [
            new GraphQLDirective({
              name: 'user',
              locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.FIELD],
            }),
            new GraphQLDirective({
              name: 'admin',
              locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.FIELD],
            }),
          ],
        },
      }),
    });
  }
}
