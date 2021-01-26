function makeMembersArray() {
  return [
    {
      id: 1,
      member_name: 'Danny',
      dollars: 20,
    },
    {
      id: 2,
      member_name: 'DJ',
      dollars: 20,
    },
    {
      id: 3,
      member_name: 'Stephanie',
      dollars: 20,
    },
    {
      id: 4,
      member_name: 'Michelle',
      dollars: 20,
    },
  ];
}

function makeMaliciousMember() {
  const maliciousMember = {
    id: 911,
    member_name: `Bad image <img src="https://url.to.file.which/does-not.exist"> onerror="alert(document.cookie);"&gt;. But not <strong>all</strong> bad.`,
    dollars: 0
  }
  const expectedMember = {
    ...maliciousMember,
    member_name: `Bad image <img src="https://url.to.file.which/does-not.exist"> onerror="alert(document.cookie);"&gt;. But not <strong>all</strong> bad.`,
    dollars: 0
  }
  return {
    maliciousMember,
    expectedMember
  }
}

module.exports = { makeMaliciousMember, makeMembersArray};