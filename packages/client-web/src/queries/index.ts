import { gql } from "@/@generated";

export const EXIT_CHANNEL = gql(`mutation exitChannel($id: BigInt!) {
  channelExit(id: $id)
}`);
