import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React from 'react';
import { StyledBodyText } from 'themes/styled';
import { theme } from 'themes/theme';

type SliderProps = {
  label: string;
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
  toggleState: boolean;
};

const Slider: React.FC<SliderProps> = ({
  label,
  setToggleState,
  toggleState,
}) => {
  return (
    <StyledSwitchContainer
      align={'center'}
      p={{ base: '4px 8px', sm: '8px 12px' }}
    >
      <StyledBodyText
        fontSize={{ base: '10px', md: '14px' }}
        textTransform={'uppercase'}
      >
        {label}
      </StyledBodyText>
      <StyledSwitch>
        <input type="checkbox" onChange={() => setToggleState(!toggleState)} />
        <span className="slider round"></span>
      </StyledSwitch>
    </StyledSwitchContainer>
  );
};

export default Slider;

const StyledSwitchContainer = styled(Flex)`
  background: #111111;
  border-radius: 4px;
  gap: 12px;
`;

const StyledSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    border-radius: 34px;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #666666;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  span:before {
    border-radius: 50%;
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: #c4c4c4;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + span {
    background-color: ${theme.colors.red};
  }

  input:focus + span {
    box-shadow: 0 0 1px ${theme.colors.red};
  }

  input:checked + span:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }
`;
