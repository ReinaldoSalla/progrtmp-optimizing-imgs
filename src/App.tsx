import React from 'react';
import Lazy from './components/Lazy';
import getPlaceholders from './utils/getPlaceholders';
import './App.css';

function App() {
  return (
    <>
      <h1 className='app__title'>Lazy Loading Images</h1>
      {getPlaceholders(100).map((id) => (
        <Lazy 
          key={id}
          src={`https://source.unsplash.com/collection/${id}/1600x900`} 
        />
      ))}
    </>
  );
};

export default App;
