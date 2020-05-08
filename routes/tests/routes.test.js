const request = require('supertest')
const app = require('../../index')

const templateParam = {
	rpcAlpha: 3.0,
  rpcBeta: 3.2,
  ebRpc: 25,
  nonSocialClicks: 0.30,
  nonSocialClicksCutOff: 0.26,
  socialClicks: 0.69,
  socialClicksCutOff: 0.68,
  currentBidCap: 5,
  factor: 1.45,
  net: 40
};

describe('/Post bid-cap', () => {
  it('Invalid parameter as undefined value', async () => {
    let param = Object.assign({}, templateParam);
    delete param['rpcAlpha'];
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(400)
  });
  
  it('Invalid parameter as null value', async () => {
    let param = Object.assign({}, templateParam);
    param.rpcAlpha = null;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(400)
  });
  
  it('Invalid parameter as NaN value', async () => {
    let param = Object.assign({}, templateParam);
    param.rpcAlpha = "string";
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(400)
  });

  it('Increase Bid Cap by 1%', async () => {
    let param = Object.assign({}, templateParam);
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.bidCap).toEqual(5.05)
    });

  it('Decrease Bid Cap by 4%', async () => {
    let param = Object.assign({}, templateParam);
    param.currentBidCap = 100;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(96)
  });

  it('Increase Bid Cap by 1%', async () => {
    let param = Object.assign({}, templateParam);
    param.socialClicks = 0;
    param.currentBidCap = 1;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(1.01)
  });

  it('Bid Cap = Max(EBRPC, Avg.(RPC Alpha, RPC Beta))', async () => {
    let param = Object.assign({}, templateParam);
    param.socialClicks = 0;
    param.currentBidCap = 100;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(25)
  });

  it('Increase Bid Cap by 5%', async () => {
    let param = Object.assign({}, templateParam);
    param.net = 0;
    param.currentBidCap = 3
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(3.15)
  });

  it('Decrease Bid Cap by 5%', async () => {
    let param = Object.assign({}, templateParam);
    param.net = 0;
    param.currentBidCap = 5;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(4.75)
  });

  it('Increase Bid Cap by 2%', async () => {
    let param = Object.assign({}, templateParam);
    param.net = 0;
    param.socialClicks = 0;
    param.currentBidCap = 3;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(3.06)
  });

  it('Bid Cap = Min(EBRPC, Avg.(RPC Alpha, RPC Beta))', async () => {
    let param = Object.assign({}, templateParam);
    param.net = 0;
    param.socialClicks = 0;
    param.currentBidCap = 5;
    const res = await request(app)
      .post('/bid-cap')
      .send(param)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data.bidCap).toEqual(3.1)
  });
})

app.close();