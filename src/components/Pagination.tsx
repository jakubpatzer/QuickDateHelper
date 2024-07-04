// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 flex-wrap">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`m-2 px-3 py-1 w-10 h-10 border rounded text-lg flex items-center justify-center ${
            page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
