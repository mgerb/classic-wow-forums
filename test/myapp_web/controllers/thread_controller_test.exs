defmodule MyAppWeb.ThreadControllerTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.TestHelpers

  test "insert new thread should fail" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    conn = post(new_conn, "/api/thread")
    body = conn |> response(400) |> Poison.decode!

    assert body["error"]["message"] == [
      %{"title" => "can't be blank"},
      %{"category_id" => "can't be blank"},
      %{"content" => "can't be blank"},
    ]
    
    conn = post(new_conn, "/api/thread", %{"title" => "t"})
    body = conn |> response(400) |> Poison.decode!
    assert body["error"]["message"] == [
      %{"category_id" => "can't be blank"},
      %{"content" => "can't be blank"},
    ]

    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1})
    body = conn |> response(400) |> Poison.decode!
    assert body["error"]["message"] == [%{"content" => "can't be blank"}]

    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 100000, "content" => "t"})
    body = conn |> response(400) |> Poison.decode!
    assert body["error"]["message"] == [%{"category_id" => "does not exist"}]
  end

  test "insert new thread should succeed" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1, "content" => "t"})
    body = conn |> response(200) |> Poison.decode!

    data = body["data"]
    assert data["user_id"] == user.id
    assert data["category_id"] == 1
    assert data["title"] == "t"
    assert data["content"] == "t"
  end

  # TODO: update thread / delete thread
end
