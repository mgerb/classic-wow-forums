defmodule MyAppWeb.PageControllerTest do
  use MyAppWeb.ConnCase, async: true

  test "index.html should be cached" do
    assert Cachex.get(:myapp, "index.html") == {:missing, nil}
    conn = build_conn() |> get("/lsakdjfl")
    {ok, _} = Cachex.get(:myapp, "index.html")
    assert ok == :ok
  end

end
