import { useCommonStore } from "@/stores";
import React from "react";

export const HomePage: React.FC = () => {
  const commonStore = useCommonStore();

  // const { data } = useQuery(
  //   gql(/* GraphQL */ `
  //     query GetUser {
  //       user(where: { id: { equals: 3 } }) {
  //         id
  //         nickname
  //         nicknameNo
  //       }
  //     }
  //   `),
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
