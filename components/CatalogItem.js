import React, { useEffect, useState } from 'react';
import GoogleShoppingPricesStatisticsBox from './GoogleShoppingPricesStatisticsBox';
import EbaySoldPricesStatisticsBox from './EbaySoldPricesStatisticsBox';
import AmazonPricingComponent from './AmazonPricingComponent';
import RelatedItemsList from './RelatedItemsList';
import CatalogItemHeader from './CatalogItemHeader';



const CatalogItem = ({ catalogItem,updateRelatedItem, updateCatalogItem, showMoreItems, showLessItems, displayedItems, handleOpenLightBox, handleRefreshRelatedItems, getHistoricalPrices, pricingData, listProduct, prepareItem, getEbayDescription, handleOpenLightBoxForGoogle, isLoading, markCatalogItemChecked, listAmazonProduct, handleOpenLightBoxForUpcData, setUpcData, selectedUpc, matchAmazon}) => {
  
  const [filterCondition, setFilterCondition] = useState(null);

  const isRefurbishedCondition = condition => condition.includes('Refurbished');
  const [showPrices, setShowPrices] = useState(false);


  const [selectedAsin, setSelectedAsin] = useState(null);
  const handleProductSelect = (asin) => {
    setSelectedAsin(asin);
  };
  
  const handleFilter = (condition) => {
      setFilterCondition(condition);
  };





  const filteredItems = filterCondition === null
      ? catalogItem.relatedItems
      : filterCondition === 'Refurbished'
          ? catalogItem.relatedItems?.filter(item => isRefurbishedCondition(item.readableItemCondition))
          : catalogItem.relatedItems?.filter(item => item.readableItemCondition === filterCondition);

  
  
          const uniqueConditions = [...new Set(catalogItem.relatedItems?.map(item => 
            isRefurbishedCondition(item.readableItemCondition) ? 'Refurbished' : item.readableItemCondition
        ))].filter((condition, index, self) => self.indexOf(condition) === index); // Remove duplicates
        

        const conditionCounts = catalogItem.relatedItems?.reduce((acc, item) => {
          const condition = isRefurbishedCondition(item.readableItemCondition) ? 'Refurbished' : item.readableItemCondition;
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
      }, {});

      const handleGetHistoricalPrices =  async () =>  {
        await getHistoricalPrices(catalogItem);
        // setShowPrices(true); // Toggle the display of the prices
      };           
      

      
      return (
        <div key={catalogItem.id} className="bg-white shadow-xl rounded-lg p-6 mb-8 border border-gray-200">
          <CatalogItemHeader
            catalogItem={catalogItem}
            handleOpenLightBox={handleOpenLightBox}
            handleRefreshRelatedItems={handleRefreshRelatedItems}
            uniqueConditions={uniqueConditions}
            handleFilter={handleFilter}
            conditionCounts={conditionCounts}
            getHistoricalPrices={handleGetHistoricalPrices}
            prepareItem={prepareItem}
            updateCatalogItem={updateCatalogItem}
            isLoading={isLoading}
            markCatalogItemChecked={markCatalogItemChecked}
            handleOpenLightBoxForUpcData={handleOpenLightBoxForUpcData}
            setUpcData={setUpcData}
            matchAmazon={matchAmazon}
          />
          <div className="flex">
            <div className="w-1/2">
              <RelatedItemsList
                catalogItem={{ ...catalogItem, relatedItems: filteredItems }}
                updateRelatedItem={updateRelatedItem}
                displayedItems={displayedItems}
                showMoreItems={showMoreItems}
                showLessItems={showLessItems}
                listProduct={listProduct}
                getEbayDescription={getEbayDescription}
                selectedAsin={selectedAsin}
                listAmazonProduct={listAmazonProduct}
              />
            </div>
              <div className="flex w-1/2">
                {/* <div className="w-1/2">
                  {catalogItem.prices && <GoogleShoppingPricesStatisticsBox  pricingData={catalogItem.prices} handleOpenLightBoxForGoogle={handleOpenLightBoxForGoogle}/>}
                  
                </div> */}
                <div className="w-1/2">
                  {catalogItem.amazonProperties && <AmazonPricingComponent amazonProperties={catalogItem.amazonProperties} amazonPricing={catalogItem.amazonPricing} onProductSelect={handleProductSelect}/>}
                </div>                
                <div className="w-1/2">
                {catalogItem.prices && <EbaySoldPricesStatisticsBox pricingData={catalogItem.prices}/>}
                </div>
              </div>
          </div>
        </div>
      );
      
    };
    



export default CatalogItem;
