import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ChannelUpdateManyMutationInput } from './channel-update-many-mutation.input';
import { Type } from 'class-transformer';
import { ChannelWhereInput } from './channel-where.input';

@ArgsType()
export class UpdateManyChannelArgs {

    @Field(() => ChannelUpdateManyMutationInput, {nullable:false})
    @Type(() => ChannelUpdateManyMutationInput)
    data!: ChannelUpdateManyMutationInput;

    @Field(() => ChannelWhereInput, {nullable:true})
    @Type(() => ChannelWhereInput)
    where?: ChannelWhereInput;
}
