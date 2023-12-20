import { Global, Logger, Module } from '@nestjs/common';
import { AopModule } from '@toss/nestjs-aop';
import { CallLogDecorator } from '../aspects';

@Global()
@Module({
  imports: [AopModule, CallLogDecorator],
  providers: [Logger, CallLogDecorator],
  exports: [Logger, CallLogDecorator],
})
export class LoggerModule {}
