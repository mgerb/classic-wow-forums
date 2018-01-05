defmodule MyAppWeb.UserControllerTest do
  use MyAppWeb.ConnCase, async: true

  test "get user index should return unauthorized" do
    conn = 
    build_conn()
    |> get("/api/user")

    body = conn |> response(401) |> Poison.decode!

    assert body["error"]["message"] == "unauthorized"
  end

end
