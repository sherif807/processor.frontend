import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import MainContent from '../components/MainContent';
import Pagination from '../components/Pagination';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:8000/api/catalog_items?page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setTotalItems(jsonData['hydra:totalItems']);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData(currentPage); // Fetch data for the current page
  }, [currentPage]); // Refetch when currentPage changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Update the current page
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

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:pl-72">
          <TopNavbar setSidebarOpen={setSidebarOpen} />
          {loading ? <p>Loading...</p> : <MainContent data={data} setData={setData} />}
          <Pagination 
            currentPage={currentPage}
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
