const firstrade = require("../firstrade.js");

let credential
beforeAll(() => {
  require("dotenv").config();
  credential = {
    username: process.env.FIRSTRADE_USERNAME,
    password: process.env.FIRSTRADE_PASSWORD,
    pin: process.env.FIRSTRADE_PIN
  }
});

describe("with previous session", () => {
  let session;

  beforeAll(async () => {
    session = await firstrade.login(credential);
  });

  test("Should login and return session cookies", async () => {
    console.log(session);
  });

  test("Should return balance using previous session", async () => {
    const res = await firstrade.getBalance(session);
    console.log(res);
  });

  test("Should return position using previous session", async () => {
    const res = await firstrade.getPosition(session);
    console.log(res);
  });

  test("Should return history using previous session", async () => {
    const res = await firstrade.getTradeHistory(session);
    console.log(
      res);
  }, 30000);
  test("Should return session time left using previous session", async () => {
    const res = await firstrade.getSessionTimeLeft(session);
    console.log(res);
  });
});

describe("without previous session", () => {
  test("Should return balance after login", async () => {
    const res = await firstrade.getBalance(credential);
    console.log(res);
  }, 30000);

  test("Should return position after login", async () => {
    const res = await firstrade.getPosition(credential);
    console.log(res);
  }, 30000);

  test("Should return history after login", async () => {
    const res = await firstrade.getTradeHistory(credential);
    console.log(res);
  }, 30000);

  test("Should return session time left after login", async () => {
    const res = await firstrade.getSessionTimeLeft(credential);
    console.log(res);
  }, 30000);
});
