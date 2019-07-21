import config from "./config.json";

export const fetchMembers = (
  page = 0,
  perPage = 0,
  partyFilter,
  sortBy,
  stateFilter
) => {
  return fetch(
    `${config.corsProxy}/https://clerkapi.azure-api.net/Members?key=${
      config.apiKey
    }&$skip=${perPage *
      page}&$orderby=${sortBy}&$filter=active%20eq%20%27yes%27${
      partyFilter
        ? `%20and%20congresses/partyAffiliations/name%20eq%20%27${partyFilter}%27`
        : ""
    }${
      stateFilter
        ? `%20and%20congresses/stateCode%20eq%20%27${stateFilter}%27`
        : ""
    }`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Error with proxy server!");
  });
};

export const filterMemberResponse = member => {
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
};
