import { gql } from "@/@generated";

export const EXIT_CHANNEL = gql(`mutation exitChannel($id: BigInt!) {
  channelExit(id: $id)
}`);

export const JOIN_CHANNEL = gql(`mutation joinChannel ($code: String!) {
  channelJoin(data: { code: $code }) {
    id
    code
  }
}`);
