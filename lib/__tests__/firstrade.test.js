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
  expect.extend({
    toBeTruthyOrZero(received) {
      const pass = !!received || received == 0;

      const message = () =>
        `expected ${received} to be truthy or zero`;

      return { message, pass };
    },
  });

});

describe("with previous session", () => {
  let session = [];

  beforeAll(async () => {
    session = await loginTry(session);
  });

  test.each(toTest)('Should invoke %s using previous session', async (fn) => {
    const res = await firstrade[fn](session);
    expect(res).toBeTruthy()
  });

});

describe("without previous session", () => {

  test.each(toTest)('Should invoke %s after login', async (fn) => {
    const res = await firstrade[fn](credential);
    expect(res).toBeTruthyOrZero()
  });

});

async function loginTry(session, timeLimit = CUSTOM_TIMEOUT) {
  const start = new Date()
  const timeout = () => (new Date()) - start > timeLimit;
  let sid;
  do {
    session = await firstrade.login(credential);
    sid = (session.find(x => x.key == "SID") || {}).value;
  } while (!sid && !timeout());
  if (!sid)
    throw new Error("Login Failure");
  return session;
}