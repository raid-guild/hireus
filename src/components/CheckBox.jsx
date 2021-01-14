import { Box, useCheckbox, useCheckboxGroup, HStack } from '@chakra-ui/react';

// 1. Create a component that consumes the `useRadio` hook
function CheckBoxCard(props) {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        color='#7f5af0'
        boxShadow='md'
        border='1px solid #7f5af0'
        fontFamily="'JetBrains Mono', monospace"
        _checked={{
          bg: '#7f5af0',
          color: 'white',
          borderColor: 'teal.600'
        }}
        px={2}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function CheckBox(props) {
  const { getRootProps, getCheckboxProps } = useCheckboxGroup({
    name: props.name,
    defaultValue: props.defaultValue,
    onChange: (e) => {
      props.updateRadio(e);
    }
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {props.options.map((value) => {
        const checkbox = getCheckboxProps({ value });
        return (
          <CheckBoxCard key={value} {...checkbox}>
            {value}
          </CheckBoxCard>
        );
      })}
    </HStack>
  );
}

export default CheckBox;
