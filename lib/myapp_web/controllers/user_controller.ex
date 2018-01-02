defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response

  @spec index(map, map) :: any
  def index(conn, params) do
    IO.inspect(conn)
    IO.inspect(params)
    conn
    |> Response.json("Auth works!")
  end
  
end
