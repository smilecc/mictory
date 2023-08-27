import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ChannelCreateManyOwnerUserInput } from './channel-create-many-owner-user.input';
import { Type } from 'class-transformer';

@InputType()
export class ChannelCreateManyOwnerUserInputEnvelope {

    @Field(() => [ChannelCreateManyOwnerUserInput], {nullable:false})
    @Type(() => ChannelCreateManyOwnerUserInput)
    data!: Array<ChannelCreateManyOwnerUserInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
