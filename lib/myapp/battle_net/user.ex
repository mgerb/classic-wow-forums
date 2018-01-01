defmodule MyApp.BattleNet.User do
  defstruct id: nil, battletag: nil

  def api_url, do: "https://us.api.battle.net"

  def get_user(access_token) do
    case HTTPoison.get(resource_url("account/user", access_token)) do
      {:ok, %HTTPoison.Response{body: body}} -> {:ok, Poison.decode!(body, as: Battlenet.User)}
      {:error, err} -> {:error, err}
    end
  end

  defp resource_url(path, access_token) do
    "#{api_url}/#{path}?access_token=#{access_token}"
  end
end
