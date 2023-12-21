import ReactDOM from "react-dom/client";
import App from "./entry";
import { SocketClientContext } from "@/contexts";
import { StoreContext, getStores } from "@/stores";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient, createSocketClient } from "@/contexts";
import { API_HOST, createApiAxios } from "./utils";

createApiAxios(API_HOST);
const apolloClient = createApolloClient();
const socketClient = createSocketClient();
const stores = getStores();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <StoreContext.Provider value={stores}>
      <SocketClientContext.Provider value={socketClient}>
        <App />
      </SocketClientContext.Provider>
    </StoreContext.Provider>
  </ApolloProvider>,
);
