defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.BattleNet
  alias MyApp.Data
  alias MyApp.Guardian.Auth

  # this is for auth with username/password - currently only for admin
  def login(conn, params) do
    {output, status} = params
    |> Data.User.login
    |> Auth.Token.add_token_and_map_claims
    |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end

  # this is for authorization with battlenet
  @spec authorize(map, map) :: any
  def authorize(conn, %{"code" => code}) when not is_nil(code) do

    {output, status} = code
      |> BattleNet.Auth.get_access_token
      # TODO: support for other regions maybe?
      # right now a US user can auth with the EU end point
      # maybe it works vice versa? Unable to test it out
      # because I don't have a test eu account
      |> BattleNet.User.get_user("us")
      |> Data.User.upsert_user
      |> Auth.Token.add_token_and_map_claims
      |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

  def characters(conn, params) do
    region = Map.get(params, "region")

    %{"access_token" => token, "id" => user_id} = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.take(["access_token", "id"])
    
    {output, status} = user_id
    |> BattleNet.User.get_user_characters(token, region)
    |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

  def update_selected_character(conn, params) do
    %{"id" => user_id, "access_token" => access_token} = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.take(["id", "access_token"])
    
    # validate the character exists in users WoW profile
    {:ok, characterList} = BattleNet.User.get_user_characters(user_id, access_token, params["region"])
    exists = Enum.find(characterList["characters"], fn(char) ->
      char["name"] == params["character_name"] && char["realm"] == params["character_realm"]
    end)

    {output, status} = case exists do
      nil -> {:error, "character doesn't exist"}
      _ -> 
        params = params
        |> Map.put("id", user_id)
        |> Map.put_new("character_guild", nil) # set guild to nil if it doesn't exist

        params
        |> Data.User.update_character
    end
    |> Response.put_resp

    conn
    |>put_status(status)
    |>Response.json(output)
  end

end
