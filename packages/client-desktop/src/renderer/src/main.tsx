import ReactDOM from 'react-dom/client'
import './assets/index.css'
import '@mictory/client-web/dist-lib/style.css'
import {
  App,
  ApolloProvider,
  SocketClientContext,
  StoreContext,
  createApolloClient,
  createSocketClient,
  getStores,
  createApiAxios
} from '@mictory/client-web'

const HOST = 'https://mictory.smilec.cc'

createApiAxios(`${HOST}/api`)
const socketClient = createSocketClient(HOST)
const apolloClient = createApolloClient(`${HOST}/api`)
const stores = getStores()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={apolloClient}>
    <StoreContext.Provider value={stores}>
      <SocketClientContext.Provider value={socketClient}>
        <App />
      </SocketClientContext.Provider>
    </StoreContext.Provider>
  </ApolloProvider>
)
