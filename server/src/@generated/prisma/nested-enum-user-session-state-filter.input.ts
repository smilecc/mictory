import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserSessionState } from './user-session-state.enum';

@InputType()
export class NestedEnumUserSessionStateFilter {

    @Field(() => UserSessionState, {nullable:true})
    equals?: keyof typeof UserSessionState;

    @Field(() => [UserSessionState], {nullable:true})
    in?: Array<keyof typeof UserSessionState>;

    @Field(() => [UserSessionState], {nullable:true})
    notIn?: Array<keyof typeof UserSessionState>;

    @Field(() => NestedEnumUserSessionStateFilter, {nullable:true})
    not?: NestedEnumUserSessionStateFilter;
}
