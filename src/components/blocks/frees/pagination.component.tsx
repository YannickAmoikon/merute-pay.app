"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  totalItems?: number
}

export default function PaginationForAll({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  totalItems,
}: PaginationProps) {
  const showEllipsis = currentPage > 3;
  const showLastPage = totalPages > 3 && currentPage !== totalPages;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 text-muted-foreground text-xs">
        Total : {totalItems} agents
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>

        {/* Toujours afficher la page 1 */}
        <Button
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>

        {/* Afficher "..." si on est au-delà de la page 3 */}
        {showEllipsis && (
          <Button variant="outline" size="sm" disabled>
            ...
          </Button>
        )}

        {/* Afficher la page courante si >1 et <totalPages */}
        {currentPage > 1 && currentPage < totalPages && (
          <Button variant="default" size="sm">
            {currentPage}
          </Button>
        )}

        {/* Afficher la dernière page si différente */}
        {showLastPage && (
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}