import React, { useState, ReactNode, FunctionComponent } from 'react';
import './App.css';
import img from './assets/img.jpg';
import img2 from './assets/img2.jpg';
import img3 from './assets/img3.jpg';

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

interface ImageProps {
  path: string;
}

const Image: FunctionComponent<ImageProps> = ({
  path
}): JSX.Element => (
  <Container> 
    <img
      className='img'
      src={path}
      alt='sun'
      loading='lazy'
    />
  </Container>
);

const Loading: FunctionComponent = (): JSX.Element => (
  <div className='loading' />
);



//components

const computeCN = (
  state: boolean,
  block: string,
  element: string,
  modifier: string
): string => {
  const base = `${block}__${element}`;
  return state ? `${base} ${base}--${modifier}` : base;
};

interface LazyProps {
  id: number
}

const Lazy: FunctionComponent<LazyProps> = ({
  id
}): JSX.Element => {
  const [loaded, setLoaded] = useState(false);
  const imgCN = computeCN(loaded, 'lazy', 'img', 'loaded');
  return (
    <Container>
      {!loaded && <Loading />}
      <img
        className={imgCN}
        src={`https://source.unsplash.com/collection/${id}/1600x900`}
        alt='random'
        onLoad={() => setLoaded(true)}
        loading='lazy' 
      />  
    </Container> 
  );
};

const App = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div>
      <Image path={img}/>
      <Image path={img2}/>
      <Image path={img3}/>
      {/* <Lazy id={1}/>
      <Lazy id={2}/>
      <Lazy id={3}/> */}
    </div>
  );
};

export default App;