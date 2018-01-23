defmodule MyApp.Repo.Migrations.ReplyAddHiddenField do
  use Ecto.Migration
  import Ecto.Query

  def up do
    alter table(:reply) do
      add :hidden, :boolean
    end

    flush() 

    from(r in "reply",
      update: [set: [hidden: false]])
    |> MyApp.Repo.update_all([])
  end

  def down do
    alter table(:reply) do
      remove :hidden
    end
  end
end
