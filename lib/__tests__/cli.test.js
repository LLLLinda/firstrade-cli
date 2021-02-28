const util = require('util');
const exec = util.promisify(require('child_process').exec);

const CUSTOM_TIMEOUT = 60000;
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
  let session

  beforeAll(async () => {
    session = await loginTry(session);
  });

  test.each(toTest)('Should invoke %s using previous session', async (fn) => {
    const { stdout, stderr } = await exec(`node bin/firstrade ${fn} --cookies=${session}`);
    expect(stdout).toBeTruthy()
    expect(stderr).toBeFalsy()
  });

});

describe("without previous session", () => {

  test.each(toTest)('Should invoke %s after login', async (fn) => {
    const { stdout, stderr } = await exec(`node bin/firstrade ${fn} --username=${credential.username} --password=${credential.password} --pin=${credential.pin}`);
    expect(stdout).toBeTruthyOrZero()
    expect(stderr).toBeFalsy()
  });
});

async function loginTry(session = "", timeLimit = CUSTOM_TIMEOUT) {
  const start = new Date()
  const timeout = () => (new Date()) - start > timeLimit;
  const emptySid = () => session == "" || session.includes('{\\"key\\":\\"SID\\",\\"value\\":\\"\\"}');
  do {
    const { stdout, stderr } = await exec(`node bin/firstrade login --username=${credential.username} --password=${credential.password} --pin=${credential.pin}`);
    if (!stderr)
      session = stdout
  } while (emptySid() && !timeout());
  if (emptySid())
    throw new Error("Login Failure");
  return session;
}