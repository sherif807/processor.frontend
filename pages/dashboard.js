import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import MainContent from '../components/MainContent';
import Pagination from '../components/Pagination';
import CaptureComponent from '../components/CaptureComponent'; 
import PictureUploadComponent from '../components/PictureUploadComponent';
import PictureGridComponent from '../components/PictureGridComponent'; 
import DismissedItemsPage from '../components/DismissedItemsPage';


import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [multipleUploads, setMultipleUploads] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingPage, setListingPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [checked, setChecked] = useState(3);
  const [liveSearchFlag, setLiveSearchFlag] = useState(true);
  const [outOfStockFlag, setOutOfStockFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');

  // const capture = async () => {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${apiUrl}/api/capture`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const jsonData = await response.json();
  //     console.log(jsonData);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const uploadPicture = async (file) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const jsonData = await response.json();
      console.log("here2", multipleUploads);
  
      if (multipleUploads !== true) {
        setCurrentPage('main'); // Navigate back to the dashboard
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // const fetchData = async ({ page = 1 }) => {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${apiUrl}/api/pictures?page=${page}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const jsonData = await response.json();
  //     console.log(jsonData);
  //     setData(jsonData['hydra:member']);
  //     setTotalItems(jsonData['hydra:totalItems']);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchOutOfStock = async ({page = 1}) => {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${apiUrl}/api/catalog_items?page=${page}&outOfStock=1`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const jsonData = await response.json();
  //     setData(jsonData['hydra:member']);
  //     setTotalItems(jsonData['hydra:totalItems']);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   setListingPage(1);
  //   fetchData({page: 1});
  // }, [checked]);

  // useEffect(() => {
  //   if (outOfStockFlag) {
  //     setListingPage(1);
  //     fetchOutOfStock({page: 1});
  //   }
  // }, [outOfStockFlag]);

  // useEffect(() => {
  //   if (currentPage === 'facebook') {
  //   } else {
  //     fetchData({page: listingPage});
  //   }
  // }, [currentPage, listingPage]);

  const handlePageChange = (newPage) => {
    setListingPage(newPage);
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
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData['hydra:member']);
    } catch (error) {
      console.error('Error fetching description:', error);
    }
  };

  return (
    <>
      <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setChecked={setChecked}
        setOutOfStockFlag={setOutOfStockFlag}
        setCurrentPage={setCurrentPage}
        multipleUploads={multipleUploads}
        setMultipleUploads={setMultipleUploads}
      />
        <div className="lg:pl-72">
          <TopNavbar setSidebarOpen={setSidebarOpen} onSearchSubmit={handleSearchSubmit} />
          {loading ? <p>Loading...</p> : (
            <>
              {/* {currentPage === 'main' && <MainContent data={data} />} */}
              {currentPage === 'main' && <PictureGridComponent page={ listingPage } setTotalItems = { setTotalItems }/> }
              {currentPage === 'capture' && <CaptureComponent capture={capture} />}
              {currentPage === 'picture' && <PictureUploadComponent uploadPicture={uploadPicture} setCurrentPage={setCurrentPage}/>} {/* New Picture page */}
              {currentPage === 'dismissed' && <DismissedItemsPage setTotalItems={setTotalItems} />}

            </>
          )}
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
