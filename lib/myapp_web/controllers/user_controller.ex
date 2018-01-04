defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response

  @spec index(map, map) :: any
  def index(conn, _params) do
    conn
    |> Response.json("Auth works!")
  end
  
end
