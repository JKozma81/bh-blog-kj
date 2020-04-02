const moment = require('moment');

function formatDate(postDate, formatString) {
  postDate = moment
    .unix(postDate)
    .utc()
    .format(formatString);
  return postDate;
}

module.exports = { formatDate };
