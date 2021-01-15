import React, { useState } from 'react';
import './App.css';
import img from './assets/img.jpg';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading);
  return (
    <div className='app__container'>
      {isLoading && <div>Loading</div>}
      <img 
        style={isLoading ? {display: 'none'} : {}}
        className='app__img'
        src='https://source.unsplash.com/collection/1/1600x900'
        // src={img}
        alt='company'
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default App;