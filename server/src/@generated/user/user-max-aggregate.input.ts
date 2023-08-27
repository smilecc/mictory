import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UserMaxAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    username?: true;

    @Field(() => Boolean, {nullable:true})
    nickname?: true;

    @Field(() => Boolean, {nullable:true})
    nicknameNo?: true;

    @Field(() => Boolean, {nullable:true})
    sessionState?: true;

    @Field(() => Boolean, {nullable:true})
    password?: true;

    @Field(() => Boolean, {nullable:true})
    passwordSalt?: true;

    @Field(() => Boolean, {nullable:true})
    createdTime?: true;

    @Field(() => Boolean, {nullable:true})
    updatedTime?: true;

    @Field(() => Boolean, {nullable:true})
    deletedTime?: true;
}
