const queryBuilder = (query, params) => {
  // noSearchYesParentId;
  // yesSearchYesParentId;
  // yesSearchNoParentId;
  // noSearchNoParentId;
  // noSearchNoParentIdQueryHandler;

  let dbQuery = {};

  dbQuery.params = params;

  if (query === "noSearchNoParentId") {
    dbQuery = noSearchNoParentId(params);
  }

  const noSearchNoParentId = ({ skip, limit, contentType }) => {
    skip = parseInt(skip);
    limit = parseInt(limit);
  };
};
