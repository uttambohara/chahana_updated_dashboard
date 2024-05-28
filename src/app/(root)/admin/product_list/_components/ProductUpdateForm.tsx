"use client";

import FileUploadImage from "@/components/fileUpload/FileUploadImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadImage } from "@/providers/upload-image-provider";
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import { CheckCheck, FileCheck, Loader, Plus, Trash, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { FormSchema } from "./ProductForm";
import ProductFormCategorySubCategoryComponent from "./ProductFormCategorySubCategoryComponent";
import ProductFormColorComponent from "./ProductFormColorComponent";
import ProductFormSizesComponent from "./ProductFormSizesComponent";
import ProductImageUploadImgList from "./ProductImageUploadImgList";
import { ChangeEvent, useState } from "react";
import { useCreateProduct } from "@/providers/create-product-provider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductUpdateFormProps {
  paramProductAlreadyExistCaseOfUpdate?: number | null | undefined;
  isCreating: boolean;
  isDraft: boolean;
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
  user_id?: string;
  categories: CategoryWithSubCategory;
  subCategories: Tables<"sub_category">[] | null;
  sizes: Tables<"sizes">[] | null;
  colors: Tables<"color">[] | null;
  form: UseFormReturn<
    {
      name: string;
      description: string;
      discountable: boolean;
      material: string;
      salesPrice: number;
      length?: number | undefined;
      height?: number | undefined;
      width?: number | undefined;
      discount?: number | undefined;
      weight?: number | undefined;
    },
    any,
    undefined
  >;
  onSubmit: (values: FormSchema) => Promise<void>;
}

export default function ProductUpdateForm({
  form,
  categories,
  subCategories,
  sizes,
  colors,
  onSubmit,
  isCreating,
  paramProductAlreadyExistCaseOfUpdate,
  isDraft,
}: ProductUpdateFormProps) {
  const [variantData, setVariantData] = useState({
    quantity: 0,
    color_id: "",
    color_sku: "",
    size_id: "",
    size_sku: "",
  });
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { state: ImageState, dispatch: ImageDispatch } = useUploadImage();
  const { state: VariantState, dispatch: VariantDispatch } = useCreateProduct();

  const handleCreateButtonClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  function handleVariantSubmit() {
    VariantDispatch({ type: "CREATE_VARIANT", payload: { ...variantData } });
    setVariantData({
      color_id: "",
      color_sku: "",
      size_id: "",
      size_sku: "",
      quantity: 0,
    });
    setSubmitted((prev) => [...prev, VariantState.selectedVariantId]);
    setIsFormVisible(false);
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setVariantData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  function dispatchInitialVariant() {
    VariantDispatch({ type: "INITIALIZE_VARIANT", payload: {} });
  }

  function dispatchSetColor(color: Tables<"color">) {
    VariantDispatch({ type: "SET_COLOR", payload: { color } });
  }
  function dispatchSetSize(size: Tables<"sizes">) {
    VariantDispatch({ type: "SET_SIZE", payload: { size } });
  }

  return (
    <Card className="border-none mx-auto relative">
      <h2 className="border-b py-8 text-2xl">Update product</h2>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-4"
          >
            <div className="grid grid-cols-[30%_1fr] gap-x-6 border-b p-[2rem]">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline mb-1">
                  General information*
                </div>
                <p className="text-muted-foreground text-sm leading-8">
                  From here you can edit details like name, SKU, material,
                  quantity, and description.
                </p>
                <p className="text-muted-foreground text-sm leading-8 mt-4">
                  {" "}
                  Turn on discountable to make this product elgible for global
                  discount,
                </p>
              </div>
              <div className="space-y-4 p-2">
                <div>
                  <div className="flex flex-col items-center gap-x-[1.5rem] md:flex-row">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-[100%]">
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter product name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-x-[1.5rem]">
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Material*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/100% cotton"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            {...field}
                            className="min-h-[140px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountable"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <h2 className="font-semibold mb-3">Discountable*</h2>
                        <FormControl>
                          <div className="flex md:justify-between flex-col gap-2 md:flex-row">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-x-6 border-b p-[2rem] items-center">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline mb-1">
                  Organize*
                </div>
                <p className="text-muted-foreground text-sm leading-8">
                  Select a category and subcategory for better product
                  visibility.
                </p>
              </div>
              <div className="space-y-4 p-2">
                <ProductFormCategorySubCategoryComponent
                  categories={categories}
                  subCategories={subCategories}
                />
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-x-6 border-b p-[2rem] items-center">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline mb-1">
                  Pricing*
                </div>
                <p className="text-muted-foreground text-sm leading-8">
                  Set the base price and consider offering a discount to boost
                  sales.
                </p>
                <p className="text-muted-foreground text-sm leading-8 mt-3">
                  The discount in this section is specific to this product.
                </p>
              </div>
              <div className="p-2 space-y-4 ">
                <div className="flex flex-col md:flex-row md:items-center gap-x-[1.5rem]">
                  <FormField
                    control={form.control}
                    name="salesPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Price*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Discount*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10%"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-x-6 border-b p-[2rem]">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline mb-1">
                  Variants*
                </div>
                <p className="text-muted-foreground text-sm leading-8">
                  Select available colors and define size options for your
                  product.
                </p>
              </div>
              {/*  */}

              <div className="space-y-8">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    if (isFormVisible) {
                      return handleCreateButtonClick();
                    }
                    dispatchInitialVariant();
                    handleCreateButtonClick();
                  }}
                  type="button"
                  className="flex item-center gap-2"
                >
                  {!isFormVisible && <Plus size={18} />}
                  {isFormVisible && <X size={18} />}
                  {isFormVisible ? "Close Form" : "Create New Variant"}
                </Button>
                {/*  */}
                {isFormVisible && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="space-y-1 w-full">
                        <select
                          id="color-id"
                          name="color_id"
                          value={variantData.color_id}
                          onChange={handleChange}
                          className="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-450 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-50 text-zinc-500"
                        >
                          <option value="">Select Color</option>
                          {/* Populate options dynamically based on your colors data */}
                          {colors?.map((color) => (
                            <option
                              key={color.id}
                              value={color.id}
                              onClick={() => dispatchSetColor(color)}
                            >
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 w-full">
                        <Input
                          type="text"
                          id="color-sku"
                          name="color_sku"
                          value={variantData.color_sku}
                          onChange={handleChange}
                          placeholder="Color SKU"
                        />
                      </div>
                      <div className="space-y-1 w-full">
                        <select
                          id="size-id"
                          name="size_id"
                          value={variantData.size_id}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-450 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-50 text-zinc-500"
                        >
                          <option value="">Select Size</option>
                          {/* Populate options dynamically based on your sizes data */}
                          {sizes?.map((size) => (
                            <option
                              key={size.id}
                              value={size.id}
                              onClick={() => dispatchSetSize(size)}
                            >
                              {size.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 w-full">
                        <Input
                          type="text"
                          id="size-sku"
                          name="size_sku"
                          value={variantData.size_sku} // typo fixed: variantData.color_sku should be variantData.size_sku
                          onChange={handleChange}
                          placeholder="Size SKU"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 w-1/3">
                      <Input
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={variantData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="flex items-center">
                      <Button
                        disabled={!variantData.color_id || !variantData.size_id}
                        type="button"
                        onClick={() => handleVariantSubmit()}
                        className="mt-1 justify-start w-fit ml-auto"
                      >
                        <CheckCheck size={16} /> Add variation
                      </Button>
                    </div>
                  </div>
                )}

                <Table className="h-[15rem]">
                  {VariantState.variants.length === 0 && (
                    <TableCaption>Empty list</TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead>Color_SKU</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Size_SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VariantState.variants.length > 0 &&
                      VariantState.variants.map((result, index) => {
                        const color = colors?.find(
                          (item) => item.id === result.color_id
                        );
                        const size = sizes?.find(
                          (item) => item.id === result.size_id
                        );

                        return (
                          <TableRow key={result.id}>
                            <TableCell className="flex items-center gap-3">
                              <div
                                style={{ background: color?.hex }}
                                className="size-6 rounded-full"
                              />
                              <div>{color?.name}</div>
                            </TableCell>
                            <TableCell className="text-zinc-400">
                              {" "}
                              {result.color_sku}
                            </TableCell>
                            <TableCell>{size?.name}</TableCell>
                            <TableCell className="text-zinc-400">
                              {result.size_sku}
                            </TableCell>
                            <TableCell>{result.quantity}</TableCell>
                            <TableCell>
                              <Trash
                                size={16}
                                color="red"
                                className="hover:bg-zinc-100 cursor-pointer"
                                onClick={() =>
                                  VariantDispatch({
                                    type: "DELETE_VARIANT",
                                    payload: {
                                      variantIdToDelete: result.id as string,
                                    },
                                  })
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-x-6 border-b p-[2rem]">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline">
                  Dimensions
                </div>
                <div className="text-muted-foreground font-semibold">
                  (Optional)
                </div>
              </div>
              <div className="p-2 space-y-4 pb-[4rem]">
                <div className="flex gap-3 flex-col md:flex-row">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-x-6 p-[2rem]">
              <div className="mt-4">
                <div className="text-[1.1rem] font-semibold hover:no-underline">
                  Media*
                </div>
                <p className="text-muted-foreground text-sm leading-8">
                  Add images to showcase your product in detail.
                </p>
              </div>
              <div className="p-2 space-y-4 pb-[4rem]">
                <FormDescription>
                  You can upload up to 4 images!
                </FormDescription>
                <div className="grid grid-cols-[65%_1fr]">
                  <FileUploadImage
                    fileNumber={4}
                    bucketName={"vendor"}
                    folderName={"product_upload"}
                    dispatch={ImageDispatch}
                  />
                  <ProductImageUploadImgList
                    bucketName={"vendor"}
                    folderName={"product_upload"}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full pb-6 absolute top-4 right-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-1 ml-auto"
              >
                {isCreating && !isDraft && <Loader className="animate-spin" />}
                <FileCheck size={18} />
                {paramProductAlreadyExistCaseOfUpdate
                  ? "Update"
                  : "Publish"}{" "}
                product
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
