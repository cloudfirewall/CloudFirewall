import * as React from "react";

export default function SearchBarItem({ setSearchText, handleOnChange }) {
  return (
    <form
      className=""
      onSubmit={(e) => {
        e.preventDefault();
        handleOnChange(e.target['search'].value)
      }}
    >
      <div className="flex flex-row max-h-full space-x-1">
        <div className="form-group md:container">
          <input
            type="text"
            name="search"
            id="search"
            className="form-control"
            onChange={(e)=> handleOnChange(e.target.value)}
          />
        </div>
        <button className="btn btn-primary"> Search</button>
      </div>
    </form>
  );
}
