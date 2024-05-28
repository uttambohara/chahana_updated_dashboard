"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import FileUploadImage from "@/components/fileUpload/FileUploadImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/providers/create-product-provider";
import { useUploadImage } from "@/providers/upload-image-provider";
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCheck,
  FileCheck,
  Loader,
  Paperclip,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { coerce, z } from "zod";
import { FormSchema } from "./ProductForm";
import ProductFormCategorySubCategoryComponent from "./ProductFormCategorySubCategoryComponent";
import ProductImageUploadImgList from "./ProductImageUploadImgList";

const variantSchema = z.object({
  product_id: z.string().min(2),
  size_id: z.string(),
  color_id: z.string(),
  size_sku: z.string(),
  color_sku: z.string(),
  quantity: coerce.number(),
});

type VariantSchema = z.infer<typeof variantSchema>;

interface ProductCreateFormProps {
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
  setIsDraft: Dispatch<SetStateAction<boolean>>;
}

export default function ProductCreateForm({
  form: productForm,
  categories,
  subCategories,
  sizes,
  colors,
  onSubmit,
  isCreating,
  paramProductAlreadyExistCaseOfUpdate,
  isDraft,
  setIsDraft,
}: ProductCreateFormProps) {
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
    <Card className="border-none max-w-[750px] mx-auto">
      <CardContent>
        <Form {...productForm}>
          <form
            onSubmit={productForm.handleSubmit(onSubmit)}
            className="space-y-4 p-4"
          >
            <Accordion type="multiple" defaultValue={["generalInformation"]}>
              <AccordionItem value="generalInformation">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  General information*
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-2 pb-[4rem]">
                  <div>
                    <div className="flex flex-col items-center gap-x-[1.5rem] md:flex-row">
                      <FormField
                        control={productForm.control}
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
                    <FormDescription className="mt-4 leading-8">
                      Give your product a short and a clear name. 50-60
                      characters is the recommended length for search engines.
                    </FormDescription>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={productForm.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
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
                    <FormField
                      control={productForm.control}
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
                      control={productForm.control}
                      name="discountable"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <h2 className="font-semibold mb-3">Discountable*</h2>
                          <FormControl>
                            <div className="flex md:justify-between flex-col gap-2 md:flex-row">
                              <p className="text-muted-foreground">
                                {" "}
                                When unchecked global discount will not be
                                applied to this product.
                              </p>
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="organize">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  Organize*
                </AccordionTrigger>
                <AccordionContent>
                  <ProductFormCategorySubCategoryComponent
                    categories={categories}
                    subCategories={subCategories}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pricing">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  Pricing*
                </AccordionTrigger>
                <AccordionContent className="p-2 space-y-4 pb-[4rem]">
                  <div className="flex flex-col md:flex-row md:items-center gap-x-[1.5rem]">
                    <FormField
                      control={productForm.control}
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
                      control={productForm.control}
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
                    <FormDescription className="mt-4 leading-8">
                      This is a discount specific to this product.
                    </FormDescription>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="variants">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  Variants*
                </AccordionTrigger>
                <AccordionContent className="p-2 space-y-4 pb-[4rem]">
                  <Button
                    variant={"link"}
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
                          disabled={
                            !variantData.color_id || !variantData.size_id
                          }
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dimensions">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  Dimensions
                </AccordionTrigger>
                <AccordionContent className="p-2 space-y-4 pb-[4rem]">
                  <div className="text-muted-foreground font-semibold mb-3">
                    (Optional)
                  </div>
                  <div className="flex gap-3 flex-col md:flex-row">
                    <FormField
                      control={productForm.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Width in cm</FormLabel>
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
                      control={productForm.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Length in cm</FormLabel>
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
                      control={productForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Height in cm</FormLabel>
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
                      control={productForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Weight in gm</FormLabel>
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="media">
                <AccordionTrigger className="text-[1.1rem] font-semibold hover:no-underline">
                  Media*
                </AccordionTrigger>
                <AccordionContent className="p-2 space-y-4 pb-[4rem]">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="absolute top-0 left-2/3">
              <div className="flex gap-2 w-full pb-6">
                <Button
                  variant={"outline"}
                  onClick={() => setIsDraft(true)}
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-1"
                >
                  <Paperclip size={18} />
                  {isCreating && isDraft && <Loader className="animate-spin" />}
                  Save as draft
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-1"
                >
                  {isCreating && !isDraft && (
                    <Loader className="animate-spin" />
                  )}
                  <FileCheck size={18} />
                  {paramProductAlreadyExistCaseOfUpdate
                    ? "Update"
                    : "Publish"}{" "}
                  product
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
