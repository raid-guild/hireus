import 'index.css';

import { ChakraProvider, Flex } from '@chakra-ui/react';
import App from 'App';
import { WalletProvider } from 'contexts/WalletContext';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from 'reportWebVitals';
import { theme } from 'themes/theme';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WalletProvider>
        <Flex
          py="1rem"
          overflowX="hidden"
          background="radial-gradient(97.27% 170.54% at 98.7% 2.73%, #24003A 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(100% 350.19% at 100% 100%, #170011 0%, rgba(23, 0, 17, 0) 100%),
        radial-gradient(50% 175.1% at 0% 100%, #130000 0%, rgba(31, 0, 0, 0) 100%),
        radial-gradient(50% 175.1% at 0% 0%, #330F00 0%, rgba(51, 15, 0, 0) 100%),
        linear-gradient(0deg, #000000, #000000)"
        >
          <App />
        </Flex>
      </WalletProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
