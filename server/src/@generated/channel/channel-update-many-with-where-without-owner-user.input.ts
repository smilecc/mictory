import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelScalarWhereInput } from './channel-scalar-where.input';
import { Type } from 'class-transformer';
import { ChannelUpdateManyMutationInput } from './channel-update-many-mutation.input';

@InputType()
export class ChannelUpdateManyWithWhereWithoutOwnerUserInput {

    @Field(() => ChannelScalarWhereInput, {nullable:false})
    @Type(() => ChannelScalarWhereInput)
    where!: ChannelScalarWhereInput;

    @Field(() => ChannelUpdateManyMutationInput, {nullable:false})
    @Type(() => ChannelUpdateManyMutationInput)
    data!: ChannelUpdateManyMutationInput;
}
