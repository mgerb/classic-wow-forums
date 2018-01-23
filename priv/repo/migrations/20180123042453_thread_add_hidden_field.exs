defmodule MyApp.Repo.Migrations.ThreadAddHiddenField do
  use Ecto.Migration
  import Ecto.Query

  def up do
    alter table(:thread) do
      add :hidden, :boolean
    end

    flush() 

    from(r in "thread",
      update: [set: [hidden: false]])
    |> MyApp.Repo.update_all([])
  end

  def down do
    alter table(:thread) do
      remove :hidden
    end
  end
end
