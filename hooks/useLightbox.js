import { useState, useEffect, useRef } from 'react';

const useLightbox = (resetInputTitle) => {
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lightboxVisible && lightboxRef.current && !lightboxRef.current.contains(event.target)) {
        closeLightbox();
      }
    };

    if (lightboxVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    


    return () => {
      if (lightboxVisible) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [lightboxVisible]);





  const openLightbox = () => {
    setLightboxVisible(true);
    document.body.style.overflow = 'hidden';
    
    
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    resetInputTitle();
    document.body.style.overflow = '';
  };



  return {
    lightboxVisible,
    selectedImages,
    closeLightbox,
    openLightbox,
    lightboxRef
  };
};

export default useLightbox;
