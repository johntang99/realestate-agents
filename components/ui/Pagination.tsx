'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 7,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show subset with ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
      
      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;
      
      if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: maxVisible - 2 }, (_, i) => i + 1);
        pages.push(...leftRange, 'ellipsis-right', totalPages);
      } else if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = Array.from(
          { length: maxVisible - 2 },
          (_, i) => totalPages - (maxVisible - 3) + i
        );
        pages.push(1, 'ellipsis-left', ...rightRange);
      } else if (showLeftEllipsis && showRightEllipsis) {
        pages.push(
          1,
          'ellipsis-left',
          leftSiblingIndex,
          currentPage,
          rightSiblingIndex,
          'ellipsis-right',
          totalPages
        );
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* First Page (optional) */}
      {showFirstLast && currentPage > 3 && totalPages > maxVisible && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          <span className="px-2 text-gray-400">
            <MoreHorizontal size={20} />
          </span>
        </>
      )}
      
      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span key={`${page}-${index}`} className="px-2 text-gray-400">
              <MoreHorizontal size={20} />
            </span>
          );
        }
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors',
              currentPage === page
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      {/* Last Page (optional) */}
      {showFirstLast && currentPage < totalPages - 2 && totalPages > maxVisible && (
        <>
          <span className="px-2 text-gray-400">
            <MoreHorizontal size={20} />
          </span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      
      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        )}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
}
