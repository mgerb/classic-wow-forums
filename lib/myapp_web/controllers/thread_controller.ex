defmodule MyAppWeb.ThreadController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data

  @spec insert(map, map) :: any
  def insert(conn, params) do
    user_id = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("id")

    {output, status} = params
      |> Map.put("user_id",  user_id)
      |> Data.Thread.insert_thread
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end

  @spec update(map, map) :: any
  def update(conn, params) do
    user_id = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("id")

    {output, status} = params
      |> Map.put("user_id",  user_id)
      |> Data.Thread.update_thread
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end
  
end
