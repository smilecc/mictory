import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameCreateInput } from './user-nickname-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOneUserNicknameArgs {

    @Field(() => UserNicknameCreateInput, {nullable:false})
    @Type(() => UserNicknameCreateInput)
    data!: UserNicknameCreateInput;
}
