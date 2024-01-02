const RegEx = {
    only__number__regEx: /^[0-9]*$/,
    only__number__regEx12: /^[0-9]{12}$/,
    only__number__regEx20: /^[0-9]{10,20}$/,
    alphanumeric__without__spaces: /^[a-zA-Z0-9\-_]{0,40}$/,
    alphanumeric__without__spaces22: /^(?=.*[a-zA-Z]{4})(?=.*[0-9])[A-Za-z0-9]+$/,
    capitalalphanumeric__without__spaces22: /^(?=.*[A-Z]{4})(?=.*[0-9])[A-Z0-9]+$/,
    name__regEx: /^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$/,
    name__regExwithhypen: /^[a-zA-Z0-9 -]+$/,
    blood__regEx: /^[^0-9]+([+-])*$/,
    password__regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,64}$/,
    phone__regEx: /^[0-9 +]*$/,
    email__regEx: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    leading__spaces: /^\s*/,
}

module.exports = RegEx;