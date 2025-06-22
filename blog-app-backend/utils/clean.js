const _ = require("lodash");

module.exports = {
  /**
   * Object
   * @description This method use to clean object
   * @param {Object} Object
   * @param {Array.<String>} fields - fields name in array
   */
  object: (obj = {}, fields = []) => {
    return _.pick(obj, ..._.values(fields));
  },

  /**
   * Request
   * @description This method use to clean attributes for request which includes Params, Query String Params and Body Params
   * @param {Object<Request>} Requests - Restify Request Object
   * @param {Array.<String>} paramsFields - Request params fields name in array
   * @param {Array.<String>} queryParamsFields - Query String params fields name in array
   * @param {Array.<String>} bodyParamsFields - Body params fields name in array
   */
  request: (
    req = {},
    paramsFields = [],
    queryParamsFields = [],
    bodyParamsFields = [],
    headerParams = []
  ) => {
    return _.merge(
      _.pick(req.params, ..._.values(paramsFields)),
      _.pick(req.query, ..._.values(queryParamsFields)),
      _.pick(req.body, ..._.values(bodyParamsFields)),
      _.pick(req.headers, ..._.values(headerParams))
    );
  },
};
