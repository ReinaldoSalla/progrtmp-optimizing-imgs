import React, { 
  useState, 
  useEffect,
  useRef,
  ReactNode, 
  FunctionComponent,
  MutableRefObject
} from 'react';
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
  src: string;
}

const Image: FunctionComponent<ImageProps> = ({
  src,
}): JSX.Element => (
  <img
    className='img'
    src={src}
    alt='alt'
  />
);

const Loading: FunctionComponent = (): JSX.Element => (
  <div className='loading' />
);

// hooks

const useHasIntersectedOnce = (
  domNode: MutableRefObject<HTMLDivElement | null>,
  threshold = 0.1, 
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
}

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
  const domNode = useRef<HTMLDivElement | null>(null);
  const hasIntersectedOnce = useHasIntersectedOnce(domNode);
  return (
    <Container>
      <div ref={domNode}>
        {hasIntersectedOnce && (
          <Image 
            src={`https://source.unsplash.com/collection/${id}/1600x900`} 
          />
        )}
      </div>
    </Container> 
  );
};

const App = (): JSX.Element => {
  return (
    <div>
      {/* <Image path={img}/>
      <Image path={img2}/>
      <Image path={img3}/> */}
      {/* <Lazy id={1}/>
      <Lazy id={2}/>
      <Lazy id={3}/> */}
      {new Array(50).fill(0).map((_, index) => (
        <Lazy key={index} id={index} />
      ))}
    </div>
  );
};

export default App;