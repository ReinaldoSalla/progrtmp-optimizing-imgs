/*
Navbar.container.tsx
Navbar.markup.tsx
Navbar.styles.ts
Navbar.actions.ts
Navbar.reducer.ts
Navbar.types
Navbar.constants.ts
Navbar.animations.ts
*/

import React, { 
  useState, 
  useEffect,
  useRef,
  MutableRefObject
} from 'react';
import './App.css';

function getPlaceholders(n: number) {
  return new Array(n).fill(0).map((_, index) => index);
};

function useHasIntersected(
  domNode: MutableRefObject<HTMLDivElement | null>,
  threshold = 0.5, 
  rootMargin = '0px'
) {
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
    // return () => observer.unobserve(currentDomNode as HTMLDivElement);
  }, [domNode, rootMargin, threshold]);

  return hasIntersectedOnce;
};

//components

interface LazyProps {
  src: string;
}

function Lazy({ src }: LazyProps) {
  const domNode = useRef<HTMLDivElement | null>(null);
  const hasIntersected = useHasIntersected(domNode);
  const [hasLoaded, setHasLoaded] = useState(false);
  const wrapperLoadingCN = hasLoaded ? 'wrapper-loading wrapper-loading--finished' : 'wrapper-loading';
  const imgCN = hasLoaded ? 'img img--loaded' : 'img';
  return (
    <div className='wrapper' ref={domNode}>
      <div className={wrapperLoadingCN}>
      {hasIntersected && (
        <img
          className={imgCN}
          src={src}
          alt='random demonstration'
          onLoad={() => setHasLoaded(true)}
        />
      )}
      </div>
    </div> 
  );
};

function App() {
  return (
    <>
      <h1 className='title'>Lazy Loading Images</h1>
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
