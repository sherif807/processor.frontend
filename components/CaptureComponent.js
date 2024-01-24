// CaptureComponent.js
import React from 'react';

const CaptureComponent = ({capture}) => {
  return (
    <div>
      <button onClick={capture} className=''>Capture</button>
    </div>
  );
};

export default CaptureComponent;
