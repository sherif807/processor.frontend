import { useState, useEffect } from 'react';

const useDisplayedItems = (initialData, initialItems = 4, moreItems = 4) => {
  const [displayedItems, setDisplayedItems] = useState({});

  useEffect(() => {
    const initialDisplayed = {};
    initialData.forEach(item => {
      initialDisplayed[item.id] = initialItems;
    });
    setDisplayedItems(initialDisplayed);
  }, [initialData, initialItems]);

  const showMoreItems = (catalogItemId) => {
    setDisplayedItems(prev => ({
      ...prev,
      [catalogItemId]: (prev[catalogItemId] || initialItems) + moreItems
    }));
  };

  const showLessItems = (catalogItemId) => {
    setDisplayedItems(prev => ({
      ...prev,
      [catalogItemId]: initialItems
    }));
  };

  return { displayedItems, showMoreItems, showLessItems };
};

export default useDisplayedItems;
