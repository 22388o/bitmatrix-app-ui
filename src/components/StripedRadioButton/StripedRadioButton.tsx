import React from 'react';
import './StripedRadioButton.scss';

type Props = {
  options: Array<string>;
  onChange: (option: string) => void;
  selectedOption: string;
};

export const StripedRadioButton: React.FC<Props> = ({
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <ul className="slider-option-main">
      {options.map((option, index) => {
        return (
          <li key={`${index}-${option}`} className="slider-option-item">
            <input
              type="radio"
              checked={selectedOption === option}
              value={option}
              id={option}
              name="rb"
            />
            <label
              onClick={() => onChange(option)}
              className="slider-option-label"
              htmlFor={option}
            />
            <span
              className={`slider-option-title ${
                selectedOption === option
                  ? 'selected-title'
                  : 'unselected-title'
              }`}
            >
              {option}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
