defmodule MyApp.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :battle_net_id, :integer
      add :battletag, :string, size: 50
      add :permissions, :string
      add :character_guild, :string, size: 50
      add :character_name, :string, size: 50
      add :character_class, :string, size: 15
      add :character_realm, :string, size: 50
      add :character_avatar, :string, size: 20

      # for admin purposes
      add :username, :string
      add :password, :string
      timestamps()
    end

    create unique_index(:user, [:battle_net_id])
  end
end
