import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFieldUpdateOperationsInput } from '../prisma/big-int-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { NullableDateTimeFieldUpdateOperationsInput } from '../prisma/nullable-date-time-field-update-operations.input';
import { UserUpdateOneRequiredWithoutOwnedChannelsNestedInput } from '../user/user-update-one-required-without-owned-channels-nested.input';
import { UserUpdateManyWithoutChannelsNestedInput } from '../user/user-update-many-without-channels-nested.input';

@InputType()
export class ChannelUpdateWithoutRoomsInput {

    @Field(() => BigIntFieldUpdateOperationsInput, {nullable:true})
    id?: BigIntFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    code?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    name?: StringFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => NullableDateTimeFieldUpdateOperationsInput, {nullable:true})
    deletedTime?: NullableDateTimeFieldUpdateOperationsInput;

    @Field(() => UserUpdateOneRequiredWithoutOwnedChannelsNestedInput, {nullable:true})
    ownerUser?: UserUpdateOneRequiredWithoutOwnedChannelsNestedInput;

    @Field(() => UserUpdateManyWithoutChannelsNestedInput, {nullable:true})
    users?: UserUpdateManyWithoutChannelsNestedInput;
}
