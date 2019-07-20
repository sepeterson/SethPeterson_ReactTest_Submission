import React from "react";
import "./MemberList.css";
import Member from "./Member";

function MemberList(props) {
  return (
    <div className="member-list">
      {props.members.map((m, index) => (
        <Member
          key={m._id}
          name={m.officialName}
          party={m.party}
          state={m.stateCode}
          district={m.stateDistrict}
          index={index}
        />
      ))}
    </div>
  );
}

export default MemberList;
