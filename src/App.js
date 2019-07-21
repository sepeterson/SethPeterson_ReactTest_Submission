import React, { Component } from "react";
import "./App.css";
import MemberList from "./components/MemberList";
import config from "./config.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      perPage: 0,
      numberPages: 0,
      page: 0,
      errorText: "",
      isLoading: false,
      partyFilter: ""
    };

    this.updatePartyFilter = this.updatePartyFilter.bind(this);
  }

  componentDidMount() {
    this.fetchMembers(0);
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
        if (!membersJson.results) {
          throw new Error("API response missing results");
        }
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

  updatePartyFilter(event) {
    this.setState({ partyFilter: event.target.value });
  }

  render() {
    const { members, page, numberPages, errorText } = this.state;
    return (
      <div className="App">
        <div className="content-container">
          <h3 className="members-header">Members</h3>
          <div className="list-container">
            <div className="filter-controls">
              <h4>Filter Results</h4>
              <form>
                <label>
                  Party:
                  <select
                    value={this.state.partyFilter}
                    onChange={this.updatePartyFilter}
                  >
                    <option value="" />
                    <option value="Democrat">Democrat</option>
                    <option value="Republican">Republican</option>
                  </select>
                </label>
              </form>
              <h4>Sort By</h4>
            </div>
            {this.state.errorText && <h3>{errorText}</h3>}
            <MemberList members={members} />
          </div>
          <div className="page-controls">
            <span
              className="page-buttons"
              onClick={() => this.updatePage(page - 1)}
            >
              &laquo;
            </span>
            <span>
              Page {page + 1} of {numberPages}
            </span>
            <span
              className="page-buttons"
              onClick={() => this.updatePage(page + 1)}
            >
              &raquo;
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
