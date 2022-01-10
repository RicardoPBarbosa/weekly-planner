import React from 'react'
import ReactDOM from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import { QueryClient, QueryClientProvider } from 'react-query'

import './index.css'
import App from './App'

const queryClient = new QueryClient()

registerSW()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
