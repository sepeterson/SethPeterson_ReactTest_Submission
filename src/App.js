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

  componentDidMount() {
    this.fetchMembers(0);
  }

  isOkay(statusCode) {
    let diff = 200 - statusCode;
    return !(diff < 0 || diff > 99);
  }

  updatePage(page) {
    if (page >= 0 && page < this.state.numberPages) {
      this.fetchMembers(page);
    }
  }

  filterResponse(member) {
    const currentCongress = member.congresses[0];
    return {
      _id: member._id,
      addresses: member.addresses,
      party: currentCongress.partyAffiliations[0].name,
      committeeAssignments: currentCongress.committeeAssignments,
      stateCode: currentCongress.stateCode,
      stateDistrict: currentCongress.stateDistrict,
      subCommitteeAssignments: currentCongress.subCommitteeAssignments,
      officialName: member.officialName,
      oathOfOfficeDate: member.oathOfOfficeDate
    };
  }

  fetchMembers(page) {
    this.setState({ isLoading: true, errorText: "" });
    fetch(
      `${config.corsProxy}/https://clerkapi.azure-api.net/Members?key=${
        config.apiKey
      }&$skip=${this.state.perPage *
        page}&$orderby=sortName&$filter=active%20eq%20'yes'`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error with proxy server!");
      })
      .then(membersJson => {
        let { pagination } = membersJson;
        this.setState({
          members: membersJson.results.map(member =>
            this.filterResponse(member)
          ),
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

  render() {
    const { members, page, numberPages, errorText } = this.state;
    return (
      <div className="App">
        <div>
          <h3>Members</h3>
          {this.state.errorText && <h3>{errorText}</h3>}
          {this.state.isLoading ? (
            <span>loading...</span>
          ) : (
            <MemberList members={members} />
          )}
          <button className="pageUp" onClick={() => this.updatePage(page - 1)}>
            minus 1
          </button>
          <span>
            page {page + 1} of {numberPages}
          </span>
          <button
            className="pageDown"
            onClick={() => this.updatePage(page + 1)}
          >
            plus 1
          </button>
        </div>
      </div>
    );
  }
}

export default App;
