import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  XMarkIcon,
  PhotoIcon,
  ClockIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

// Updated navigation, keeping placeholders for counts
const navigation = [
  { name: 'Items', href: '#', icon: HomeIcon, current: true, count: 0 },
  { name: 'Pending', href: '#', icon: ClockIcon, current: false, count: 0 },
  { name: 'Listed', href: '#', icon: CheckCircleIcon, current: false, count: 0 },
  { name: 'Dismissed', href: '#', icon: XMarkIcon, current: false, count: 0 },
  { name: 'Picture', href: '#', icon: PhotoIcon, current: false, count: 0 }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, setChecked, setOutOfStockFlag, setCurrentPage, multipleUploads, setMultipleUploads }) {
  const [itemCounts, setItemCounts] = useState({
    items: 0,
    pending: 0,
    dismissed: 0,
    listed: 0
  });

  useEffect(() => {
    // Fetch counts from your backend
    const fetchCounts = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        const response = await fetch(`${apiUrl}/api/get-item-counts`);
        if (!response.ok) {
          throw new Error('Failed to fetch item counts');
        }
        const data = await response.json();

        // Update the state with the fetched counts
        setItemCounts({
          items: data.itemsCount || 0,
          pending: data.pendingCount || 0,
          dismissed: data.dismissedCount || 0,
          listed: data.listedCount || 0
        });
      } catch (error) {
        console.error('Error fetching item counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleMenuClick = (itemName) => {
    if (itemName === 'Listed') {
      setChecked(1);
    } else if (itemName === 'Unlisted' || itemName === 'Dashboard') {
      setChecked(0);
    } else if (itemName === 'Out of stock') {
      setOutOfStockFlag(true);
    }

    if (itemName === 'Items') {
      setCurrentPage('main');
    } else if (itemName === 'Picture') {
      setCurrentPage('picture');
    } else if (itemName === 'Listed') {
      setCurrentPage('listed');
    } else if (itemName === 'Dismissed') {
      setCurrentPage('dismissed');
    } else if (itemName === 'Pending') {
      setCurrentPage('pending');
    } else {
      setCurrentPage('main');
    }

    setSidebarOpen(false);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-12 w-auto"
                      src="/logo.png" 
                      alt="Swiftpeek"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <div className="flex items-center justify-between">
                                <a
                                  href={item.href}
                                  onClick={() => handleMenuClick(item.name)}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold flex-1'
                                  )}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {item.name}
                                  {/* Add badge to show the count */}
                                  {item.name === 'Items' && itemCounts.items > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                      {itemCounts.items}
                                    </span>
                                  )}
                                  {item.name === 'Pending' && itemCounts.pending > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">
                                      {itemCounts.pending}
                                    </span>
                                  )}
                                  {item.name === 'Dismissed' && itemCounts.dismissed > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                      {itemCounts.dismissed}
                                    </span>
                                  )}
                                  {item.name === 'Listed' && itemCounts.listed > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                                      {itemCounts.listed}
                                    </span>
                                  )}
                                </a>
                                {item.name === 'Picture' && (
                                  <input
                                    type="checkbox"
                                    checked={multipleUploads}
                                    onChange={() => setMultipleUploads(!multipleUploads)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    title="Enable Multiple Uploads"
                                  />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                      {/* ...other list items */}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-16 w-auto"
              src="/logo.png" 
              alt="Swiftpeek"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center justify-between">
                        <a
                          href={item.href}
                          onClick={() => handleMenuClick(item.name)}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold flex-1'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                          {/* Add badge to show the count */}
                          {item.name === 'Items' && itemCounts.items > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                              {itemCounts.items}
                            </span>
                          )}
                          {item.name === 'Pending' && itemCounts.pending > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">
                              {itemCounts.pending}
                            </span>
                          )}
                          {item.name === 'Dismissed' && itemCounts.dismissed > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                              {itemCounts.dismissed}
                            </span>
                          )}
                          {item.name === 'Listed' && itemCounts.listed > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                              {itemCounts.listed}
                            </span>
                          )}
                        </a>
                        {item.name === 'Picture' && (
                          <input
                            type="checkbox"
                            checked={multipleUploads}
                            onChange={() => setMultipleUploads(!multipleUploads)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            title="Enable Multiple Uploads"
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              {/* ...other list items */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
