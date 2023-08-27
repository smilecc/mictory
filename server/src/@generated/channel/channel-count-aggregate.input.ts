import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ChannelCountAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    code?: true;

    @Field(() => Boolean, {nullable:true})
    name?: true;

    @Field(() => Boolean, {nullable:true})
    ownerUserId?: true;

    @Field(() => Boolean, {nullable:true})
    createdTime?: true;

    @Field(() => Boolean, {nullable:true})
    updatedTime?: true;

    @Field(() => Boolean, {nullable:true})
    deletedTime?: true;

    @Field(() => Boolean, {nullable:true})
    _all?: true;
}
