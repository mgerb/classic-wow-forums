// TODO: add prod url
const oauthUrl: string =
  process.env.NODE_ENV === 'production'
    ? ''
    : 'https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/oauth&scope=wow.profile&client_id=2pfsnmd57svcpr5c93k7zb5zrug29xvp&response_type=code';

const openOuathWindow = () => {
  window.open(oauthUrl, '_blank', 'resizeable=yes, height=900, width=1200');
};

export const Oauth = {
  openOuathWindow,
};
