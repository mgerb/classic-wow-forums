defmodule MyAppWeb.ThreadControllerTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.TestHelpers

  test "insert new thread should fail" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)

    {:badmatch, {:error, data}} = catch_error(post(new_conn, "/api/thread"))

    assert data.errors == [
      title: {"can't be blank", [validation: :required]},
      category_id: {"can't be blank", [validation: :required]},
    ]
    
    {:badmatch, {:error, data}} = catch_error(post(new_conn, "/api/thread", %{"title" => "t"}))

    assert data.errors == [
      category_id: {"can't be blank", [validation: :required]},
    ]

    {:badmatch, {:error, data}} = catch_error(post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 100000}))

    assert data.errors == [category_id: {"does not exist", []}]
  end

  test "insert new thread should succeed" do
    {:ok, user} = new_user()
    new_conn = build_conn()
    |> put_req_header("authorization", "Bearer " <> user.token)
    conn = post(new_conn, "/api/thread", %{"title" => "t", "category_id" => 1, "content" => "t"})
    body = conn |> response(200) |> Poison.decode!

    data = body["data"]
    # assert body == "test"
    assert data["user_id"] == user.id
    assert data["category_id"] == 1
    assert data["title"] == "t"
  end

  # TODO: update thread / delete thread
end
