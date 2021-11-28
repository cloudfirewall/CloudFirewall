import * as React from "react";

type Props = {
  setSearchText: React.Dispatch<React.SetStateAction<string>>
};

const SearchBarItem: React.FC<Props> = ({setSearchText}) => {
  return (
    <form
      className=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-row max-h-full space-x-1">
        <div className="form-group md:container">
          <input
            type="text"
            name="search"
            id="search"
            className="form-control"
          />
        </div>
        <button className="btn btn-primary"> Search</button>

      </div>
    </form>
  );
};

export default SearchBarItem;
