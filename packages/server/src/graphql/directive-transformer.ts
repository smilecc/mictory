import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { AuthenticationError } from '@nestjs/apollo';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

export function directiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          // throw new ForbiddenError('unauth');
          // console.log('context.req', context.req);
          if (!context.user) {
            throw new AuthenticationError('unauth');
          }

          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}
