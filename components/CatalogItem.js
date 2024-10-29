import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import CombinedItemForm from './CombinedItemForm'; // Import the CombinedItemForm
import AnalyticsSlider from './AnalyticsSlider'; // Import AnalyticsSlider

export default function CatalogItem({ item, isFirst, analytics }) {
  // Debugging to check item structure
  console.log('CatalogItem data:', item);

  // Use item values with fallbacks
  const [isExpanded, setIsExpanded] = useState(isFirst);
  const [searchString, setSearchString] = useState(item.searchString || '');
  const [titleChanged, setTitleChanged] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity || 1); // Fallback to 1 if undefined
  const [condition, setCondition] = useState(item.itemCondition || 1000); // Fallback to 1000 if undefined
  const [notes, setNotes] = useState(item.notes || ''); // Fallback to empty string if undefined

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleBlur = async () => {
    if (searchString !== item.searchString) {
      setTitleChanged(true);
      await patchCatalogItem({ searchString });
      setTimeout(() => {
        setTitleChanged(false);
      }, 2000);
    }
    setIsEditingTitle(false);
  };

  const patchCatalogItem = async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      await fetch(`${apiUrl}/api/catalog_items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Patch error:', error);
    }
  };

  return (
    <div className="border rounded-md shadow-md p-4 mt-4">
      <button
        className="w-full text-left text-gray-700 font-semibold py-2 hover:bg-gray-100 focus:outline-none flex flex-col space-y-2"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-2 w-full">
          {isEditingTitle ? (
            <input
              type="text"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              onBlur={handleTitleBlur}
              className="border rounded p-1 text-sm flex-grow"
              placeholder="Edit Title"
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditingTitle(true)} className="cursor-pointer">
              {searchString}
            </span>
          )}
          {titleChanged && <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />}
        </div>
      </button>

      {/* CombinedItemForm to handle quantity, condition, and notes */}
      <CombinedItemForm
        initialQuantity={quantity}
        initialCondition={condition}
        initialNotes={notes}
        onQuantityChange={(newQuantity) => setQuantity(newQuantity)}
        onConditionChange={(newCondition) => setCondition(newCondition)}
        onNotesChange={(newNotes) => setNotes(newNotes)}
        labelClassName="mb-2 text-sm font-medium text-gray-700"
        inputClassName="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Analytics Slider */}
      {/* <AnalyticsSlider
        analytics={item.analytics}
        item={item}
        itemId={item.id}
        patchCatalogItem={patchCatalogItem}
      /> */}

    </div>
  );
}
