import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from './theme';

export const StyledFlex = styled(Flex)`
  background-color: black;
  padding: 24px;
  border-radius: 3px;
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: 450px;
  flex-direction: column;
  justify-content: center;
`;

export const StyledGridChild = styled.div`
  width: 100%;
  break-inside: avoid;
  margin-bottom: 1em;
  padding: 2rem;
  /* border: 5px solid; */
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 4px 9px 18px -7px rgba(0, 0, 0, 0.75);
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.blackLight};
  }
`;

// --------- Headings ------------

export const StyledPrimaryHeading = styled(Heading)`
  font-family: ${theme.fonts.uncial};
  letter-spacing: 1.2px;
  line-height: 1.5;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.2em red;
  color: white;
`;

export const StyledSecondaryHeading = styled(Heading)`
  font-family: ${theme.fonts.uncial};
  letter-spacing: 1.2px;
  color: ${theme.colors.red};
`;

export const StyledHeadingLabels = styled(Heading)`
  font-family: ${theme.fonts.texturina};
  letter-spacing: 2px;
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'center')};
  color: white;
`;

// --------- Texts ------------

export const StyledBodyText = styled(Text)`
  max-width: 720px;
  font-family: ${theme.fonts.texturina};
  line-height: 1.8;
  color: white;
  text-align: justify;
`;

export const StyledCardText = styled(Text)`
  max-width: 720px;
  font-family: ${theme.fonts.texturina};
  line-height: 1.8;
  color: white;
  text-align: left;
`;

export const StyledMessageText = styled(Text)`
  font-family: ${({ font }) => (font ? font : theme.fonts.jetbrains)};
  color: ${({ color }) => (color ? color : 'black')};
  line-height: 1.4;
`;

type StyledNumberTextProps = {
  color?: string;
};

export const StyledNumberText = styled(Text)<StyledNumberTextProps>`
  max-width: 720px;
  font-family: ${theme.fonts.spaceMono};
  line-height: 1.8;
  color: white;
  text-align: justify;

  ${({ color }) => color && `color: ${color}`};
`;

export const StyledFooterHeaderText = styled(Text)`
  font-family: ${theme.fonts.spaceMono};
  font-weight: bold;
  color: ${theme.colors.red};
`;

// --------- Buttons ------------

export const StyledPrimaryButton = styled(Button)`
  min-width: 160px;
  height: 50px;
  font-family: ${theme.fonts.spaceMono};
  text-transform: uppercase;
  color: black;
  border-radius: 2px;
  background: linear-gradient(
    94.89deg,
    #ff5a00 0%,
    #d62789 70.2%,
    #ad17ad 100%
  );
  padding-left: 24px;
  padding-right: 24px;
  &:hover {
    background: linear-gradient(
      94.89deg,
      #f78040 0%,
      #dd459b 70.2%,
      #ad3bad 100%
    );
  }
`;

export const StyledSecondaryButton = styled(Button)`
  min-width: 160px;
  height: 50px;
  font-family: ${theme.fonts.spaceMono};
  text-transform: uppercase;
  border: 2px solid ${theme.colors.red};
  border-radius: 3px;
  color: ${theme.colors.red};
  background: black;
  box-decoration-break: clone;
  padding-left: 24px;
  padding-right: 24px;
  &:hover {
    background: black;
    opacity: 0.6;
  }
`;

export const StyledSmallPrimaryButton = styled(Button)`
  height: 28px;
  font-family: ${theme.fonts.spaceMono};
  text-transform: uppercase;
  color: black;
  border-radius: 2px;
  background: linear-gradient(
    94.89deg,
    #ff5a00 0%,
    #d62789 70.2%,
    #ad17ad 100%
  );
  &:hover {
    background: linear-gradient(
      94.89deg,
      #f78040 0%,
      #dd459b 70.2%,
      #ad3bad 100%
    );
  }
`;

export const StyledSmallSecondaryButton = styled(Button)`
  height: 28px;
  font-family: ${theme.fonts.spaceMono};
  text-transform: uppercase;
  border: 2px solid ${theme.colors.red};
  border-radius: 3px;
  color: ${theme.colors.red};
  background: black;
  box-decoration-break: clone;
  &:hover {
    background: black;
    opacity: 0.6;
  }
`;

// --------- Form Inputs ------------

export const StyledInput = styled(Input)`
  background: ${theme.colors.black};
  border: 2px solid ${theme.colors.red};
  border-radius: 4px;
  color: #fff;

  &::placeholder {
    color: ${theme.colors.greyDark};
  }
`;

export const StyledTextArea = styled(Textarea)`
  background: ${theme.colors.blackLight};
  border: none;
  border-radius: 0;
`;

// --------- Cards ------------

export const StyledCard = styled(Box)`
  background: ${theme.colors.black};
  border-top: 2px solid ${theme.colors.red};
  border-radius: 4px;
  box-size: border-box;
  overflow-y: scroll;
`;

type StyledBountyRowProps = {
  secondary?: number;
};

export const StyledBountyRow = styled(Flex)<StyledBountyRowProps>`
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;

  ${props => props.secondary === 1 && `background: #111111;`}

  &:hover {
    background: ${theme.colors.greyDark};
    cursor: pointer;
  }
`;
