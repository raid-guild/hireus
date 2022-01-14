import './slider.scss';

import React from 'react';

type ISlider = {
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
  toggleState: boolean;
};

const Slider: React.FC<ISlider> = ({ setToggleState, toggleState }) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={() => setToggleState(!toggleState)} />
      <span className="slider round"></span>
    </label>
  );
};

export default Slider;
