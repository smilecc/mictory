import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedFloatFilter } from './nested-float-filter.input';
import { NestedBigIntFilter } from './nested-big-int-filter.input';

@InputType()
export class NestedBigIntWithAggregatesFilter {

    @Field(() => String, {nullable:true})
    equals?: bigint | number;

    @Field(() => [String], {nullable:true})
    in?: Array<bigint> | Array<number>;

    @Field(() => [String], {nullable:true})
    notIn?: Array<bigint> | Array<number>;

    @Field(() => String, {nullable:true})
    lt?: bigint | number;

    @Field(() => String, {nullable:true})
    lte?: bigint | number;

    @Field(() => String, {nullable:true})
    gt?: bigint | number;

    @Field(() => String, {nullable:true})
    gte?: bigint | number;

    @Field(() => NestedBigIntWithAggregatesFilter, {nullable:true})
    not?: NestedBigIntWithAggregatesFilter;

    @Field(() => NestedIntFilter, {nullable:true})
    _count?: NestedIntFilter;

    @Field(() => NestedFloatFilter, {nullable:true})
    _avg?: NestedFloatFilter;

    @Field(() => NestedBigIntFilter, {nullable:true})
    _sum?: NestedBigIntFilter;

    @Field(() => NestedBigIntFilter, {nullable:true})
    _min?: NestedBigIntFilter;

    @Field(() => NestedBigIntFilter, {nullable:true})
    _max?: NestedBigIntFilter;
}
