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

export const DELETE_ROOM = gql(`mutation deleteRoom ($id: BigInt!) {
  roomDelete(roomId: $id) {
    id
  }
}`);

export const UPDATE_ROOM = gql(`mutation updateRoom ($id: BigInt!, $data: RoomUpdateInput!) {
  roomUpdate(roomId: $id, data: $data) {
    id
  }
}`);
