import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

const Icon: React.FC = () => {
  return (
    <div>
      <h1>Enjoy your coffee! <FontAwesomeIcon icon={faCoffee} /></h1>
    </div>
  );
};

export default Icon;
