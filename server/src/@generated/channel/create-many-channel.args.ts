import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelCreateManyInput } from './channel-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyChannelArgs {

    @Field(() => [ChannelCreateManyInput], {nullable:false})
    @Type(() => ChannelCreateManyInput)
    data!: Array<ChannelCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
