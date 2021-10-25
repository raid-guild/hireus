import React from 'react';
import './slider.scss';

export default function Slider({ setToggleState, toggleState }) {
  return (
    <label className="switch">
      <input type="checkbox" onChange={() => setToggleState(!toggleState)} />
      <span className="slider round"></span>
    </label>
  );
}
