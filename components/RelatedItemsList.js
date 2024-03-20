import {  PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';
import RelatedItem from './RelatedItem';


const RelatedItemsList = ({ catalogItem,updateRelatedItem, displayedItems, showMoreItems, showLessItems, listProduct, getEbayDescription, selectedAsin, listAmazonProduct }) => {
    const initialItems = 4;

    return (
        <div className="ml-6 mr-4">
            {catalogItem.relatedItems?.slice(0, displayedItems[catalogItem.id] || initialItems).map(relatedItem => (
                <RelatedItem key={relatedItem.id} relatedItem={relatedItem} listProduct={listProduct} catalogItem={catalogItem} updateRelatedItem={updateRelatedItem} getEbayDescription ={getEbayDescription} selectedAsin={selectedAsin} listAmazonProduct={listAmazonProduct}/>
            ))}
            
            {catalogItem.relatedItems?.length > initialItems && (
                <div className="mt-2 flex items-center space-x-2">
                    {displayedItems[catalogItem.id] && displayedItems[catalogItem.id] < catalogItem.relatedItems.length && (
                        <button onClick={() => showMoreItems(catalogItem.id)} className="text-indigo-600 hover:text-indigo-800">
                            <PlusCircleIcon className="h-6 w-6" />
                        </button>
                    )}

                    {displayedItems[catalogItem.id] && displayedItems[catalogItem.id] > initialItems && (
                        <button onClick={() => showLessItems(catalogItem.id)} className="text-indigo-600 hover:text-indigo-800">
                            <MinusCircleIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RelatedItemsList;