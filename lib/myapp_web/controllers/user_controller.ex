defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.BattleNet
  alias MyApp.Data
  alias MyApp.Guardian.Auth

  # https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/api/battlenet/authorize&scope=wow.profile&client_id=vxqv32fddxsy6cmk6259amtymbuzmfrq&response_type=code

  @spec authorize(map, map) :: any
  def authorize(conn, %{"code" => code}) when not is_nil(code) do

    {output, status} = code
      |> BattleNet.Auth.get_access_token
      |> BattleNet.User.get_user
      |> Data.User.upsert_user
      |> Auth.Token.add_token_and_map_claims
      |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

  def characters(conn, _params) do
    %{"access_token" => token, "id" => user_id} = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.take(["access_token", "id"])
    
    {output, status} = user_id
    |> BattleNet.User.get_user_characters(token)
    |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

  def update_selected_character(conn, params) do
    id = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("id")
    
    params = params
    |> Map.put("id", id)
    |> Map.put_new("character_guild", nil) # set guild to nil if it doesn't exist

    {output, status} = params
    |> Data.User.update_character
    |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

end
