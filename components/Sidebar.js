import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  BeakerIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Items', href: '#', icon: HomeIcon, current: true },
  { name: 'Dismissed Items', href: '#', icon: ChartPieIcon, current: false }, // Add new item here
  { name: 'Picture', href: '#', icon: PhotoIcon, current: false }
];

const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, setChecked, setOutOfStockFlag, setCurrentPage, multipleUploads, setMultipleUploads }) {

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const handleMenuClick = (itemName) => {
    if (itemName === 'Listed') {
      setChecked(1);
    } else if (itemName === 'Unlisted' || itemName === 'Dashboard') {
      setChecked(0);
    } else if (itemName === 'Out of stock') {
      setOutOfStockFlag(true);
    }

    if (itemName === 'Capture') {
      setCurrentPage('capture');
    } else if (itemName === 'Facebook') {
      setCurrentPage('facebook');
    } else if (itemName === 'Picture') {
      setCurrentPage('picture');
    } else if (itemName === 'Dismissed Items') {
      setCurrentPage('dismissed'); // Set current page to 'dismissed' when clicked
    } else {
      setCurrentPage('main');
    }

    setSidebarOpen(false);
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          {/* Mobile Sidebar */}
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
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
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
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
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
