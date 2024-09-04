export default function Pagination({ currentPage, totalItems, onPageChange }) {
    const itemsPerPage = 10; // Adjust as needed
    const totalPages = Math.ceil(totalItems / itemsPerPage);

  
    const handlePrev = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
  
    // Generate page numbers - logic can be adjusted as needed
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        {/* Mobile view - Previous/Next */}
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            onClick={handlePrev}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            onClick={handleNext}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
        </div>
        {/* Desktop view - Page numbers */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {/* Page number links */}
              {pageNumbers.map((number) => (
                <a
                  key={number}
                  onClick={() => onPageChange(number)}
                  className={`cursor-default relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    number === currentPage ? 'text-white bg-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300'
                  } hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                >
                  {number}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  }
  