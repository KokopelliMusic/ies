import { Provider } from 'react-redux'
import { wrapper } from '../store/store'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps)

  return <Provider store={store}>
    <Component {...props} />
  </Provider>
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false
})