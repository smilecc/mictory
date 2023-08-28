import { useCommonStore } from "@/stores";
import React from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@/@generated";

export const HomePage: React.FC = () => {
  const commonStore = useCommonStore();
  const TEST = gql(/* GraphQL */ `query`);
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
