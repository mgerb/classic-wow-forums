defmodule MyApp.Repo.Migrations.ThreadCategoryForeignKey do
  use Ecto.Migration

  def change do
    alter table(:thread) do
      modify :category_id, references(:category)
    end
  end
end
