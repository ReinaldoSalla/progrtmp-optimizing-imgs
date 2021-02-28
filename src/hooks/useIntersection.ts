import { 
  useState, 
  useEffect,
  MutableRefObject 
} from 'react';

function useIntersection(
  ref: MutableRefObject<HTMLDivElement>,
  threshold = 0.5, 
  rootMargin = '0px'
) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry], element) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        element.unobserve(currentRef)
      }
    }, { root: null, rootMargin, threshold }); 
    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, [ref, rootMargin, threshold]);

  return isVisible;
};

export default useIntersection;