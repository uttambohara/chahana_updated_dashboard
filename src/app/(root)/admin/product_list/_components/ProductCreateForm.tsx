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
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import { Check, FileCheck, Loader, Paperclip } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { FormSchema } from "./ProductForm";
import ProductFormCategorySubCategoryComponent from "./ProductFormCategorySubCategoryComponent";
import ProductFormColorComponent from "./ProductFormColorComponent";
import ProductFormSizesComponent from "./ProductFormSizesComponent";
import ProductImageUploadImgList from "./ProductImageUploadImgList";
import { Dispatch, SetStateAction } from "react";
import { useUploadImage } from "@/providers/upload-image-provider";

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
      quantity: number;
      description: string;
      discountable: boolean;
      material: string;
      salesPrice: number;
      sku: string;
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
  form,
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
  const { state: ImageState, dispatch: ImageDispatch } = useUploadImage();
  return (
    <Card className="border-none max-w-[750px] mx-auto">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem className="w-[100%]">
                            <FormLabel>SKU*</FormLabel>
                            <FormControl>
                              <Input placeholder="S_K_U" {...field} />
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
                            <FormDescription>
                              This is a pitch of your product; keep it specific.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem className="w-2/3">
                            <FormLabel>Quantity*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Quantity"
                                {...field}
                                type="number"
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
                  <div className="flex flex-col gap-2 md:flex-row md:gap-12">
                    <div className="w-[100%]">
                      <FormLabel>Colors*</FormLabel>
                      <ProductFormColorComponent colors={colors} />
                    </div>
                    <div className="w-[100%]">
                      <FormLabel>Sizes*</FormLabel>
                      <ProductFormSizesComponent sizes={sizes} />
                    </div>
                  </div>
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
