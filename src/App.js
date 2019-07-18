import React, { Component } from "react";
import "./App.css";
import MemberList from "./components/MemberList";
import config from "./config.json";

class App extends Component {
  state = {
    members: [],
    perPage: 0,
    numberPages: 0,
    page: 0,
    errorText: "",
    isLoading: false
  };

  isOkay = statusCode => {
    let diff = 200 - statusCode;
    return !((diff < 0) | (diff > 99));
  };

  fetchMembers(page) {
    this.setState({ isLoading: true });
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://clerkapi.azure-api.net/Members?key=${
          config.apiKey
        }&$skip=${this.state.perPage * page}`
      )}`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Can't reach proxy server!");
      })
      .then(membersJson => {
        console.log(membersJson);
        let memberList = JSON.parse(membersJson.contents);
        if (!this.isOkay(membersJson.status.http_code)) {
          throw new Error("Something else broke!");
        }
        let { pagination } = memberList;
        this.setState({
          members: memberList.results,
          perPage: pagination.per_page,
          numberPages: pagination.number_pages,
          page: pagination.page,
          isLoading: false
        });
      })
      .catch(error =>
        this.setState({ errorText: error.message, isLoading: false })
      );
  }

  componentDidMount() {
    this.fetchMembers(0);
  }

  render() {
    return (
      <div className="App">
        <div>
          <h3>Members</h3>
          {this.state.errorText ? <h3>{this.state.errorText}</h3> : null}
          {this.state.isLoading ? (
            <h3>It's loading!!</h3>
          ) : (
            <MemberList members={this.state.members} />
          )}
          <button
            className="pageUp"
            onClick={() => this.fetchMembers(this.state.page + 1)}
          >
            page plus one
          </button>
          <button
            className="pageDown"
            onClick={() => this.fetchMembers(this.state.page - 1)}
          >
            page minus one
          </button>
        </div>
      </div>
    );
  }
}

export default App;
