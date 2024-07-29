// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isBigHud: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isBigHud }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const bigHud = {
    on: 'text-2xl w-12 h-12',
    off: 'text-lg w-10 h-10'
  }

  return (
    <div className="flex justify-center mt-4 flex-wrap">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`m-2 px-3 py-1 border rounded flex items-center justify-center ${
            page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          } ${isBigHud ? bigHud.on : bigHud.off}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
