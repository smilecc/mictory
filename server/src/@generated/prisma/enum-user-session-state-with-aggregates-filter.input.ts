import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserSessionState } from './user-session-state.enum';
import { NestedEnumUserSessionStateWithAggregatesFilter } from './nested-enum-user-session-state-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumUserSessionStateFilter } from './nested-enum-user-session-state-filter.input';

@InputType()
export class EnumUserSessionStateWithAggregatesFilter {

    @Field(() => UserSessionState, {nullable:true})
    equals?: keyof typeof UserSessionState;

    @Field(() => [UserSessionState], {nullable:true})
    in?: Array<keyof typeof UserSessionState>;

    @Field(() => [UserSessionState], {nullable:true})
    notIn?: Array<keyof typeof UserSessionState>;

    @Field(() => NestedEnumUserSessionStateWithAggregatesFilter, {nullable:true})
    not?: NestedEnumUserSessionStateWithAggregatesFilter;

    @Field(() => NestedIntFilter, {nullable:true})
    _count?: NestedIntFilter;

    @Field(() => NestedEnumUserSessionStateFilter, {nullable:true})
    _min?: NestedEnumUserSessionStateFilter;

    @Field(() => NestedEnumUserSessionStateFilter, {nullable:true})
    _max?: NestedEnumUserSessionStateFilter;
}
