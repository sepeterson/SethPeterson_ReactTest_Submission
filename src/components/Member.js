import React from "react";
import "./MemberList.css";

function Member(props) {
  const { name, party, state, district, hometown, address, index } = props;
  return (
    <div
      className={`member-container ${index % 2 === 1 ? "odd-row" : "even-row"}`}
    >
      <div>
        <div>
          <span className={"member-name"}>{name}</span>
          <span>
            {" "}
            ({hometown}, {state})
          </span>
        </div>
        <span>
          {party} - {state} {district}
        </span>
      </div>
      <div className="address-container">
        <div>{address.streetAddress}</div>
        <div>{address.telephone}</div>
      </div>
    </div>
  );
}

export default Member;
