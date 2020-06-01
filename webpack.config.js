function buildConfig(env) {
  if (env !== "dev" && env !== "prod" && env !== "stg" && env !== "super")
    throw new Error(
      "Wrong webpack build parameter. Possible choices: 'dev' or 'prod' or 'stg'."
    );
  const config = require("./config/webpack/" + env + ".js");
  return config(env);
}

module.exports = buildConfig;
