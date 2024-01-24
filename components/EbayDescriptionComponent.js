// DescriptionComponent.js
import React from 'react';

const DescriptionComponent = ({ description }) => {
    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
        </div>
    );
};

export default DescriptionComponent;
