import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { UserNicknameCreateManyInput } from './user-nickname-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyUserNicknameArgs {

    @Field(() => [UserNicknameCreateManyInput], {nullable:false})
    @Type(() => UserNicknameCreateManyInput)
    data!: Array<UserNicknameCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
