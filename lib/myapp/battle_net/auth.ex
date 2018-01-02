defmodule MyApp.BattleNet.Auth do
  alias MyApp.BattleNet.User
  alias MyApp.JWT

  def token_uri, do: "https://us.battle.net/oauth/token"

  @spec get_access_token(String.t) :: {:ok, String.t} | {:error, String.t}
  def get_access_token(code) do
    client_id = Application.get_env(:myapp, :bnet_client_id)
    client_secret = Application.get_env(:myapp, :bnet_client_secret)
    redirect_uri = Application.get_env(:myapp, :bnet_redirect_uri)

    req_options = [hackney: [basic_auth: {client_id, client_secret}]]

    HTTPoison.request(:post, token_uri, get_req_body(code), [], req_options)
    |> parse_body
    |> parse_token
  end

  defp parse_body({:error, err}), do: {:error, err}
  defp parse_body({:ok, %HTTPoison.Response{body: body}}), do: Poison.decode(body)

  defp parse_token({:ok, %{"access_token" => token}}), do: {:ok, token}
  defp parse_token({:ok, %{"error" => error}}), do: {:error, error}
  defp parse_token({:error, err}), do: {:error, "Authentication error"}

  @spec get_req_body(String.t) :: tuple
  defp get_req_body(code) do
    redirect_uri = Application.get_env(:myapp, :bnet_redirect_uri)
    {:form, [
      grant_type: "authorization_code",
      scope: "wow.profile",
      code: code,
      redirect_uri: redirect_uri,
    ]}
  end

end

