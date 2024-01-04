// Simple tool to just return boolean by checking chosen object property inside of `req.body`
// It also supports if user writes "false" or "true" as strings instead of booleans `true` or `false`.
// IMPORTANT: It actually protects against the server crashing when toLowerCase() tries to be ran on a non-string!
const isNotBool = (reqBody, objectProp) => {
  if (
    typeof reqBody[objectProp] === "object" ||
    typeof reqBody[objectProp] === "array" ||
    typeof reqBody[objectProp] === "string" ||
    typeof reqBody[objectProp] === "number" ||
    typeof reqBody[objectProp] === "null" ||
    typeof reqBody[objectProp] === "undefined" ||
    typeof reqBody[objectProp] === "function"
  ) {
    return true;
  }
  if (
    !Object.hasOwn(reqBody, objectProp) ||
    typeof reqBody[objectProp] !== "boolean"
  ) {
    return true;
  }
  return false;
};

module.exports = { isNotBool };
