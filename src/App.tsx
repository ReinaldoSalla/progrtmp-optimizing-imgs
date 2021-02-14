import React, { 
  useState, 
  useEffect,
  useRef,
  ReactNode, 
  FunctionComponent,
  MutableRefObject
} from 'react';
import './App.css';

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

const Image: FunctionComponent<ImageProps> = ({
  src,
  onLoad,
  imgCN
}): JSX.Element => (
  <img
    className={imgCN}
    src={src}
    alt='random demonstration'
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
    return () => observer.unobserve(currentDomNode as HTMLDivElement);
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

const App: FunctionComponent = (): JSX.Element => {
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