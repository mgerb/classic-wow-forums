defmodule MyApp.Data.ThreadTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.Thread
  import MyApp.Data.TestHelpers

  defp new_thread(userID, category_id \\ 1) do
    %{
      "title" => "test title",
      "category_id" => category_id,
      "content" => "test content",
      "user_id" => userID,
    }
  end

  test "insert: try to insert with no parameters" do
    {error, _} = catch_error(insert(%{}))
    assert error == :badmatch
  end

  test "insert: insert as invalid user" do
    {:badmatch, {:error, data}} = catch_error(insert(new_thread(9238748)))
    assert data.errors == [user_id: {"does not exist", []}]
  end

  test "insert: insert as invalid category_id" do
    {:ok, user} = new_user()
    {error, _} = catch_error(insert(new_thread(user.id, 2342342343)))
    assert error == :badmatch
  end

  test "new thread should be inserted" do
    {:ok, user} = new_user()
    {:ok, thread} = insert(new_thread(user.id))
    assert thread.title == "test title"
    assert thread.category_id == 1
    assert thread.user_id == user.id
  end

  # TODO: update thread

end
