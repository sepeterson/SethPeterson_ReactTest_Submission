import React, { Component } from "react";
import "./App.css";
import MemberList from "./components/MemberList";
import StateSelector from "./components/StateSelector";
import PageButtons from "./components/PageButtons";
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
      sortBy: "sortName",
      stateFilter: ""
    };

    this.updatePartyFilter = this.updatePartyFilter.bind(this);
    this.updateStateFilter = this.updateStateFilter.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    this.fetchMembers();
  }

  updatePage(page) {
    if (page >= 0 && page < this.state.numberPages) {
      this.fetchMembers({ page });
    }
  }

  fetchMembers(args) {
    //Destructuring from the method arguments folded into app state in order to make setting default values easier
    const { page, perPage, partyFilter, sortBy, stateFilter } = Object.assign(
      {},
      this.state,
      args
    );
    this.setState({ isLoading: true, errorText: "" });
    MemberAPI.fetchMembers(page, perPage, partyFilter, sortBy, stateFilter)
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
    this.setState({ partyFilter, page: 0 });
    this.fetchMembers({ partyFilter, page: 0 });
  }

  updateStateFilter(event) {
    const stateFilter = event.target.value;
    this.setState({ stateFilter, page: 0 });
    this.fetchMembers({ stateFilter, page: 0 });
  }

  updateSortBy(event) {
    const sortBy = event.target.value;
    this.setState({ sortBy });
    this.fetchMembers({
      sortBy
    });
  }

  render() {
    const { members, page, numberPages, errorText, isLoading } = this.state;
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
                    <option value="Independent">Independent</option>
                  </select>
                </label>
              </form>
              <br />
              <StateSelector
                stateFilter={this.state.stateFilter}
                updateStateFilter={this.updateStateFilter}
              />
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
            {errorText ? (
              <h3 className="error-text">{errorText}</h3>
            ) : (
              <MemberList members={members} />
            )}
          </div>
          <div className="page-controls">
            {isLoading ? (
              <div>loading...</div>
            ) : (
              <PageButtons
                page={page}
                numberPages={numberPages}
                updatePage={this.updatePage}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
