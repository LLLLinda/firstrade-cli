const { firstrade } = require("../../index");
const CUSTOM_TIMEOUT = 30000;
const toTest = [
  "getBalance",
  "getPosition",
  "getTradeHistory",
  "getSessionTimeLeft",
  "getContact",
];
let credential

beforeAll(() => {
  require("dotenv").config();
  credential = {
    username: process.env.FIRSTRADE_USERNAME,
    password: process.env.FIRSTRADE_PASSWORD,
    pin: process.env.FIRSTRADE_PIN
  }
  jest.setTimeout(CUSTOM_TIMEOUT);
});

describe("with previous session", () => {
  let session = [];

  beforeAll(async () => {
    session = await loginTry(session);
  });

  test.each(toTest)('Should invoke %s using previous session', async (fn) => {
    const res = await firstrade[fn](session);
    expect(res).toStrictEqual(expect.anything());
  });

});

describe("without previous session", () => {

  test.each(toTest)('Should invoke %s after login', async (fn) => {
    const res = await firstrade[fn](credential);
    expect(res).toStrictEqual(expect.anything());
  });

});

async function loginTry(session, limit = 5) {
  let sid;
  do {
    session = await firstrade.login(credential);
    sid = (session.find(x => x.key == "SID") || {}).value;
  } while (!sid && limit-- > 0);
  if (!sid)
    throw new Error("Login Failure");
  return session;
}