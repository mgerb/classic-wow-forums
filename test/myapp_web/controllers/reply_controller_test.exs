defmodule MyAppWeb.ReplyControllerTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.TestHelpers

  test "insert new reply should fail" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    conn = post(new_conn, "/api/reply")
    body = conn |> response(400) |> Poison.decode!

    assert body["error"]["message"] == [
      %{"thread_id" => "can't be blank"},
      %{"content" => "can't be blank"},
    ]

    conn = post(new_conn, "/api/reply", %{"content" => "t"})
    body = conn |> response(400) |> Poison.decode!
    assert body["error"]["message"] == [%{"thread_id" => "can't be blank"}]

    conn = post(new_conn, "/api/reply", %{"content" => "t", "thread_id" => 1})
    body = conn |> response(400) |> Poison.decode!
    assert body["error"]["message"] == [%{"thread_id" => "does not exist"}]
  end

  test "insert new reply should succeed" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    # insert new thread first
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1, "content" => "t"})
    body = conn |> response(200) |> Poison.decode!

    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => body["data"]["id"]})
    body = conn |> response(200) |> Poison.decode!

    data = body["data"]
    user_id = data["user_id"]

    assert data["content"] == "c"
    assert data["edited"] == false
    assert data["quote"] == false

    # make sure thread reply count and last reply id are updated
    conn = get(new_conn, "/api/thread?category_id=1")
    body = conn |> response(200) |> Poison.decode!

    data = Enum.at(body["data"], 0)
    assert data["reply_count"] == 1
    assert data["last_reply_id"] == user_id
  end

end
