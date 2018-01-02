defmodule MyAppWeb.BattleNetController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.BattleNet
  alias MyApp.Data
  alias MyApp.JWT

  # https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/api/battlenet/authorize&scope=wow.profile&client_id=vxqv32fddxsy6cmk6259amtymbuzmfrq&response_type=code

  @spec authorize(map, map) :: any
  def authorize(conn, %{"code" => code}) when not is_nil(code) do

    {output, status} = code
      |> BattleNet.Auth.get_access_token
      |> BattleNet.User.get_user
      |> Data.User.upsert_user
      |> JWT.add_jwt
      |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

  # TODO: cache this end point
  def characters(conn, _params) do
    token = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("access_token")
    
    {output, status} = token
    |> BattleNet.User.get_user_characters
    |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

end
