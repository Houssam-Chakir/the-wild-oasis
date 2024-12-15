import supabase from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  console.log('newCabin: ', newCabin);
  const hasImagePath = newCabin.image?.startsWith?.(import.meta.env.VITE_SUPABASE_URL)
  // https://hwkrsremozkuuwtawmud.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  //create image url
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  const imagePath = hasImagePath ? newCabin.image : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;

  // Create / Edit cabin
  let query = supabase.from("cabins");
  // Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  // Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id).select();

  const { data, error } = await query.select().single();
  // upload image
  const { error: storageError } = await supabase.storage.from("cabin-images").upload(imageName, newCabin.image);
  //delete cabin IF error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded and the cabin was not created");
  }

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}
