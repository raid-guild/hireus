import './snackbar.scss';

import { Box, Flex } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactComponent as EtherscanSvg } from 'assets/etherscan.svg';
import React from 'react';
import { StyledBodyText } from 'themes/styled';
import { theme } from 'themes/theme';
import { BLOCK_EXPLORER_URL } from 'web3/constants';

type ISnackbar = {
  chainId: number;
  hash: string;
  message: string;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const Snackbar: React.FC<ISnackbar> = ({
  chainId,
  hash,
  message,
  setShowSnackbar,
}) => {
  return (
    <StyledPosition>
      <StyledContainer>
        <Flex align={'center'}>
          <a
            href={`${BLOCK_EXPLORER_URL[chainId]}tx/${hash}`}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            <EtherscanSvg />
          </a>
          {message && <StyledBodyText ml={'8px'}>{message}</StyledBodyText>}
        </Flex>
        <StyledCloseContainer onClick={() => setShowSnackbar(false)}>
          <StyledCloseIcon>&#10005;</StyledCloseIcon>
        </StyledCloseContainer>
      </StyledContainer>
    </StyledPosition>
  );
};

export default Snackbar;

const fadeIn = keyframes`
  0% {
    bottom: 0px;
    opacity: 0;
  }
  100% {
    bottom: 50px;
    opacity: 1;
  }
`;

const StyledPosition = styled(Box)`
  animation: ${fadeIn} 1s ease 0.5s forwards;
  position: fixed;
  z-index: 1001;
  height: 70px;
  width: 290px;
  bottom: 50px;
  right: 100px;
`;

const StyledContainer = styled(Box)`
  background: ${theme.colors.black};
  box-sizing: border-box;
  border: 2px solid ${theme.colors.red};
  border-radius: 4px;
  height: 70px;
  padding: 0 10px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCloseContainer = styled(Box)`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover,
  &:focus,
  &:active {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.4);
  }
`;

const StyledCloseIcon = styled.p`
  color: #fff;
  font-weight: bold;
  font-size: 20px;
`;
