defmodule MyAppWeb.BattleNetController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.BattleNet.Auth

  # https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/api/battlenet/authorize&scope=wow.profile&client_id=vxqv32fddxsy6cmk6259amtymbuzmfrq&response_type=code

  def authorize(conn, %{"code" => code}) when not is_nil(code) do

    {output, status} = case Auth.get_token(code) do
      {:ok, token} -> {token, 200}
      {:error, err} -> {err, 400}
    end

    conn
    |>put_status(status)
    |>Response.json(output)
  end

end
