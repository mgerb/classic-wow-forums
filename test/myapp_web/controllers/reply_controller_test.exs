defmodule MyAppWeb.ReplyControllerTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.TestHelpers

  test "insert new reply should fail" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    conn = post(new_conn, "/api/reply", %{"thread_id" => 1})
    body = conn |> response(400) |> Poison.decode!
    assert body == %{"error" => %{"message" => "thread locked", "status" => 400}}
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
    conn = get(new_conn, "/api/thread?category_id=1")
    body = conn |> response(200) |> Poison.decode!

    data = Enum.at(body["data"], 0)
    assert data["last_reply_id"] == user_id
    assert data["reply_count"] == 1
  end

  test "user replies should be rate limited" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    # insert new thread first
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1})
    body = conn |> response(200) |> Poison.decode!
    thread_id = body["data"]["id"]

    post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => thread_id})

    # post another reply
    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => body["data"]["id"]})
    body = conn |> response(429) |> Poison.decode!

    assert body == %{"error" => %{"message" => "limit reached", "status" => 429}}

    # clear cache
    Cachex.clear(:myapp)

    # new reply should work
    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => thread_id})
    conn |> response(200) |> Poison.decode!
  end

  test "user update reply" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    # insert new thread first
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1})
    body = conn |> response(200) |> Poison.decode!
    thread_id = body["data"]["id"]

    # insert new reply
    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => thread_id})
    body = conn |> response(200) |> Poison.decode!
    reply_id = body["data"]["id"]

    # should fail
    conn = put(new_conn, "/api/reply", %{"content" => "new edited content"})
    body = conn |> response(400) |> Poison.decode!
    assert body == %{"error" => %{"message" => "Invalid reply", "status" => 400}}

    # should succeed
    conn = put(new_conn, "/api/reply", %{"content" => "new edited content", "id" => reply_id})
    body = conn |> response(200) |> Poison.decode!
    assert body == %{"data" => "ok"}
  end

  test "mod update reply" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    # insert new thread first
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1})
    body = conn |> response(200) |> Poison.decode!
    thread_id = body["data"]["id"]

    # insert new reply
    conn = post(new_conn, "/api/reply", %{"content" => "c", "thread_id" => thread_id})
    body = conn |> response(200) |> Poison.decode!
    reply_id = body["data"]["id"]

    # mod update reply should fail - unauthorized
    conn = put(new_conn, "/api/reply/mod", %{"content" => "c", "id" => reply_id})
    body = conn |> response(401) |> Poison.decode!
    assert body == %{"error" => %{"message" => "unauthorized", "status" => 401}}
  end

end
