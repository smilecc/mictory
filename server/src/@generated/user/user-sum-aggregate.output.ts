import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class UserSumAggregate {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => Int, {nullable:true})
    nicknameNo?: number;
}
