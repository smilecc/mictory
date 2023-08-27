import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserSessionState } from './user-session-state.enum';
import { NestedEnumUserSessionStateFilter } from './nested-enum-user-session-state-filter.input';

@InputType()
export class EnumUserSessionStateFilter {

    @Field(() => UserSessionState, {nullable:true})
    equals?: keyof typeof UserSessionState;

    @Field(() => [UserSessionState], {nullable:true})
    in?: Array<keyof typeof UserSessionState>;

    @Field(() => [UserSessionState], {nullable:true})
    notIn?: Array<keyof typeof UserSessionState>;

    @Field(() => NestedEnumUserSessionStateFilter, {nullable:true})
    not?: NestedEnumUserSessionStateFilter;
}
