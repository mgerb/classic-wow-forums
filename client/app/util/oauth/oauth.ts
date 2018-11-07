import { ConfigService } from '../../services/config.service';

const getUrl = (redirect_uri: string, client_id: string) =>
  `https://us.battle.net/oauth/authorize?redirect_uri=${redirect_uri}&scope=wow.profile&client_id=${client_id}&response_type=code`;

const openOuathWindow = async () => {
  const config = await ConfigService.getConfig();
  window.open(getUrl(config.redirect_uri, config.client_id), '_blank', 'resizeable=yes, height=900, width=1200');
};

export const Oauth = {
  openOuathWindow,
};
