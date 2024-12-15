import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { Textarea } from "../../ui/Textarea";
import { createEditCabin } from "../../services/apiCabins";

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child: {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New Cabin created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (error) => {
      toast.error("Error creating new cabin: " + error.message);
    },
  });

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin Edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (error) => {
      toast.error("Error creating new cabin: " + error.message);
    },
  });

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    // console.log('data: ', data);
    const image = typeof data.image === 'string' ? data.image : data.image[0]

    if (isEditSession) editCabin({newCabinData: {...data, image}, id: editId});
    else createCabin({ ...data, image: data.image[0] });
  }

  function onError(errors) {
    console.log("errors: ", errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow>
        <Label htmlFor='name'>Cabin namey</Label>
        <Input type='text' id='name' {...register("name", { required: "this field is required" })} />
      </FormRow>

      <FormRow>
        <Label htmlFor='maxCapacity'>Maximum capacity</Label>
        <Input
          type='number'
          id='maxCapacity'
          {...register("maxCapacity", {
            required: "this field is required",
            min: {
              value: 1,
              message: "Capacity should be atleast 1",
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor='regularPrice'>Regular price</Label>
        <Input type='number' id='regularPrice' {...register("regularPrice", { required: "this field is required" })} />
      </FormRow>

      <FormRow>
        <Label htmlFor='discount'>Discount</Label>
        <Input
          type='number'
          id='discount'
          defaultValue={0}
          {...register("discount", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor='description'>Description</Label>
        <Textarea type='number' id='description' {...register("description", { required: "this field is required" })} />
      </FormRow>

      <FormRow>
        <Label htmlFor='image'>Cabin photo</Label>
        <FileInput id='image' accept='image/*' {...register("image", { required: isEditSession ? false : "this field is required" })} />
      </FormRow>

      <FormRow>
        <Button variation='secondary' type='reset' disabled={isWorking}>
          Reset
        </Button>
        <Button disabled={isWorking}> {isEditSession ? "Edit Cabin" : "Create new cabin"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
