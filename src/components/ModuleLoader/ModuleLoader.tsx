import React from 'react';
import './styles.css';

const ModuleLoader = () => {
  return (
    <div className='container mx-auto h-full h-min-[80vh] flex justify-center items-center'>
      <div className='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ModuleLoader;
