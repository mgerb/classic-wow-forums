defmodule MyApp.Data.UserTest do
  use MyAppWeb.ConnCase, async: true
  import MyApp.Data.User
  import MyApp.Data.TestHelpers

  test "user is inserted into database" do
    {:ok, user} = new_user()
    assert user.access_token ==  "test_token"
    assert user.battle_net_id == 1
    assert user.battletag == "mgerb42"
    assert user.id == user.id
    assert user.permissions == "user"
    assert user.token =~ ~r/(?).(?).(?)/
  end

  test "user's battletag is updated" do
    {:ok, user} = new_user()

    # update user battletag
    user = user
    |> atom_key_to_string()
    |> Map.put("battletag", "mgerb")

    {:ok, user} = upsert_user(user)
    assert user == %{
      access_token: "test_token",
      battle_net_id: 1,
      battletag: "mgerb",
      id: user.id,
      permissions: "user",
    }

    # call upsert again with same battletag
    {:ok, user} = user
    |> atom_key_to_string()
    |> upsert_user()

    assert user == %{
      access_token: "test_token",
      battle_net_id: 1,
      battletag: "mgerb",
      id: user.id,
      permissions: "user",
      character_avatar: nil,
      character_class: nil,
      character_guild: nil,
      character_name: nil,
      character_realm: nil,
    }

  end

end
