import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { UserNicknameCountAggregate } from './user-nickname-count-aggregate.output';
import { UserNicknameAvgAggregate } from './user-nickname-avg-aggregate.output';
import { UserNicknameSumAggregate } from './user-nickname-sum-aggregate.output';
import { UserNicknameMinAggregate } from './user-nickname-min-aggregate.output';
import { UserNicknameMaxAggregate } from './user-nickname-max-aggregate.output';

@ObjectType()
export class AggregateUserNickname {

    @Field(() => UserNicknameCountAggregate, {nullable:true})
    _count?: UserNicknameCountAggregate;

    @Field(() => UserNicknameAvgAggregate, {nullable:true})
    _avg?: UserNicknameAvgAggregate;

    @Field(() => UserNicknameSumAggregate, {nullable:true})
    _sum?: UserNicknameSumAggregate;

    @Field(() => UserNicknameMinAggregate, {nullable:true})
    _min?: UserNicknameMinAggregate;

    @Field(() => UserNicknameMaxAggregate, {nullable:true})
    _max?: UserNicknameMaxAggregate;
}
