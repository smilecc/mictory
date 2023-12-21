import { StoreStorage } from "@/lib/store-storage";
import { CommonStore } from "@/stores/CommonStore";
import { API_HOST } from "@/utils";
import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = StoreStorage.load(CommonStore, "sessionToken", "");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token || "",
      // authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export function createApolloClient(apiHost = API_HOST): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: `${apiHost}/graphql`,
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    headers: {},
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}
