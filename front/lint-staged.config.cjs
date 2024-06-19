"use strict";

const actions = [
  "npm run _pretty",
  "npm run lint"
];

module.exports = {
  "*.json": ["npm run _pretty:json:write --"],
  "*.{ts,tsx,!*.config.js}": actions
};
