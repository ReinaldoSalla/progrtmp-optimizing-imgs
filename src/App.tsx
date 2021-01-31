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
// import img1 from './assets/img.jpg';
// import img2 from './assets/img2.jpg';
// import img3 from './assets/img3.jpg';
import img1 from './assets/heavy1.jpg';
import img2 from './assets/heavy2.jpg';
import img3 from './assets/heavy3.jpg';

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

const Image: FunctionComponent<ImageProps> = ({
  src,
  onLoad,
  imgCN
}): JSX.Element => (
  <img
    className={imgCN}
    src={src}
    alt='alt'
    onLoad={onLoad}
  />
);

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
  id: any;
}

const LazyReq: FunctionComponent<LazyProps> = ({
  id
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
          src={`https://source.unsplash.com/collection/${id}/1600x900`} 
          // src={id}            
          imgCN={imgCN}
          onLoad={onLoad}
        />
        )}
        </Container>
    </Wrapper> 
  );
};

const LazyLocal: FunctionComponent<LazyProps> = ({
  id
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
          src={id}            
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
      <Route path='/' exact>
        <h1>Requests</h1>
        {new Array(50).fill(0).map((_, index) => (
          <LazyReq key={index} id={index} />
        ))}
      </Route>
      <Route path='/local'>
        <h1>local</h1>
        <LazyLocal id={img1} />
        <LazyLocal id={img2} />
        <LazyLocal id={img3} />
      </Route>
    </BrowserRouter>
  );
};

export default App;