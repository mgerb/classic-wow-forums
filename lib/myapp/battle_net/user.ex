defmodule MyApp.BattleNet.User do

  @type battle_net_user :: %{"battle_net_id": integer, "battletag": String.t, "access_token": String.t}

  def api_url(region), do: "https://#{region}.api.battle.net"

  def cache_key(user_id, region), do: "usr_char:#{user_id}:#{region}"

  # grab user information from battle net api - use token for auth
  @spec get_user(String.t | {atom, any}, String.t) :: {:ok, battle_net_user} | {:error, any}
  def get_user(access_token, region) when is_binary(access_token) do
    access_token
    |> resource_url("account/user", region)
    |> HTTPoison.get
    |> parse_user_response(access_token)
  end
  def get_user({:ok, access_token}, region), do: get_user(access_token, region)
  def get_user({:error, error}, _), do: {:error, error}

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

  # end point is cached for ten minutes per user
  @spec get_user_characters(integer, String.t, String.t) :: {:ok, map} | {:error, any}
  def get_user_characters(user_id, access_token, region) do
    case Cachex.get(:myapp, cache_key(user_id, region)) do
      {:ok, data} ->
        {:ok, data}
      {:missing, _} -> 
        access_token
        |> resource_url("wow/user/characters", region)
        |> HTTPoison.get
        |> parse_character_response(user_id, region)
    end
  end

  defp parse_character_response({:error, error}, _, _), do: {:error, error}
  defp parse_character_response({:ok, %HTTPoison.Response{body: body}}, user_id, region) do
    case Poison.decode(body) do
      {:ok, data} ->
        # only cache end point if characters return
        if (!data["characters"]) do
          {:error, data}
        else
          Cachex.set(:myapp, cache_key(user_id, region), data, ttl: :timer.minutes(10)) # 10 minutes
        end
        {:ok, data}
      {:error, error} -> {:error, error}
    end
  end

  defp resource_url(access_token, path, region) do
    "#{api_url(region)}/#{path}?access_token=#{access_token}"
  end

end
