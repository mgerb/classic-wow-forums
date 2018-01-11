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
      |> Data.Thread.insert
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
      |> Data.Thread.user_update
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end
  
  @spec get_collection(map, map) :: any
  def get_collection(conn, params) do

    {output, status} = params["category_id"]
      |> Data.Thread.get_collection
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end

  @spec get(map, map) :: any
  def get(conn, params) do

    fingerprint = get_req_header(conn, "fp")
    thread_id = params["id"]

    spawn fn ->
      MyApp.ViewCounter.thread_view_count(fingerprint, thread_id)
    end

    {output, status} = thread_id
      |> Data.Thread.get
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end

end
