const firstrade = require("../firstrade.js");

beforeAll(() => {
  require("dotenv").config();
});

describe("with previous session", () => {
  let session;

  beforeAll(async () => {
    session = await firstrade.login({});
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
    console.log(res);
  }, 30000);
});

describe("without previous session", () => {
  test("Should return balance after login", async () => {
    const res = await firstrade.getBalance({});
    console.log(res);
  }, 30000);

  test("Should return position after login", async () => {
    const res = await firstrade.getPosition({});
    console.log(res);
  }, 30000);

  test("Should return history after login", async () => {
    const res = await firstrade.getTradeHistory({});
    console.log(res);
  }, 30000);
});
