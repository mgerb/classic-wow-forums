const config = require('../../../../config/client.secret.json');

const { bnet_client_id, bnet_redirect_uri } = config;

// TODO: support for eu etc.
const oauthUrl =
  `https://us.battle.net/oauth/authorize?redirect_uri=` +
  `${bnet_redirect_uri}&scope=wow.profile&client_id=${bnet_client_id}&response_type=code`;

const openOuathWindow = () => {
  window.open(oauthUrl, '_blank', 'resizeable=yes, height=900, width=1200');
};

export const Oauth = {
  openOuathWindow,
};
