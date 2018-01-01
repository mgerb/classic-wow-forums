defmodule MyApp.Auth.ErrorHandler do
  import Plug.Conn
  alias MyAppWeb.Response

  def auth_error(conn, {type, _reason}, _opts) do
    conn
    |> put_status(401)
    |> Response.json(to_string(type))
  end
end
