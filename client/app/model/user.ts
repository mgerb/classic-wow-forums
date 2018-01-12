export interface UserModel {
  access_token: string;
  battle_net_id: number;
  battletag: string;
  id: number;
  permissions: string;
  token: string;
  character_name?: string;
  character_class?: string;
  character_guild?: string;
  character_avatar?: string;
  character_realm?: string;
}
