import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserSessionState } from './user-session-state.enum';

@InputType()
export class EnumUserSessionStateFieldUpdateOperationsInput {

    @Field(() => UserSessionState, {nullable:true})
    set?: keyof typeof UserSessionState;
}
