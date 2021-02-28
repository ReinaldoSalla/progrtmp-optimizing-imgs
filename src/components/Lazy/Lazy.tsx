import React, {
  useState,
  useRef
} from 'react';
import useIntersection from '../../hooks/useIntersection';
import LazyProps from './Lazy.types';
import './Lazy.css';

function Lazy({ src }: LazyProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  const isVisible = useIntersection(ref);
  const wrapperLoadingCN = hasLoaded 
    ? 'lazy__wrapper-loading lazy__wrapper-loading--finished' 
    : 'lazy__wrapper-loading';
  const imgCN = hasLoaded ? 'lazy__img lazy__img--loaded' : 'lazy__img';
  return (
    <div className='lazy__wrapper'>
      <div className={wrapperLoadingCN} ref={ref}>
      {isVisible && (
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

export default Lazy;