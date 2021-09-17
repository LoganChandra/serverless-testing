const mysql = require("mysql");
const util = require("util");

// _________________If extracting parameters from SSM_________________
// const aws = require("aws-sdk");

// var ssm = new aws.SSM({ region: "ap-southeast-1" });
// var options = {
//   Name: "/app/cinema",// required
//   WithDecryption: true,// required if you have a secret string
// };

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const apiResponse = (status, msg) => {
  return {
    statusCode: status,
    body: JSON.stringify({
      message: msg,
    }),
  };
};

export const handler = async (event, context, callback) => {

  // _________________If extracting parameters from SSM_________________
  // var params = await ssm.getParameter(options).promise();
  // let p = JSON.parse(params.Parameter.Value);
  // var pool = mysql.createPool({
  //   host: p.host,
  //   user: p.user,
  //   password: p.password,
  //   database: p.database,
  //   port: p.port,
  // });
  const connQueryPromisified = util.promisify(pool.query).bind(pool);
  const result = await connQueryPromisified("SELECT * FROM Movie;");
  return apiResponse(200, result);
};
