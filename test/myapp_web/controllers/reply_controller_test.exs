defmodule MyAppWeb.ReplyControllerTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.TestHelpers

  test "insert new reply should fail" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    {:badmatch, {:error, data}} = conn = catch_error(post(new_conn, "/api/reply"))
    assert data == [%{thread_id: "can't be blank"}, %{content: "can't be blank"}]

    {:badmatch, {:error, data}} = conn = catch_error(post(new_conn, "/api/reply", %{"content" => "t"}))
    assert data == [%{thread_id: "can't be blank"}]

    {:badmatch, {:error, data}} = conn = catch_error(post(new_conn, "/api/reply",  %{"content" => "t", "thread_id" => 1}))
    assert data == [%{thread_id: "does not exist"}]
  end

  test "insert new reply should succeed" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    # insert new thread first
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1})
    body = conn |> response(200) |> Poison.decode!

    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => body["data"]["id"]})
    body = conn |> response(200) |> Poison.decode!

    data = body["data"]
    user_id = data["user_id"]

    assert data["content"] == "c"
    assert data["edited"] == false
    assert data["quote_id"] == nil

    # make sure thread reply count and last reply id are updated
    # conn = get(new_conn, "/api/thread?category_id=1")
    # body = conn |> response(200) |> Poison.decode!

    # assert Enum.at(body["data"], 0) == "ok"
  end

end
