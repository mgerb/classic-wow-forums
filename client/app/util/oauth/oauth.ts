// for prod site
// TODO:
const prod_id = '';
const prod_redirect_uri = 'https://dev.classicwowforums.com/oauth';

// for dev site
const dev_id = 'dy22zpswn6b5q22zjparrcn83jkdre9h';
const dev_redirect_uri = 'https://dev.classicwowforums.com/oauth';

// for local site
const local_id = 'h8fx6ad624ne9qw2njxx6343za7fux3j';
const local_redirect_uri = 'https://localhost/oauth';

let client_id;
let redirect_uri;

switch (process.env.NODE_ENV) {
  case 'production':
    client_id = prod_id;
    redirect_uri = prod_redirect_uri;
    break;
  case 'dev':
    client_id = dev_id;
    redirect_uri = dev_redirect_uri;
    break;
  default:
    client_id = local_id;
    redirect_uri = local_redirect_uri;
}

// TODO: support for eu etc.
const oauthUrl =
  `https://us.battle.net/oauth/authorize?redirect_uri=${redirect_uri}&scope=wow.profile&client_id=${client_id}&response_type=code`;

const openOuathWindow = () => {
  window.open(oauthUrl, '_blank', 'resizeable=yes, height=900, width=1200');
};

export const Oauth = {
  openOuathWindow,
};
