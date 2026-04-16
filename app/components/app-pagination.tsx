import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "~/components/ui/pagination";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select"
  
  type Props = {
    page: number;
    totalPages: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
  };
  
  const AppPagination = ({
    page,
    totalPages,
    perPage,
    onPageChange,
    onPerPageChange,
  }: Props) => {
    const getPages = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;
  
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (page <= 3) {
          pages.push(1, 2, 3, "...", totalPages);
        } else if (page >= totalPages - 2) {
          pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        }
      }
  
      return pages;
    };
  
    const pages = getPages();
  
    return (
      <div className="flex items-center justify-between gap-4">
        {/* Per Page */}
        <div className="flex items-center gap-2">
            <Select
                value={`${perPage}`}
                onValueChange={(e) => {
                    onPerPageChange(Number(e));
                    onPageChange(1);
                }}
            >
                <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Itens por página:" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
  
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text=""
                onClick={() => page > 1 && onPageChange(page - 1)}
              />
            </PaginationItem>
  
            {pages.map((p, index) => (
              <PaginationItem key={index}>
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => onPageChange(Number(p))}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
  
            <PaginationItem>
              <PaginationNext
                text=""
                onClick={() =>
                  page < totalPages && onPageChange(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };
  
  export default AppPagination;