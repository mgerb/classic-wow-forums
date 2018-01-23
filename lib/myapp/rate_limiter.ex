defmodule MyApp.RateLimiter do

  # map keys to integers to save memory
  def new_reply_key, do: 1
  def new_thread_key, do: 2

  @spec limit(String.t, integer, integer) :: {:ok, String.t} | {:error, String.t}
  def limit(end_point, user_id, seconds) do
    key = "rl#{end_point}:#{user_id}"
    case Cachex.get(:myapp, key) do
      {:missing, _} ->
        Cachex.set(:myapp, key, true, ttl: :timer.seconds(seconds))
        {:ok, "ok"}
      {:ok, _} -> {:error, "limit reached"}
    end
  end

end
