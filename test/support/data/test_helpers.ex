defmodule MyApp.Data.TestHelpers do
  import MyApp.Data.User
  alias MyApp.Guardian.Auth

  @spec new_user() :: {:ok, map}
  def new_user() do
    upsert_user(%{"battle_net_id" => 1, "battletag" => "mgerb42", "access_token" => "test_token"})
    |> Auth.Token.add_token_and_map_claims
  end

  @spec atom_key_to_string(map) :: map
  def atom_key_to_string(map) do
    for {key, val} <- map, into: %{}, do: {Atom.to_string(key), val}
  end

end
