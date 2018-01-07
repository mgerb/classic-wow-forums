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

  defp get_realms() do
    [
      "Aegwynn",
      "Agamaggan",
      "Aggramar",
      "Akama",
      "Alleria",
      "Archimonde",
      "Argent Dawn",
      "Arthas",
      "Azgalor",
      "Azjol-Nerub",
      "Azshara",
      "Blackhand",
      "Blackrock",
      "Bleeding Hollow",
      "Bloodhoof",
      "Bloodscalp",
      "Bonechewer",
      "Boulderfist",
      "Bronzebeard",
      "Burning Blade",
      "Burning Legion",
      "Cenarion Circle",
      "Cenarius",
      "Cho'gall",
      "Chromaggus",
      "Crushridge",
      "Daggerspine",
      "Dalaran",
      "Dark Iron",
      "Darkspear",
      "Deathwing",
      "Destromath",
      "Dethecus",
      "Detheroc",
      "Doomhammer",
      "Draenor",
      "Dragonblight",
      "Dragonmaw",
      "Draka",
      "Dunemaul",
      "Durotan",
      "Earthen Ring",
      "Eldre'Thalas",
      "Elune",
      "Emerald Dream",
      "Eonar",
      "Eredar",
      "Feathermoon",
      "Firetree",
      "Frostmane",
      "Frostmourne",
      "Frostwolf",
      "Garona",
      "Gilneas",
      "Greymane",
      "Gorefiend",
      "Gorgonnash",
      "Gurubashi",
      "Hellscream",
      "Hyjal",
      "Icecrown",
      "Illidan",
      "Kargath",
      "Kalecgos",
      "Kael'thas",
      "Kel'Thuzad",
      "Khadgar",
      "Khaz'goroth",
      "Kil'Jaeden",
      "Kilrogg",
      "Kirin Tor",
      "Laughing Skull",
      "Lightbringer",
      "Lightning's Blade",
      "Lightninghoof",
      "Llane",
      "Lothar",
      "Magtheridon",
      "Maelstrom",
      "Mal'Ganis",
      "Malfurion",
      "Malygos",
      "Mannoroth",
      "Medivh",
      "Moonrunner",
      "Nathrezim",
      "Ner'zhul",
      "Perenolde",
      "Proudmoore",
      "Sargeras",
      "Scarlet Crusade",
      "Shadow Council",
      "Shadow Moon",
      "Shadowsong",
      "Shattered Hand",
      "Silver Hand",
      "Silvermoon",
      "Skullcrusher",
      "Skywall",
      "Smolderthorn",
      "Spinebreaker",
      "Spirestone",
      "Staghelm",
      "Stonemaul",
      "Stormrage",
      "Stormreaver",
      "Stormscale",
      "Suramar",
      "Terenas",
      "Test",
      "Thunderhorn",
      "Thunderlord",
      "Tichondrius",
      "Twisting Nether",
      "Uldum",
      "Uther",
      "Ursin",
      "Warsong",
      "Whisperwind",
      "Wildhammer",
      "Windrunner",
      "Zul'jin",
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
