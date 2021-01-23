import React, { 
  useState, 
  useEffect,
  useRef,
  ReactNode, 
  FunctionComponent,
  MutableRefObject
} from 'react';
import './App.css';
import img1 from './assets/img.jpg';
import img2 from './assets/img2.jpg';
import img3 from './assets/img3.jpg';
// import img1 from './assets/heavy1.jpg';
// import img2 from './assets/heavy2.jpg';
// import img3 from './assets/heavy3.jpg';

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    const currentDomNode = domNode.current;
    
    const onIntersect = (
      [entry]: IntersectionObserverEntry[], 
      observerElement: IntersectionObserver
    ): void => {
      console.log('callback fired');
      if (entry.isIntersecting) {
        setHasIntersectedOnce(true);
        if (currentDomNode) {
          observerElement.unobserve(currentDomNode);
        }
      }
    };

    const options = { root: null, rootMargin, threshold };

    const getObserver = () => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          onIntersect, 
          options
        );
        return observerRef.current;
      }
      return null;
    };

    const observer = getObserver();
    if (observer && currentDomNode) {
      observer.observe(currentDomNode);
    }  
    return () => observer && currentDomNode 
      ? observer.unobserve(currentDomNode) 
      : undefined;
  }, [domNode, rootMargin, threshold]);

  return hasIntersectedOnce;
};

//components

interface LazyProps {
  id: any;
}

const Lazy: FunctionComponent<LazyProps> = ({
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

const App = (): JSX.Element => {
  return (
    <div>
      {new Array(50).fill(0).map((_, index) => (
        <Lazy key={index} id={index} />
      ))}
      {/* <Lazy id={img1} />
      <Lazy id={img2} />
      <Lazy id={img3} /> */}
    </div>
  );
};

export default App;