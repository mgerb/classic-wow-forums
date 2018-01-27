defmodule MyAppWeb.ThreadController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data
  alias MyApp.RateLimiter

  @spec insert(map, map) :: any
  def insert(conn, params) do
    user_id = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("id")

    # every 5 minutes user can submit new thread
    {output, status} = case RateLimiter.check_limit(RateLimiter.new_thread_key, user_id) do
      {:ok, _} ->

        {ok, data} = params
        |> Map.put("user_id",  user_id)
        |> Data.Thread.insert

        if ok == :ok do
          # apply rate limiter only after submitting new post
          RateLimiter.set_limit(RateLimiter.new_thread_key, user_id, 300)
        end

        {ok, data}
        |> Response.put_resp

      {:error, error} -> {error, 429}
    end

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

  @spec mod_update(map, map) :: any
  def mod_update(conn, params) do
    {:ok, _} = Data.Thread.mod_update(params)
    conn
    |> put_status(200)
    |> Response.json("ok")
  end

end
