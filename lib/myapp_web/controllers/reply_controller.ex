defmodule MyAppWeb.ReplyController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data
  alias MyApp.RateLimiter

  @spec insert(map, map) :: any
  def insert(conn, params) do
    user_id = conn
    |> MyApp.Guardian.Plug.current_claims
    |> Map.get("id")

    {output, status} = case RateLimiter.check_limit(RateLimiter.new_reply_key, user_id) do
      {:ok, _} ->
        {ok, data} = params
        |> Map.put("user_id",  user_id)
        |> Data.Reply.insert

        if ok == :ok do
          # apply rate limiter only after submitting new reply
          RateLimiter.set_limit(RateLimiter.new_reply_key, user_id, 60)
        end

        {ok, data}
        |> Response.put_resp

      {:error, error} -> {error, 429}
    end

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
      |> Data.Reply.user_update
      |> Response.put_resp

    conn
    |> put_status(status)
    |> Response.json(output)
  end

  @spec mod_update(map, map) :: any
  def mod_update(conn, params) do
    {:ok, _} = Data.Reply.mod_update(params)
    conn
    |> put_status(200)
    |> Response.json("ok")
  end
  
end
