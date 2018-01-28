defmodule MyApp.Guardian.Auth.Token do
  alias MyApp.Guardian

  # one month in seconds
  defp one_month(), do: 2592000

  @spec add_token_and_map_claims(map | {atom, any}) :: {:ok, map} | {:error, String.t}
  def add_token_and_map_claims(user) when is_map(user) do

    claims = user
    |> Map.take([:id, :battletag, :battle_net_id, :access_token]) # take values from user object to map to claims
    |> Guardian.add_permissions(get_permissions(user))

    # set token expiration to the same as the battlenet token
    case Guardian.encode_and_sign(user, claims, ttl: {Map.get(user, :expires_in) || one_month(), :seconds}) do
      {:ok, token, _claims} -> {:ok, Map.merge(user, %{token: token})}
      {:error, error} -> {:error, error}
    end
  end

  def add_token_and_map_claims({:ok, user}), do: add_token_and_map_claims(user)
  def add_token_and_map_claims({:error, error}), do: {:error, error}

  # return permissions base on field in database
  defp get_permissions(user) do
    case Map.get(user, :permissions) do
      "user" -> %{user: [:read, :write]}
      "mod" -> %{mod: [:read, :write]}
      "admin" -> %{admin: [:read, :write]}
      nil -> %{user: [:read, :write]}
    end
  end

end
