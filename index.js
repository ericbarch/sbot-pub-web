const express = require('express');
const ssbClient = require('ssb-client');

const SERVER_PORT = 3000;
const app = express();
app.set('view engine', 'ejs');

let cachedSbotInstance = null;

app.get('/', async (req, res) => {
  try {
    const sbot = await getSbotInstance();
    const inviteCode = await getInvite(sbot);
    res.render('index', { inviteCode: inviteCode });
  } catch (sbotErr) {
    cachedSbotInstance = null;
    res.sendStatus(500);
  }
});

function getSbotInstance () {
  return new Promise((resolve, reject) => {
    if (cachedSbotInstance) {
      return resolve(cachedSbotInstance);
    }

    ssbClient((err, sbot) => {
      if (err) {
        reject(err);
      } else {
        cachedSbotInstance = sbot;
        resolve(sbot);
      }
    });
  });
}

function getInvite (sbot) {
  return new Promise((resolve, reject) => {
    sbot.invite.create(1, (err, invite) => {
      if (err) {
        reject(err);
      } else {
        resolve(invite);
      }
    });
  });
}

app.listen(SERVER_PORT, () => {
  console.log(`Pub http listening on port ${SERVER_PORT}`);
});
