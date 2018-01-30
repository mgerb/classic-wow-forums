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

import Ecto.Changeset
alias MyApp.Repo
alias MyApp.Data

defmodule Category do

  def get_seed() do
    get_classes()
    |> Enum.concat(get_realms())
    |> Enum.concat(get_other())
  end

  defp get_classes() do
    [
      %{"id" => 0, "category" => "class", "title" => "Druid"},
      %{"id" => 1, "category" => "class", "title" => "Rogue"},
      %{"id" => 2, "category" => "class", "title" => "Priest"},
      %{"id" => 3, "category" => "class", "title" => "Hunter"},
      %{"id" => 4, "category" => "class", "title" => "Shaman"},
      %{"id" => 5, "category" => "class", "title" => "Warrior"},
      %{"id" => 6, "category" => "class", "title" => "Mage"},
      %{"id" => 7, "category" => "class", "title" => "Paladin"},
      %{"id" => 8, "category" => "class", "title" => "Warlock"},
    ]
  end

  defp get_realms() do
    [
      %{"id" => 9, "category" => "realm", "title" => "Aegwynn"},
      %{"id" => 10, "category" => "realm", "title" => "Agamaggan"},
      %{"id" => 11, "category" => "realm", "title" => "Aggramar"},
      %{"id" => 12, "category" => "realm", "title" => "Akama"},
      %{"id" => 13, "category" => "realm", "title" => "Alleria"},
      %{"id" => 14, "category" => "realm", "title" => "Archimonde"},
      %{"id" => 15, "category" => "realm", "title" => "Argent Dawn"},
      %{"id" => 16, "category" => "realm", "title" => "Arthas"},
      %{"id" => 17, "category" => "realm", "title" => "Azgalor"},
      %{"id" => 18, "category" => "realm", "title" => "Azjol-Nerub"},
      %{"id" => 19, "category" => "realm", "title" => "Azshara"},
      %{"id" => 20, "category" => "realm", "title" => "Blackhand"},
      %{"id" => 21, "category" => "realm", "title" => "Blackrock"},
      %{"id" => 22, "category" => "realm", "title" => "Bleeding Hollow"},
      %{"id" => 23, "category" => "realm", "title" => "Bloodhoof"},
      %{"id" => 24, "category" => "realm", "title" => "Bloodscalp"},
      %{"id" => 25, "category" => "realm", "title" => "Bonechewer"},
      %{"id" => 26, "category" => "realm", "title" => "Boulderfist"},
      %{"id" => 27, "category" => "realm", "title" => "Bronzebeard"},
      %{"id" => 28, "category" => "realm", "title" => "Burning Blade"},
      %{"id" => 29, "category" => "realm", "title" => "Burning Legion"},
      %{"id" => 30, "category" => "realm", "title" => "Cenarion Circle"},
      %{"id" => 31, "category" => "realm", "title" => "Cenarius"},
      %{"id" => 32, "category" => "realm", "title" => "Cho'gall"},
      %{"id" => 33, "category" => "realm", "title" => "Chromaggus"},
      %{"id" => 34, "category" => "realm", "title" => "Crushridge"},
      %{"id" => 35, "category" => "realm", "title" => "Daggerspine"},
      %{"id" => 36, "category" => "realm", "title" => "Dalaran"},
      %{"id" => 37, "category" => "realm", "title" => "Dark Iron"},
      %{"id" => 38, "category" => "realm", "title" => "Darkspear"},
      %{"id" => 39, "category" => "realm", "title" => "Deathwing"},
      %{"id" => 40, "category" => "realm", "title" => "Destromath"},
      %{"id" => 41, "category" => "realm", "title" => "Dethecus"},
      %{"id" => 42, "category" => "realm", "title" => "Detheroc"},
      %{"id" => 43, "category" => "realm", "title" => "Doomhammer"},
      %{"id" => 44, "category" => "realm", "title" => "Draenor"},
      %{"id" => 45, "category" => "realm", "title" => "Dragonblight"},
      %{"id" => 46, "category" => "realm", "title" => "Dragonmaw"},
      %{"id" => 47, "category" => "realm", "title" => "Draka"},
      %{"id" => 48, "category" => "realm", "title" => "Dunemaul"},
      %{"id" => 49, "category" => "realm", "title" => "Durotan"},
      %{"id" => 50, "category" => "realm", "title" => "Earthen Ring"},
      %{"id" => 51, "category" => "realm", "title" => "Eldre'Thalas"},
      %{"id" => 52, "category" => "realm", "title" => "Elune"},
      %{"id" => 53, "category" => "realm", "title" => "Emerald Dream"},
      %{"id" => 54, "category" => "realm", "title" => "Eonar"},
      %{"id" => 55, "category" => "realm", "title" => "Eredar"},
      %{"id" => 56, "category" => "realm", "title" => "Feathermoon"},
      %{"id" => 57, "category" => "realm", "title" => "Firetree"},
      %{"id" => 58, "category" => "realm", "title" => "Frostmane"},
      %{"id" => 59, "category" => "realm", "title" => "Frostmourne"},
      %{"id" => 60, "category" => "realm", "title" => "Frostwolf"},
      %{"id" => 61, "category" => "realm", "title" => "Garona"},
      %{"id" => 62, "category" => "realm", "title" => "Gilneas"},
      %{"id" => 63, "category" => "realm", "title" => "Greymane"},
      %{"id" => 64, "category" => "realm", "title" => "Gorefiend"},
      %{"id" => 65, "category" => "realm", "title" => "Gorgonnash"},
      %{"id" => 66, "category" => "realm", "title" => "Gurubashi"},
      %{"id" => 67, "category" => "realm", "title" => "Hellscream"},
      %{"id" => 68, "category" => "realm", "title" => "Hyjal"},
      %{"id" => 69, "category" => "realm", "title" => "Icecrown"},
      %{"id" => 70, "category" => "realm", "title" => "Illidan"},
      %{"id" => 71, "category" => "realm", "title" => "Kargath"},
      %{"id" => 72, "category" => "realm", "title" => "Kalecgos"},
      %{"id" => 73, "category" => "realm", "title" => "Kael'thas"},
      %{"id" => 74, "category" => "realm", "title" => "Kel'Thuzad"},
      %{"id" => 75, "category" => "realm", "title" => "Khadgar"},
      %{"id" => 76, "category" => "realm", "title" => "Khaz'goroth"},
      %{"id" => 77, "category" => "realm", "title" => "Kil'Jaeden"},
      %{"id" => 78, "category" => "realm", "title" => "Kilrogg"},
      %{"id" => 79, "category" => "realm", "title" => "Kirin Tor"},
      %{"id" => 80, "category" => "realm", "title" => "Laughing Skull"},
      %{"id" => 81, "category" => "realm", "title" => "Lightbringer"},
      %{"id" => 82, "category" => "realm", "title" => "Lightning's Blade"},
      %{"id" => 83, "category" => "realm", "title" => "Lightninghoof"},
      %{"id" => 84, "category" => "realm", "title" => "Llane"},
      %{"id" => 85, "category" => "realm", "title" => "Lothar"},
      %{"id" => 86, "category" => "realm", "title" => "Magtheridon"},
      %{"id" => 87, "category" => "realm", "title" => "Maelstrom"},
      %{"id" => 88, "category" => "realm", "title" => "Mal'Ganis"},
      %{"id" => 89, "category" => "realm", "title" => "Malfurion"},
      %{"id" => 90, "category" => "realm", "title" => "Malygos"},
      %{"id" => 91, "category" => "realm", "title" => "Mannoroth"},
      %{"id" => 92, "category" => "realm", "title" => "Medivh"},
      %{"id" => 93, "category" => "realm", "title" => "Moonrunner"},
      %{"id" => 94, "category" => "realm", "title" => "Nathrezim"},
      %{"id" => 95, "category" => "realm", "title" => "Ner'zhul"},
      %{"id" => 96, "category" => "realm", "title" => "Perenolde"},
      %{"id" => 97, "category" => "realm", "title" => "Proudmoore"},
      %{"id" => 98, "category" => "realm", "title" => "Sargeras"},
      %{"id" => 99, "category" => "realm", "title" => "Scarlet Crusade"},
      %{"id" => 100, "category" => "realm", "title" => "Shadow Council"},
      %{"id" => 101, "category" => "realm", "title" => "Shadow Moon"},
      %{"id" => 102, "category" => "realm", "title" => "Shadowsong"},
      %{"id" => 103, "category" => "realm", "title" => "Shattered Hand"},
      %{"id" => 104, "category" => "realm", "title" => "Silver Hand"},
      %{"id" => 105, "category" => "realm", "title" => "Silvermoon"},
      %{"id" => 106, "category" => "realm", "title" => "Skullcrusher"},
      %{"id" => 107, "category" => "realm", "title" => "Skywall"},
      %{"id" => 108, "category" => "realm", "title" => "Smolderthorn"},
      %{"id" => 109, "category" => "realm", "title" => "Spinebreaker"},
      %{"id" => 110, "category" => "realm", "title" => "Spirestone"},
      %{"id" => 111, "category" => "realm", "title" => "Staghelm"},
      %{"id" => 112, "category" => "realm", "title" => "Stonemaul"},
      %{"id" => 113, "category" => "realm", "title" => "Stormrage"},
      %{"id" => 114, "category" => "realm", "title" => "Stormreaver"},
      %{"id" => 115, "category" => "realm", "title" => "Stormscale"},
      %{"id" => 116, "category" => "realm", "title" => "Suramar"},
      %{"id" => 117, "category" => "realm", "title" => "Terenas"},
      %{"id" => 119, "category" => "realm", "title" => "Thunderhorn"},
      %{"id" => 120, "category" => "realm", "title" => "Thunderlord"},
      %{"id" => 121, "category" => "realm", "title" => "Tichondrius"},
      %{"id" => 122, "category" => "realm", "title" => "Twisting Nether"},
      %{"id" => 123, "category" => "realm", "title" => "Uldum"},
      %{"id" => 124, "category" => "realm", "title" => "Uther"},
      %{"id" => 125, "category" => "realm", "title" => "Ursin"},
      %{"id" => 126, "category" => "realm", "title" => "Warsong"},
      %{"id" => 127, "category" => "realm", "title" => "Whisperwind"},
      %{"id" => 128, "category" => "realm", "title" => "Wildhammer"},
      %{"id" => 129, "category" => "realm", "title" => "Windrunner"},
      %{"id" => 130, "category" => "realm", "title" => "Zul'jin"},

      # additional realms
      %{"id" => 143, "category" => "realm", "title" => "Sentinels"},
    ]
  end

  defp get_other() do
    [
      %{"id" => 131, "category" => "other", "title" => "Off-topic"},
      %{"id" => 132, "category" => "other", "title" => "Guild Recruitment"},
      %{"id" => 133, "category" => "other", "title" => "General Discussion"},
      %{"id" => 134, "category" => "other", "title" => "Suggestions"},
      %{"id" => 135, "category" => "other", "title" => "Role-Playing"},
      %{"id" => 136, "category" => "other", "title" => "Raid and Dungeon Discussion"},
      %{"id" => 137, "category" => "other", "title" => "Site Suggestions"},
      %{"id" => 138, "category" => "other", "title" => "UI & Macros Forum"},
      %{"id" => 139, "category" => "other", "title" => "Bug Report Forum"},
      %{"id" => 140, "category" => "other", "title" => "Professions"},
      %{"id" => 141, "category" => "other", "title" => "PvP Discussion"},
      %{"id" => 142, "category" => "other", "title" => "Quest Discussion"},
    ]
  end

end

# insert if not exists
Enum.each(Category.get_seed(), fn(cat) ->
  Repo.transaction(fn ->
    exists = Repo.get_by(Data.Category, %{id: Map.get(cat, "id")}) != nil

    if !exists do
      %Data.Category{}
      |> cast(cat, [:id, :category, :title])
      |> Repo.insert!
    end
  end)
end)

# insert admin user
accounts = Application.get_env(:myapp, :admin_accounts) || []

Enum.each(accounts, fn (user) ->
  Repo.transaction(fn ->
    exists = Repo.get_by(Data.User, %{username: Map.get(user, "username")}) != nil

    if !exists do
      MyApp.Data.User.insert_admin_user(user)
    end

  end)
end)
