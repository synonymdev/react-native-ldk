const moment = require("moment");

export const formatNumber = (num = 0) => num.replace(/[^0-9]/g,'');

export const formatDate = (date = 0) => moment.unix(date).format('MMM Do YYYY');
