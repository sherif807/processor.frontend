import {  PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';
import FacebookItem from './FacebookItem';


const FacebookItemList = ({ catalogItem,updateFacebookItem, displayedItems, showMoreItems, showLessItems, listFacebookProduct, getEbayDescription, selectedAsin, listAmazonProduct }) => {
    const initialItems = 4;

    return (
        <div className="ml-6 mr-4">
            {catalogItem.facebookItems?.slice(0, displayedItems[catalogItem.id] || initialItems).map(facebookItem => (
                <FacebookItem key={facebookItem.id} facebookItem={facebookItem} listFacebookProduct={listFacebookProduct} catalogItem={catalogItem} updateFacebookItem={updateFacebookItem} getEbayDescription ={getEbayDescription} selectedAsin={selectedAsin} listAmazonProduct={listAmazonProduct}/>
            ))}
            
            {catalogItem.facebookItems?.length > initialItems && (
                <div className="mt-2 flex items-center space-x-2">
                    {displayedItems[catalogItem.id] && displayedItems[catalogItem.id] < catalogItem.facebookItems.length && (
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

export default FacebookItemList;