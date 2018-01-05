defmodule MyApp.BattleNet.AuthTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.BattleNet.Auth

  test "get access token from battle net should error out" do
    assert get_access_token("123") == {:error, "invalid_request"}
  end

end
