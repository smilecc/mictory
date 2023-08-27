import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameWhereInput } from './user-nickname-where.input';
import { Type } from 'class-transformer';

@ArgsType()
export class DeleteManyUserNicknameArgs {

    @Field(() => UserNicknameWhereInput, {nullable:true})
    @Type(() => UserNicknameWhereInput)
    where?: UserNicknameWhereInput;
}
