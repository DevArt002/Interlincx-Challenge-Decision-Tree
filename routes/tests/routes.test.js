const request = require("supertest");
const app = require("../../index");

// Definition of http request status code
const STATUSCODE = {
  SUCCESS: 200,
  BADREQUEST: 400,
}

// Expected actions
const expectedActions = [
  ["Invalid parameter as undefined value", {}, STATUSCODE.BADREQUEST, { data: null }],
  [
    "Invalid parameter as null value",
    {
      rpcAlpha: null,
      rpcBeta: null,
      ebRpc: null,
      nonSocialClicks: null,
      nonSocialClicksCutOff: null,
      socialClicks: null,
      socialClicksCutOff: null,
      currentBidCap: null,
      factor: null,
      net: null,
    },
    STATUSCODE.BADREQUEST,
    { data: null },
  ],
  [
    "Invalid parameter as NaN value",
    {
      rpcAlpha: "string",
      rpcBeta: "string",
      ebRpc: "string",
      nonSocialClicks: "string",
      nonSocialClicksCutOff: "string",
      socialClicks: "string",
      socialClicksCutOff: "string",
      currentBidCap: "string",
      factor: "string",
      net: "string",
    },
    STATUSCODE.BADREQUEST,
    { data: null },
  ],
  [
    "Increase Bid Cap by 1%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0.69,
      socialClicksCutOff: 0.68,
      currentBidCap: 5,
      factor: 1.45,
      net: 40,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 5.05 } },
  ],
  [
    "Decrease Bid Cap by 4%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0.69,
      socialClicksCutOff: 0.68,
      currentBidCap: 100,
      factor: 1.45,
      net: 40,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 96 } },
  ],
  [
    "Increase Bid Cap by 1%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0,
      socialClicksCutOff: 0.68,
      currentBidCap: 1,
      factor: 1.45,
      net: 40,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 1.01 } },
  ],
  [
    "Bid Cap = Max(EBRPC, Avg.(RPC Alpha, RPC Beta))",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0,
      socialClicksCutOff: 0.68,
      currentBidCap: 100,
      factor: 1.45,
      net: 40,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 25 } },
  ],
  [
    "Increase Bid Cap by 5%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0.69,
      socialClicksCutOff: 0.68,
      currentBidCap: 3,
      factor: 1.45,
      net: 0,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 3.15 } },
  ],
  [
    "Decrease Bid Cap by 5%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0.69,
      socialClicksCutOff: 0.68,
      currentBidCap: 5,
      factor: 1.45,
      net: 0,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 4.75 } },
  ],
  [
    "Increase Bid Cap by 2%",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0,
      socialClicksCutOff: 0.68,
      currentBidCap: 3,
      factor: 1.45,
      net: 0,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 3.06 } },
  ],
  [
    "Bid Cap = Min(EBRPC, Avg.(RPC Alpha, RPC Beta))",
    {
      rpcAlpha: 3.0,
      rpcBeta: 3.2,
      ebRpc: 25,
      nonSocialClicks: 0.3,
      nonSocialClicksCutOff: 0.26,
      socialClicks: 0,
      socialClicksCutOff: 0.68,
      currentBidCap: 5,
      factor: 1.45,
      net: 0,
    },
    STATUSCODE.SUCCESS,
    { data: { bidCap: 3.1 } },
  ],
];

// App close after all tests are finished
afterAll(() => {
  app.close();
});

describe("/Post bid-cap", () => {
  it.each(expectedActions)(
    "%s",
    async (title, param, expStatusCode, expData) => {
      await request(app)
        .post("/bid-cap")
        .send(param)
        .expect(expStatusCode, expData);
    }
  );
});