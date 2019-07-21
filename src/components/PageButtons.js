import React from "react";
import "./Components.css";

function StateSelector(props) {
  const { page, numberPages, updatePage } = props;
  return (
    <div>
      <span className="page-buttons" onClick={() => updatePage(page - 1)}>
        &laquo;
      </span>
      <span>
        Page {page + 1} of {numberPages}
      </span>
      <span className="page-buttons" onClick={() => updatePage(page + 1)}>
        &raquo;
      </span>
    </div>
  );
}

export default StateSelector;
