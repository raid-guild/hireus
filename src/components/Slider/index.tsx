import './slider.scss';

import React from 'react';

type ISlider = {
  label: string;
  setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
  toggleState: boolean;
};

const Slider: React.FC<ISlider> = ({ label, setToggleState, toggleState }) => {
  return (
    <div id="switch-container">
      <p>{label}</p>
      <label className="switch">
        <input type="checkbox" onChange={() => setToggleState(!toggleState)} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Slider;
