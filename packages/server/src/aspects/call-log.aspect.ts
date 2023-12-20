import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop';
import { ClsService } from 'nestjs-cls';

export const CALL_LOG_DECORATOR = Symbol('CALL_LOG_DECORATOR');

export type CallLogOptionsFunc = (...args: any) => any;
export type CallLogOptionsCallContent<T extends CallLogOptionsFunc> = string | ((...args: Parameters<T>) => string);
export type CallLogOptionsResultContent<T extends CallLogOptionsFunc> =
  | string
  | ((result: Awaited<ReturnType<T>>) => string);

export type CallLogOptionsAdminContent<T extends CallLogOptionsFunc> =
  | string
  | ((result: Awaited<ReturnType<T>>, ...args: Parameters<T>) => string);

export interface CallLogOptions<T extends CallLogOptionsFunc> {
  call?: CallLogOptionsCallContent<T>;
  result?: CallLogOptionsResultContent<T>;
  module?: string;
  withArgs?: number[];
}

@Aspect(CALL_LOG_DECORATOR)
export class CallLogDecorator implements LazyDecorator<any, CallLogOptions<CallLogOptionsFunc>> {
  private logger = new Logger(CallLogDecorator.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly cls: ClsService,
  ) {}

  wrap({ method, methodName, metadata: options }: WrapParams<any, CallLogOptions<CallLogOptionsFunc>>) {
    return (...args: any[]) => {
      const { result: resultFunc, withArgs = [], module } = options;
      const result = method(...args);

      const message = typeof options.call === 'function' ? options.call(...args) : options.call;
      const logArgs = withArgs && withArgs.length ? withArgs.map((idx) => args[idx]) : undefined;

      this.logger.log(
        {
          log: ['call-log', 'call'],
          method: methodName,
          message,
          module,
          args: logArgs,
        },
        CallLogDecorator.name,
      );

      if (result instanceof Promise && resultFunc) {
        result.then(async (r) => {
          if (resultFunc) {
            this.logger.log(
              {
                log: ['call-log', 'result'],
                method: methodName,
                module,
                message: typeof resultFunc === 'function' ? resultFunc?.(r) : resultFunc,
              },
              CallLogDecorator.name,
            );
          }
        });
      }

      return result;
    };
  }
}

export const CallLog = <T extends CallLogOptionsFunc = (...args: any) => any>(
  module: string,
  call: CallLogOptionsCallContent<T>,
  result?: CallLogOptionsResultContent<T> | CallLogOptions<T>,
  options?: CallLogOptions<T>,
) =>
  createDecorator(CALL_LOG_DECORATOR, {
    call,
    ...(typeof result === 'object'
      ? {
          ...result,
        }
      : {
          result,
        }),
    ...options,
    module,
  });

export const createModuleCallLog =
  (module: string) =>
  <T extends CallLogOptionsFunc = (...args: any) => any>(
    call: CallLogOptionsCallContent<T>,
    result?: CallLogOptionsResultContent<T> | CallLogOptions<T>,
    options?: CallLogOptions<T>,
  ) =>
    CallLog(module, call, result, options);
