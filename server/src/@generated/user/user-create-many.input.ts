import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { UserSessionState } from '../prisma/user-session-state.enum';

@InputType()
export class UserCreateManyInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:false})
    username!: string;

    @Field(() => String, {nullable:false})
    nickname!: string;

    @Field(() => Int, {nullable:false})
    nicknameNo!: number;

    @Field(() => UserSessionState, {nullable:true})
    sessionState?: keyof typeof UserSessionState;

    @Field(() => String, {nullable:false})
    password!: string;

    @Field(() => String, {nullable:false})
    passwordSalt!: string;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;
}
