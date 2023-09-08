import React from 'react';
import { templates } from 'core/js/reactHelpers';

export default function Confetti(props) {
  const { _setCompletionOn, _button, onClick } = props;
  return (
    <div className='component__inner confetti__inner'>
      <templates.header {...props} />
      <div className='confetti__widget'>
        {_setCompletionOn !== 'inview' && (
          <button className='confetti__button btn-text' onClick={onClick} aria-label={_button.ariaLabel}>
            {_button.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
