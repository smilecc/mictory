import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameUpdateManyMutationInput } from './user-nickname-update-many-mutation.input';
import { Type } from 'class-transformer';
import { UserNicknameWhereInput } from './user-nickname-where.input';

@ArgsType()
export class UpdateManyUserNicknameArgs {

    @Field(() => UserNicknameUpdateManyMutationInput, {nullable:false})
    @Type(() => UserNicknameUpdateManyMutationInput)
    data!: UserNicknameUpdateManyMutationInput;

    @Field(() => UserNicknameWhereInput, {nullable:true})
    @Type(() => UserNicknameWhereInput)
    where?: UserNicknameWhereInput;
}
