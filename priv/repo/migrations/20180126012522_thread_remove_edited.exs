defmodule MyApp.Repo.Migrations.ThreadRemoveEdited do
  use Ecto.Migration

  def change do
    alter table(:thread) do
      remove :edited
    end
  end

end
