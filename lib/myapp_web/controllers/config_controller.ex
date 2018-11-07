defmodule MyAppWeb.ConfigController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data

  def get_config(conn, _params) do
    output = %{
      "client_id": Application.get_env(:myapp, :bnet_client_id),
      "redirect_uri": Application.get_env(:myapp, :bnet_redirect_uri),
    }
    conn
    |> put_status(200)
    |> Response.json(output)
  end
end
