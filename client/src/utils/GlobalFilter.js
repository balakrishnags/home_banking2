import React, { useEffect, useState } from "react";
import { useAsyncDebounce } from "react-table";
// import { Images } from "../../../Assets/Strings/images";
import "../style/tableStyle.scss";

export const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 200);

  useEffect(() => {
    setValue(filter || '')
    // onChange(value)
  }, [filter])

  const deleteText = () => {
    setFilter("");
    setValue("");
    // console.log("clicked!!!");
  };

  return (
    <div className="position-relative searchDiv">
      <input
        className="searchInput"
        type="text"
        id="search"
        name="search"
        value={value || ""}
        placeholder="Search"
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
