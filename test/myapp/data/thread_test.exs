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

  test "insert_thread: try to insert with no parameters" do
    assert insert_thread(%{}) == {:error,
    [%{title: "can't be blank"}, %{category_id: "can't be blank"},
     %{content: "can't be blank"}, %{user_id: "can't be blank"}]}
  end

  test "insert_thread: insert as invalid user" do
    assert insert_thread(new_thread(9238748)) == {:error, [%{user_id: "does not exist"}]}
  end

  test "insert_thread: insert as invalid category_id" do
    {:ok, user} = new_user()
    assert insert_thread(new_thread(user.id, 2342342343)) == {:error, [%{category_id: "does not exist"}]}
  end

  test "new thread should be inserted" do
    {:ok, user} = new_user()
    {:ok, thread} = insert_thread(new_thread(user.id))
    assert thread.title == "test title"
    assert thread.category_id == 1
    assert thread.user_id == user.id
    assert thread.content == "test content"
  end

  # TODO: update thread

end
