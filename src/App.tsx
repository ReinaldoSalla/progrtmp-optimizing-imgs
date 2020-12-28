import React from 'react';
import './App.css';
import img from './assets/img.jpg';

const App = () => {
  return (
    <div>
      <img src={img} className='app__img' />
    </div>
  );
};

export default App;