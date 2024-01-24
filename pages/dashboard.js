import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import MainContent from '../components/MainContent';
import Pagination from '../components/Pagination';
import CaptureComponent from '../components/CaptureComponent'; // Import the new component

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingPage, setListingPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [checked, setChecked] = useState(0);
  const [outOfStockFlag, setOutOfStockFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  
  

  const capture = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/capture`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      console.log(jsonData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }
  

  const fetchData = async ({page =1}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/catalog_items?page=${page}&checked=${checked}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData['hydra:member']);
      // console.log(jsonData);
      setTotalItems(jsonData['hydra:totalItems']);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchOutOfStock = async ({page =1}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/catalog_items?page=${page}&outOfStock=1`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData['hydra:member']);
      setTotalItems(jsonData['hydra:totalItems']);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setListingPage(1);
    fetchData({page: 1});
  }, [checked]);
  

  useEffect(() => {
    if(outOfStockFlag){
      setListingPage(1);
      fetchOutOfStock({page: 1});
    }
  }, [outOfStockFlag]);  

  useEffect(() => {
    console.log(listingPage)
    if (listingPage !== 1) {
      fetchData({page: listingPage});
    }
  }, [listingPage]); // Refetch when currentPage changes

  

  const handlePageChange = (newPage) => {
    setListingPage(newPage); // Update the current page
  };

  const handleScroll = () => {
    if (scrollDirection === 'down') {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
      setScrollDirection('up');
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      setScrollDirection('down');
    }
  };


  const handleSearchSubmit = async (query) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query })
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData['hydra:member']);
  } catch (error) {
      console.error('Error fetching description:', error);
  }
    // const response = await fetch(`/api/search?query=${query}`);
    // const result = await response.json();
  };


  return (
    <>
      <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setChecked={setChecked} setOutOfStockFlag={setOutOfStockFlag} setCurrentPage={setCurrentPage}/>
        <div className="lg:pl-72">
          <TopNavbar setSidebarOpen={setSidebarOpen} onSearchSubmit={handleSearchSubmit} />
          {/* {loading ? <p>Loading...</p> : <MainContent data={data} setData={setData} />} */}


            {currentPage === 'main' && <MainContent data={data} />}
            {currentPage === 'capture' && <CaptureComponent capture={capture}/>}




          <Pagination 
            currentPage={listingPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
        <button 
          onClick={handleScroll} 
          className="fixed bottom-11 mb-8 right-5 z-50 flex h-10 w-10 items-center justify-center rounded bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          {scrollDirection === 'down' ? 
            <ChevronDownIcon className="h-5 w-5" /> : 
            <ChevronUpIcon className="h-5 w-5" />
          }
        </button>
      </div>
    </>
  );
}
