import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { BigIntFieldUpdateOperationsInput } from '../prisma/big-int-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { NullableDateTimeFieldUpdateOperationsInput } from '../prisma/nullable-date-time-field-update-operations.input';
import { UserUncheckedUpdateManyWithoutChannelsNestedInput } from '../user/user-unchecked-update-many-without-channels-nested.input';
import { RoomUncheckedUpdateManyWithoutChannelNestedInput } from '../room/room-unchecked-update-many-without-channel-nested.input';

@InputType()
export class ChannelUncheckedUpdateInput {

    @Field(() => BigIntFieldUpdateOperationsInput, {nullable:true})
    id?: BigIntFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    code?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    name?: StringFieldUpdateOperationsInput;

    @Field(() => BigIntFieldUpdateOperationsInput, {nullable:true})
    ownerUserId?: BigIntFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedTime?: DateTimeFieldUpdateOperationsInput;

    @Field(() => NullableDateTimeFieldUpdateOperationsInput, {nullable:true})
    deletedTime?: NullableDateTimeFieldUpdateOperationsInput;

    @Field(() => UserUncheckedUpdateManyWithoutChannelsNestedInput, {nullable:true})
    users?: UserUncheckedUpdateManyWithoutChannelsNestedInput;

    @Field(() => RoomUncheckedUpdateManyWithoutChannelNestedInput, {nullable:true})
    rooms?: RoomUncheckedUpdateManyWithoutChannelNestedInput;
}
