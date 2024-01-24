import { useEffect,useState, useRef } from 'react';
import { ArrowsPointingOutIcon, ArrowPathIcon,LockClosedIcon } from '@heroicons/react/20/solid';

const CatalogItemHeader = ({ catalogItem, handleOpenLightBox, handleRefreshRelatedItems, uniqueConditions, handleFilter, conditionCounts,getHistoricalPrices, prepareItem, updateCatalogItem, isLoading, markCatalogItemChecked }) => {
    const [showConditions, setShowConditions] = useState(false);
    const conditions = ["All", "Pre-Owned", "Refurbished", "New"];
    const dropdownRef = useRef(null);


    const sendConditionToApi = async (condition) => {
        handleRefreshRelatedItems(condition);
        setShowConditions(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowConditions(false);
        }
    };


    useEffect(() => {
        if (showConditions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showConditions]);


    const handlePrepareClick = async () => {
        await prepareItem();
        // Update the catalog item status in state
        updateCatalogItem(catalogItem.id, { status: 9 });
      };

    const handleGetPricingData = async () => {
        await getHistoricalPrices(catalogItem);
    }


    const fetchUpcData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${apiUrl}/api/get-upc`);
            const upcData = await response.json();
            console.log(upcData);
        } catch (error) {
            console.error('Error fetching UPC data:', error);
        }
    };
  
    return(
      <div className="flex items-center space-x-3">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-xl font-semibold text-gray-700">
              {catalogItem.id}
          </span>
          <span className="text-2xl font-bold uppercase">{catalogItem.brand} {catalogItem.model}</span>
          <div onClick={handleOpenLightBox} className="ml-4 cursor-pointer">
              <ArrowsPointingOutIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-700" />
          </div>
          <div 
                onClick={() => setShowConditions(!showConditions)}
                className="relative cursor-pointer"
                ref={dropdownRef}
            >
                <ArrowPathIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-700" />
                {showConditions && (
                    <div className="absolute left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {conditions.map(condition => (
                                <a
                                    key={condition}
                                    onClick={() => sendConditionToApi(condition)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {condition}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          {catalogItem.status === 1 && (
              <div><LockClosedIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-700"/></div>
          )}
  
          <div className="flex space-x-2">
              {/* <button onClick={() => handleFilter(null)} className="rounded-full bg-indigo-600  text-white px-4 py-1 text-sm">
                      All ({catalogItem.relatedItems.length})
              </button> */}
              {uniqueConditions.map(condition => (
                  <button key={condition} onClick={() => handleFilter(condition)} className="rounded-full bg-indigo-600  text-white px-4 py-1 text-sm">
                      {condition} ({conditionCounts[condition]})
                  </button>
              ))}
  
  
              <button 
                  onClick={handleGetPricingData} 
                  className="rounded-full bg-red-500 text-white px-4 py-1 text-sm ml-4"
              >
                  Get Prices
              </button>

              <div>
                {catalogItem.status === 9 ? (
                    <button className="rounded-full bg-gray-500 text-white px-4 py-1 text-sm" disabled>Preparing</button>
                ) : catalogItem.status === 10 ? (
                    <button onClick={handlePrepareClick} className="rounded-full bg-green-500 text-white px-4 py-1 text-sm">Generated</button>
                ) : catalogItem.status === 1 ? (
                    <button className="rounded-full bg-green-500 text-white px-4 py-1 text-sm" disabled>Ready to List</button>
                ): catalogItem.status === 2 ? (
                    <button className="rounded-full bg-green-500 text-white px-4 py-1 text-sm" disabled>Complete</button>
                )
                 : (
                    <button onClick={handlePrepareClick} className="rounded-full bg-red-500 text-white px-4 py-1 text-sm">Prepare</button>
                )}
            </div>

            <div>
                {catalogItem.checked === 1 ? (
                    <button onClick={() => markCatalogItemChecked(catalogItem.id,0)} className="rounded-full  text-white px-4 py-1 text-sm bg-green-500">Mark Undone</button>
                    ) : (
                    <button onClick={() => markCatalogItemChecked(catalogItem.id,1)} className="rounded-full bg-red-500 text-white px-4 py-1 text-sm">Mark Done</button>
                )}            
            </div>

            {isLoading && (
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}

            <div>

            <button 
                className="rounded-full bg-blue-500 text-white px-4 py-1 text-sm" 
                onClick={fetchUpcData} 
            >
                Update UPC
            </button>

            </div>


  
          </div>
  
      </div>
  
  
  )};

  export default CatalogItemHeader;