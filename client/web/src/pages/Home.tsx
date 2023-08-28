import { useCommonStore } from "@/stores";
import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";

export const HomePage: React.FC = () => {
  const commonStore = useCommonStore();
  const A = gql(/* GraphQL */ `
    query GetUser {
      user(where: { id: { equals: 3 } }) {
        id
        nickname
      }
    }
  `);

  // const a = useQuery(
  //   gql(`query {
  //   user (where: { id: {equals: 3} }) {
  //     id
  //   }
  // }`),
  // );
  return (
    <div
      onClick={() => {
        commonStore.setThemeDarkMode(commonStore.themeDarkMode === "dark" ? "light" : "dark");
      }}
    >
      hello
    </div>
  );
};
