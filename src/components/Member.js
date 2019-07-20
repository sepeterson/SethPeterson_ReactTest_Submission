import React from "react";
import "./MemberList.css";

function Member(props) {
  return (
    <div
      className={`member-container ${
        props.index % 2 === 1 ? "odd-row" : "even-row"
      }`}
    >
      <div>{props.name}</div>
      <span>
        {props.party} - {props.state} {props.district}
      </span>
    </div>
  );
}

export default Member;
