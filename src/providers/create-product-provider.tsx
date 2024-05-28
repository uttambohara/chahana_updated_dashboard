"use client";

import { CreateProductAction } from "@/types/create-product-reducer-types";
import { Tables } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";
import { Dispatch, createContext, useContext, useReducer } from "react";

// Interfaces
interface CreateProductProviderProps {
  children: React.ReactNode;
}
type CreateProductContextProps = {
  state: CreateProductState;
  dispatch: Dispatch<CreateProductAction>;
};
interface CreateProductState {
  selectedVariantId: string;
  showCardDetails: boolean;
  variants: Partial<Tables<"variants">>[];
  //   variants: Partial<
  //   Tables<"variants"> & { color: Tables<"color">[] } & {
  //     sizes: Tables<"sizes">[];
  //   }
  // >[];
  category: Tables<"category"> | null;
  sub_category: Tables<"sub_category"> | null;
}

// ...
const CreateProductContext = createContext<CreateProductContextProps | null>(
  null
);

const initialState: CreateProductState = {
  selectedVariantId: "",
  showCardDetails: false,
  variants: [],
  category: null,
  sub_category: null,
};

// Helper function to update the 'sizes' array within a variant
function createEmptyVariant() {
  return {
    id: uuidv4(),
  };
}

const CreateProductReducer = (
  state: CreateProductState,
  action: CreateProductAction
): CreateProductState => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.payload,
        variants: action.payload.variants || [],
        showCardDetails: true,
      };

    case "INITIALIZE_VARIANT":
      const newVariant = createEmptyVariant();
      return {
        ...state,
        variants: [...state.variants, newVariant],
        // Add newVariant.id to the payload of the action you dispatch
        selectedVariantId: newVariant.id, // Assuming you have selectedVariantId state
      };

    case "DELETE_VARIANT":
      const { variantIdToDelete } = action.payload; // Get the ID of the variant to delete

      // Find the variant index based on its identifier
      const variantIndex = state.variants.findIndex(
        (variant) => variant.id === variantIdToDelete
      );

      if (variantIndex !== -1) {
        // Variant found, remove it from the variants array
        return {
          ...state,
          variants: [
            ...state.variants.slice(0, variantIndex),
            ...state.variants.slice(variantIndex + 1),
          ],
        };
      } else {
        // Variant not found, handle error or warning (optional)
        console.warn("Variant not found for deletion.");
        return state;
      }
    case "CREATE_VARIANT":
      const { size_sku, color_sku, color_id, size_id, quantity } =
        action.payload;

      // Find the variant based on size and color (assuming unique combination)
      const matchingVariant = state.variants.find(
        (v) => v.id === state.selectedVariantId
      );

      if (matchingVariant) {
        // Variant found, update its sizeSKU and productSKU
        return {
          ...state,
          variants: state.variants.map((variant) =>
            variant === matchingVariant
              ? {
                  ...variant,
                  size_sku,
                  color_sku,
                  color_id: Number(color_id),
                  size_id: Number(size_id),
                  quantity,
                }
              : variant
          ),
        };
      } else {
        // Variant not found based on size and color combination, handle error or warning
        console.warn("Variant not found for size and color combination.");
        return state; // Or potentially create a new variant here
      }

    // case "SET_SIZE":
    //   // Variant assigned in front end on the basis of index
    //   const { size } = action.payload;

    //   // Find the variant index based on its identifier
    //   const variantIndex = initialState.variants.findIndex(
    //     (v) => v.id === state.selectedVariantId // Replace 'variants.id' with the actual identifier property
    //   );

    //   if (variantIndex === -1) {
    //     // Variant not found, create a new one with the size
    //     return {
    //       ...state,
    //       variants: [...state.variants, { id: uuidv4(), size_id: size.id }],
    //     };
    //   } else {
    //     // Variant found, update its 'sizes' array (code remains the same)
    //     return {
    //       ...state,
    //       variants: state.variants.map((existingVariant) =>
    //         existingVariant.id === state.selectedVariantId
    //           ? {
    //               ...existingVariant,
    //               sizes: [action.payload.size],
    //             }
    //           : existingVariant
    //       ),
    //     };
    //   }

    // case "SET_COLOR":
    //   const { color } = action.payload;

    //   // Find the variant index based on its identifier
    //   const variantIndexForColor = initialState.variants.findIndex(
    //     (v) => v.id === state.selectedVariantId // Replace 'variants.id' with the actual identifier property
    //   );

    //   if (variantIndexForColor === -1) {
    //     // Variant not found, create a new one with the color
    //     return {
    //       ...state,
    //       variants: [...state.variants, { id: uuidv4(), color_id: color.id }],
    //     };
    //   } else {
    //     // Variant found, update its 'color' array (code remains the same)
    //     return {
    //       ...state,
    //       variants: state.variants.map((existingVariant) =>
    //         existingVariant.id === state.selectedVariantId
    //           ? {
    //               ...existingVariant,
    //               colors: [action.payload.color],
    //             }
    //           : existingVariant
    //       ),
    //     };
    //   }
    case "SET_CATEGORY_SUBCATEGORY_IDS":
      return {
        ...state,
        category: action.payload?.category,
        sub_category: action.payload?.sub_category,
      };
    case "TOGGLE_SHOW_CARD_DETAILS":
      // Return a new state object with the inverted value of showCardDetails
      return {
        ...state,
        showCardDetails: !state.showCardDetails,
      };
    case "RESET":
      return { ...state, ...initialState };
    default:
      return state;
  }
};

export function CreateProductProvider({
  children,
}: CreateProductProviderProps) {
  const [state, dispatch] = useReducer(CreateProductReducer, initialState);

  return (
    <CreateProductContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateProductContext.Provider>
  );
}

// ..
export function useCreateProduct() {
  const contextData = useContext(CreateProductContext);
  if (!contextData) {
    throw new Error(
      "useCreateProduct hook should be used inside CreateProductProvider!"
    );
  }
  return contextData;
}
