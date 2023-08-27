import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UserNicknameCountAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    nickname?: true;

    @Field(() => Boolean, {nullable:true})
    no?: true;

    @Field(() => Boolean, {nullable:true})
    createdTime?: true;

    @Field(() => Boolean, {nullable:true})
    updatedTime?: true;

    @Field(() => Boolean, {nullable:true})
    deletedTime?: true;

    @Field(() => Boolean, {nullable:true})
    _all?: true;
}
