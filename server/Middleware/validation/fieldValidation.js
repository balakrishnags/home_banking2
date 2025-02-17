const { returnData } = require("../../utils/common");


// field validation 
module.exports.fieldvalidation = (fields) => (req, res, next) => {
    const bodyProperties = Object.keys(req.body);
    const allowedProperties = Object.values(fields)
    const invalidProperties = bodyProperties.filter(property => !allowedProperties.includes(property));
    if (invalidProperties.length > 0) {
        return returnData(res, 400, `Invalid properties in request body:- ${invalidProperties.join(', ')}`)
    }
    next()
}