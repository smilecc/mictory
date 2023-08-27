import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ChannelCreateManyInput {

    @Field(() => String, {nullable:true})
    id?: bigint | number;

    @Field(() => String, {nullable:true})
    code?: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    ownerUserId!: bigint | number;

    @Field(() => Date, {nullable:true})
    createdTime?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedTime?: Date | string;

    @Field(() => Date, {nullable:true})
    deletedTime?: Date | string;
}
