import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { UserSessionState } from '../prisma/user-session-state.enum';

@ObjectType()
export class UserMaxAggregate {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:true})
    username?: string;

    @Field(() => String, {nullable:true})
    nickname?: string;

    @Field(() => Int, {nullable:true})
    nicknameNo?: number;

    @Field(() => UserSessionState, {nullable:true})
    sessionState?: keyof typeof UserSessionState;

    @Field(() => String, {nullable:true})
    password?: string;

    @Field(() => String, {nullable:true})
    passwordSalt?: string;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;
}
