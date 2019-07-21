import React, { Component } from "react";
import "./App.css";
import MemberList from "./components/MemberList";
import * as MemberAPI from "./MemberAPI";

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
      partyFilter: "",
      sortBy: "sortName"
    };

    this.updatePartyFilter = this.updatePartyFilter.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
  }

  componentDidMount() {
    this.fetchMembers();
  }

  updatePage(page) {
    if (page >= 0 && page < this.state.numberPages) {
      this.fetchMembers(page, this.state.perPage, this.state.partyFilter);
    }
  }

  fetchMembers(page, perPage, partyFilter, sortBy = this.state.sortBy) {
    this.setState({ isLoading: true, errorText: "" });
    MemberAPI.fetchMembers(
      page,
      typeof perPage !== "undefined" ? perPage : this.state.perPage,
      typeof partyFilter !== "undefined" ? partyFilter : this.state.partyFilter,
      sortBy
    )
      .then(membersJson => {
        if (!membersJson.results) {
          throw new Error("API response missing results");
        }
        let { pagination } = membersJson;
        this.setState({
          members: membersJson.results.map(member =>
            MemberAPI.filterMemberResponse(member)
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
    const partyFilter = event.target.value;
    this.setState({ partyFilter });
    this.fetchMembers(this.state.page, this.state.perPage, partyFilter);
  }

  updateSortBy(event) {
    const sortBy = event.target.value;
    this.setState({ sortBy });
    this.fetchMembers(
      this.state.page,
      this.state.perPage,
      this.state.partyFilter,
      sortBy
    );
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
              <form>
                <label>
                  <select
                    value={this.state.sortBy}
                    onChange={this.updateSortBy}
                  >
                    <option value="sortName">Name</option>
                    <option value="congresses/stateCode%2CsortName">
                      State
                    </option>
                  </select>
                </label>
              </form>
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
