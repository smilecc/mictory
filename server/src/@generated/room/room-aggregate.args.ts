import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { RoomWhereInput } from './room-where.input';
import { Type } from 'class-transformer';
import { RoomOrderByWithRelationInput } from './room-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { RoomWhereUniqueInput } from './room-where-unique.input';
import { Int } from '@nestjs/graphql';
import { RoomCountAggregateInput } from './room-count-aggregate.input';
import { RoomAvgAggregateInput } from './room-avg-aggregate.input';
import { RoomSumAggregateInput } from './room-sum-aggregate.input';
import { RoomMinAggregateInput } from './room-min-aggregate.input';
import { RoomMaxAggregateInput } from './room-max-aggregate.input';

@ArgsType()
export class RoomAggregateArgs {

    @Field(() => RoomWhereInput, {nullable:true})
    @Type(() => RoomWhereInput)
    where?: RoomWhereInput;

    @Field(() => [RoomOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<RoomOrderByWithRelationInput>;

    @Field(() => RoomWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<RoomWhereUniqueInput, 'id'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => RoomCountAggregateInput, {nullable:true})
    _count?: RoomCountAggregateInput;

    @Field(() => RoomAvgAggregateInput, {nullable:true})
    _avg?: RoomAvgAggregateInput;

    @Field(() => RoomSumAggregateInput, {nullable:true})
    _sum?: RoomSumAggregateInput;

    @Field(() => RoomMinAggregateInput, {nullable:true})
    _min?: RoomMinAggregateInput;

    @Field(() => RoomMaxAggregateInput, {nullable:true})
    _max?: RoomMaxAggregateInput;
}
