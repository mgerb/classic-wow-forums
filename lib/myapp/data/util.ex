defmodule MyApp.Data.Util do

  @spec map_changeset(map) :: map
  def map_changeset(changeset) do
    Enum.map(changeset.errors, fn {key, val} ->
      %{key => elem(val, 0)}
    end)
  end

  @spec process_insert_or_update({atom, map}) :: {:ok, map} | {:error, map}
  def process_insert_or_update({:error, changeset}), do: {:error, map_changeset(changeset)}
  def process_insert_or_update({:ok, data}), do: {:ok, data}

end
