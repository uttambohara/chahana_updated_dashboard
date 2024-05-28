"use client";

import { TProductWithCategorySubCategoryWithColorWithSizes } from "@/types";
import { CreateProductAction } from "@/types/create-product-reducer-types";
import { UploadImageAction } from "@/types/upload-image-types";

import { Dispatch, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseInitProductDataProps {
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
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
  CreateProductDispatch: Dispatch<CreateProductAction>;
  ImageDispatch: Dispatch<UploadImageAction>;
}

export default function useInitProductData({
  productBasedOnParamId,
  form,
  CreateProductDispatch,
  ImageDispatch,
}: UseInitProductDataProps) {
  useEffect(() => {
    const productBasedOnParamIdObject = productBasedOnParamId?.[0];

    if (productBasedOnParamId && productBasedOnParamIdObject) {
      // ...
      form.reset({
        name: productBasedOnParamIdObject.name,
        material: productBasedOnParamIdObject.material,
        discountable: productBasedOnParamIdObject.discountable || false,
        length: productBasedOnParamIdObject.length || 0,
        width: productBasedOnParamIdObject.width || 0,
        height: productBasedOnParamIdObject.height || 0,
        weight: productBasedOnParamIdObject.weight || 0,
        description: productBasedOnParamIdObject.description,
        salesPrice: productBasedOnParamIdObject.salesPrice,
        discount: productBasedOnParamIdObject.discount || 0,
      });

      // ...
      CreateProductDispatch({
        type: "INIT",
        payload: {
          category: productBasedOnParamIdObject.category,
          sub_category: productBasedOnParamIdObject.sub_category,
          colors: productBasedOnParamIdObject.color,
          sizes: productBasedOnParamIdObject.sizes,
          variants: productBasedOnParamIdObject.variants,
        },
      });
      ImageDispatch({
        type: "INIT",
        payload: {
          productImgs: JSON.parse(productBasedOnParamIdObject.productImgs),
        },
      });
    }
  }, [CreateProductDispatch, ImageDispatch, form, productBasedOnParamId]);

  return null;
}
