defmodule MyApp.JWT do
  alias MyApp.Guardian
  
  # ~1 year
  defp tokenTTL(), do: {52, :weeks}

  def get_jwt(user, claims) do
    case Guardian.encode_and_sign(user, claims, ttl: tokenTTL()) do
      {:ok, token, _claims} -> {:ok, token}
      {:error, _token, _claims} -> {:error, "JWT error"}
    end
  end

end
