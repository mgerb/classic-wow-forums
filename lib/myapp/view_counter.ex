defmodule MyApp.ViewCounter do
  alias MyApp.Data

  # cache end points for 5 minutes based on the browser fingerprint

  @spec thread_view_count(String.t, integer) :: {:error, String.t} | {any, boolean}
  def thread_view_count(fingerprint, thread_id) do

    key = "#{fingerprint}:#{thread_id}"

    case Cachex.get(:myapp, key) do
      {:ok, _} -> {:error, "Already viewed."}
      {:missing, _} ->
        {1, nil} = Data.Thread.update_view_count(thread_id)
        Cachex.set(:myapp, key, true, ttl: :timer.minutes(5))
    end

  end

end
