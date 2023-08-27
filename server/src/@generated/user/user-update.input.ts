import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFieldUpdateOperationsInput } from '../prisma/big-int-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { IntFieldUpdateOperationsInput } from '../prisma/int-field-update-operations.input';
import { EnumUserSessionStateFieldUpdateOperationsInput } from '../prisma/enum-user-session-state-field-update-operations.input';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { NullableDateTimeFieldUpdateOperationsInput } from '../prisma/nullable-date-time-field-update-operations.input';
import { ChannelUpdateManyWithoutOwnerUserNestedInput } from '../channel/channel-update-many-without-owner-user-nested.input';
import { ChannelUpdateManyWithoutUsersNestedInput } from '../channel/channel-update-many-without-users-nested.input';

@InputType()
export class UserUpdateInput {

    @Field(() => BigIntFieldUpdateOperationsInput, {nullable:true})
    id?: BigIntFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    username?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    nickname?: StringFieldUpdateOperationsInput;

    @Field(() => IntFieldUpdateOperationsInput, {nullable:true})
    nicknameNo?: IntFieldUpdateOperationsInput;

    @Field(() => EnumUserSessionStateFieldUpdateOperationsInput, {nullable:true})
    sessionState?: EnumUserSessionStateFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    password?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    passwordSalt?: StringFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => NullableDateTimeFieldUpdateOperationsInput, {nullable:true})
    deletedTime?: NullableDateTimeFieldUpdateOperationsInput;

    @Field(() => ChannelUpdateManyWithoutOwnerUserNestedInput, {nullable:true})
    ownedChannels?: ChannelUpdateManyWithoutOwnerUserNestedInput;

    @Field(() => ChannelUpdateManyWithoutUsersNestedInput, {nullable:true})
    channels?: ChannelUpdateManyWithoutUsersNestedInput;
}
