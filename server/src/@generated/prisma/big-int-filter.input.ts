import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { NestedBigIntFilter } from './nested-big-int-filter.input';

@InputType()
export class BigIntFilter {

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

    @Field(() => NestedBigIntFilter, {nullable:true})
    not?: NestedBigIntFilter;
}
