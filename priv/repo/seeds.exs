# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     MyApp.Repo.insert!(%MyApp.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias MyApp.Repo
alias MyApp.Data

defmodule Category do

  def get_seed() do
    map_categories("class", get_classes())
    |> Enum.concat(map_categories("realm", get_realms()))
    |> Enum.concat(map_categories("other", get_other()))
  end

  defp map_categories(category, titles) do
    titles
    |> Enum.map(fn (t) -> %{category: category, title: t} end)
  end

  defp get_classes() do
    [
      "Druid",
      "Rogue",
      "Priest",
      "Hunter",
      "Shaman",
      "Warrior",
      "Mage",
      "Paladin",
      "Warlock",
    ]
  end

  # TODO: add all realms
  defp get_realms() do
    [
      "Stonemaul",
    ]
  end

  defp get_other() do
    [
      "Off-Topic",
      "Guild Recruitment",
      "General Discussion",
      "Suggestions",
      "Role-Playing",
      "Raid and Dungeon Discussion",
    ]
  end

end

Repo.insert_all(Data.Category, Category.get_seed())
