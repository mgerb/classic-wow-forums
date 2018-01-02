defmodule MyApp.BattleNet.User do

  @type battle_net_user :: %{"battle_net_id": integer, "battletag": String.t, "access_token": String.t}

  def api_url, do: "https://us.api.battle.net"

  # grab user information from battle net api - use token for auth
  @spec get_user(String.t | {atom, any}) :: {:ok, battle_net_user} | {:error, any}
  def get_user(access_token) when is_binary(access_token) do
    access_token
    |> resource_url("account/user")
    |> HTTPoison.get
    |> parse_user_response(access_token)
  end
  def get_user({:ok, access_token}), do: get_user(access_token)
  def get_user({:error, error}), do: {:error, error}

  defp parse_user_response({:error, error}, _), do: {:error, error}
  defp parse_user_response({:ok, %HTTPoison.Response{body: body}}, access_token) do
    case Poison.decode(body) do
      {:ok, user} ->
        user = user
        |> Map.merge(%{"access_token" => access_token}) # add access token to return map
        |> Map.put("battle_net_id", Map.get(user, "id")) # change id key to battle_net_id
        |> Map.delete("id") # remove id key
        {:ok, user}
      {:error, error} -> {:error, error}
    end
  end

  @spec get_user_characters(String.t) :: {:ok, map} | {:error, any}
  def get_user_characters(access_token) do
    access_token
    |> resource_url("wow/user/characters")
    |> HTTPoison.get
    |> parse_character_response
  end

  defp parse_character_response({:error, error}), do: {:error, error}
  defp parse_character_response({:ok, %HTTPoison.Response{body: body}}), do: Poison.decode(body)

  defp resource_url(access_token, path) do
    "#{api_url()}/#{path}?access_token=#{access_token}"
  end

end
