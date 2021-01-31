import React, { 
  useState, 
  useEffect,
  useRef,
  ReactNode, 
  FunctionComponent,
  MutableRefObject
} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import img0 from './assets/heavy1.jpg';
import img1 from './assets/heavy2.jpg';
import img2 from './assets/heavy3.jpg';

// utils

const getPlaceholders = (n: number): Array<number> => {
  return new Array(n).fill(0).map((_, index) => index);
};

// ui

interface ContainerProps {
  children: ReactNode;
  containerCN: string;
}

interface WrapperProps {
  children: ReactNode;
  domNode: MutableRefObject<HTMLDivElement | null>;
}

const Wrapper: FunctionComponent<WrapperProps> = ({
  children,
  domNode
}): JSX.Element => (
  <div className='wrapper' ref={domNode}>
    {children}
  </div>
);

const Container: FunctionComponent<ContainerProps> = ({
  children,
  containerCN
}): JSX.Element => (
  <div className={containerCN}>
    {children}
  </div>
);

interface ImageProps {
  src: string;
  onLoad: () => void;
  imgCN: string;
}

// before considering format and size
// const Image: FunctionComponent<ImageProps> = ({
//   src,
//   onLoad,
//   imgCN
// }): JSX.Element => (
//   <img
//     className={imgCN}
//     src={src}
//     alt='random picture'
//     onLoad={onLoad}
//   />
// );

// using media='()', and making a new request every time the width changes
// const Image: FunctionComponent<ImageProps> = ({
//   src,
//   onLoad,
//   imgCN
// }): JSX.Element => (
//   // <img
//   //   className={imgCN}
//   //   src={src}
//   //   alt='random picture'
//   //   onLoad={onLoad}
//   // />
//   <picture>
//     <source
//       className={imgCN}
//       srcSet={img0}
//       media='(min-width: 800px)'
//       onLoad={onLoad}
//     />
//     <img 
//       src={img2} 
//       className={imgCN}   
//       onLoad={onLoad}
//     />
//   </picture>
// );

const viewportWidth = window.innerWidth;

const Image: FunctionComponent<ImageProps> = ({
  src,
  onLoad,
  imgCN
}): JSX.Element => {
  const img = viewportWidth >= 400 ? img0 : img1;
  return (
    <picture onLoad={onLoad}>
      <source
        className={imgCN}
        srcSet={img}
      />
      <img 
        className={imgCN}   
        src={img} 
        alt=''
      />
    </picture>
  )
};

// hooks

const useHasIntersectedOnce = (
  domNode: MutableRefObject<HTMLDivElement | null>,
  threshold = 0.5, 
  rootMargin = '0px'
): boolean => {
  const [hasIntersectedOnce, setHasIntersectedOnce] = useState(false);
  
  useEffect(() => {
    const currentDomNode = domNode.current;
    
    const onIntersect = (
      [entry]: IntersectionObserverEntry[], 
      observerElement: IntersectionObserver
    ): void => {
      if (entry.isIntersecting) {
        setHasIntersectedOnce(true);
        if (currentDomNode) {
          observerElement.unobserve(currentDomNode);
        }
      }
    };

    const options = { root: null, rootMargin, threshold };

    const observer = new IntersectionObserver(onIntersect, options); 
    if (currentDomNode) {
      observer.observe(currentDomNode);
    }  
    return () => currentDomNode 
      ? observer.unobserve(currentDomNode) 
      : undefined;
  }, [domNode, rootMargin, threshold]);

  return hasIntersectedOnce;
};

//components

interface LazyProps {
  src: string;
}

const Lazy: FunctionComponent<LazyProps> = ({
  src
}): JSX.Element => {
  const domNode = useRef<HTMLDivElement | null>(null);
  const hasIntersectedOnce = useHasIntersectedOnce(domNode);
  const [hasLoaded, setHasLoaded] = useState(false);

  const onLoad = () => setHasLoaded(true);
   
  const containerCN = hasLoaded ? 'container container--loaded' : 'container';

  const imgCN = hasLoaded ? 'img img--loaded' : 'img';

  return (
    <Wrapper domNode={domNode}>
      <Container containerCN={containerCN}>
      {hasIntersectedOnce && (
        <Image 
          src={src} 
          imgCN={imgCN}
          onLoad={onLoad}
        />
      )}
      </Container>
    </Wrapper> 
  );
};

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      {/* <Route path='/' exact>
        <h1>Requests</h1>
        {getPlaceholders(100).map((number) => (
          <Lazy 
            key={number}
            src={`https://source.unsplash.com/collection/${number}/1600x900`} 
          />
        ))}
      </Route> */}
      <Route path='/'>
        <h1>local</h1>
        <Lazy src={img0} />
        <Lazy src={img1} />
        <Lazy src={img2} />
      </Route>
    </BrowserRouter>
  );
};

export default App;