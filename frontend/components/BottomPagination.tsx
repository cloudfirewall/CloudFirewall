import { Pagination } from "react-bootstrap";

export default function BottomPagination({ currentPage, setCurrentPage, setLastPage }) {
  return (
    <Pagination>
      <Pagination.First
        onClick={() => {
          setCurrentPage(1);
        }}
      />
      <Pagination.Prev
        disabled={currentPage < 2}
        onClick={() => {
          setCurrentPage(currentPage - 1);
        }}
      />
      <Pagination.Ellipsis />
      {[-2, -1, 0, 1, 2].map((value, index) => {
        if (currentPage + value > 0) {
          return (
            <Pagination.Item
              key={index}
              active={value === 0}
              onClick={() => {
                setCurrentPage(currentPage + value);
              }}
            >
              {currentPage + value}
            </Pagination.Item>
          );
        }
      })}
      <Pagination.Ellipsis />
      <Pagination.Next
        onClick={() => {
          setCurrentPage(currentPage + 1);
        }}
      />
      <Pagination.Last
        onClick={() => {
          setLastPage();
        }}
      />
    </Pagination>
  );
}
