const routes = require("express").Router();

function isValidNumber(val) {
  // Check if value is existing, not null, or number
  return val !== "undefined" && val !== null && typeof val === "number" ? true : false;
}

routes.post("/bid-cap", (req, res) => {
  const {
    rpcAlpha,
    rpcBeta,
    ebRpc,
    nonSocialClicks,
    nonSocialClicksCutOff,
    socialClicks,
    socialClicksCutOff,
    currentBidCap,
    factor,
  } = req.body;

  // Initialize response as 400
  res.statusCode = 400;
  let respBody = {
    data: null,
  };

  // Validate parameters
  if (
    !isValidNumber(rpcAlpha) ||
    !isValidNumber(rpcBeta) ||
    !isValidNumber(ebRpc) ||
    !isValidNumber(nonSocialClicks) ||
    !isValidNumber(nonSocialClicksCutOff) ||
    !isValidNumber(socialClicks) ||
    !isValidNumber(socialClicksCutOff) ||
    !isValidNumber(currentBidCap) ||
    !isValidNumber(factor)
  )
    return res.send(respBody);

  // Set net value temporarily
  let net = isValidNumber(req.body.net) ? req.body.net : 40;

  // Bid cap strategy
  let bidCap =
    rpcAlpha > 2.5 && net > 30
      ? socialClicks > socialClicksCutOff &&
        nonSocialClicks > nonSocialClicksCutOff
        ? currentBidCap < Math.max(ebRpc * factor, (rpcAlpha + rpcBeta) / 2)
          ? (currentBidCap / 100) * 101
          : (currentBidCap / 100) * 96
        : currentBidCap < Math.max(ebRpc, (rpcAlpha + rpcBeta) / 2)
          ? (currentBidCap / 100) * 101
          : Math.max(ebRpc, (rpcAlpha + rpcBeta) / 2)
      : socialClicks > socialClicksCutOff &&
        nonSocialClicks > nonSocialClicksCutOff
        ? currentBidCap < Math.min(ebRpc * factor, (rpcAlpha + rpcBeta) / 2)
          ? (currentBidCap / 100) * 105
          : (currentBidCap / 100) * 95
        : currentBidCap < Math.min(ebRpc * factor, (rpcAlpha + rpcBeta) / 2)
          ? (currentBidCap / 100) * 102
          : Math.min(ebRpc, (rpcAlpha + rpcBeta) / 2);

  // Update response as 200
  res.statusCode = 200;
  respBody.data = { bidCap: parseFloat(bidCap.toFixed(4)) };
  return res.send(respBody);
});

module.exports = routes;
