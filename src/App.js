import React, { Component } from "react";
import "./App.css";
import MemberList from "./components/MemberList";
import config from "./config";

class App extends Component {
  state = {
    members: [],
    perPage: 0,
    page: 0,
    errorText: ""
  };

  fetchMembers(page) {
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://clerkapi.azure-api.net/Members?key=${config.apiKey}`
      )}`
    )
      .then(response => response.json())
      .then(memberList => {
        console.log(memberList.contents);
        this.setState({
          members: JSON.parse(memberList.contents).results
        });
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this.fetchMembers(0);
  }

  render() {
    return (
      <div className="App">
        <div>
          <h3>Members</h3>
          <MemberList members={this.state.members} />
        </div>
      </div>
    );
  }
}

export default App;
