import React, { useState, ReactNode, FunctionComponent } from 'react';
import './App.css';
import img from './assets/img.jpg';

// ui

interface ContainerProps {
  children: ReactNode;
}

const Container: FunctionComponent<ContainerProps> = ({
  children
}): JSX.Element => (
  <div className='container'>
    {children}
  </div>
);

const Image: FunctionComponent = (): JSX.Element => (
  <Container> 
    <img
      className='img'
      src={img}
      alt='sun'
    />
  </Container>
);

const Loading: FunctionComponent = (): JSX.Element => (
  <div className='loading' />
);



//components

const Lazy: FunctionComponent = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Container>
      {isLoading && <Loading />}
    </Container> 
  );
};



const App = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div>
      {/* {isLoading && <div>Loading</div>}
      <img 
        style={isLoading ? {display: 'none'} : {}}
        className='app__img'
        src='https://source.unsplash.com/collection/1/1600x900'
        // src={img}
        alt='company'
        onLoad={() => setIsLoading(false)}
      /> */}
      <Image />
      <Lazy />
    </div>
  );
};

export default App;