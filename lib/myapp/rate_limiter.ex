defmodule MyApp.RateLimiter do

  # map keys to integers to save memory
  def new_reply_key, do: 1
  def new_thread_key, do: 2

  @spec set_limit(String.t, integer, integer) :: {:ok, String.t}
  def set_limit(end_point, user_id, seconds) do
    key = "rl#{end_point}:#{user_id}"
    Cachex.set(:myapp, key, true, ttl: :timer.seconds(seconds))
    {:ok, "ok"}
  end

  @spec check_limit(String.t, integer) :: {:ok, String.t} | {:error, String.t}
  def check_limit(end_point, user_id) do
    key = "rl#{end_point}:#{user_id}"
    case Cachex.get(:myapp, key) do
      {:ok, _} -> {:error, "limit reached"}
      {:missing, _} -> {:ok, "ok"}
    end
  end

end
