"use client";

import { CreateProductAction } from "@/types/create-product-reducer-types";
import { Tables } from "@/types/supabase";
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
  showCardDetails: boolean;
  sizes: Tables<"sizes">[];
  colors: Tables<"color">[];
  category: Tables<"category"> | null;
  sub_category: Tables<"sub_category"> | null;
}

// ...
const CreateProductContext = createContext<CreateProductContextProps | null>(
  null
);

const initialState: CreateProductState = {
  showCardDetails: false,
  sizes: [],
  colors: [],
  category: null,
  sub_category: null,
};

const CreateProductReducer = (
  state: CreateProductState,
  action: CreateProductAction
): CreateProductState => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.payload,
        sizes: action.payload.sizes || [],
        colors: action.payload.colors || [],
        showCardDetails: true,
      };
    case "SET_SIZE":
      // Deconstruct the 'sizes' array from the state object
      const { sizes } = state;
      // Find the index of the size to update/remove based on its id
      const sizeIndex = sizes.findIndex(
        (size) => size.id === action.payload.size.id
      );
      // If the size isn't found (index is -1)
      if (sizeIndex === -1) {
        return { ...state, sizes: [...sizes, action.payload.size] };
      } else {
        return {
          ...state,
          sizes: sizes.filter((_, index) => index !== sizeIndex),
        };
      }
    case "SET_COLOR":
      // Deconstruct the 'colors' array from the state object
      const { colors } = state;
      // Find the index of the color to update/remove based on its id
      const colorIndex = colors.findIndex(
        (color) => color.id === action.payload.color.id
      );
      // If the color isn't found (index is -1)
      if (colorIndex === -1) {
        return { ...state, colors: [...colors, action.payload.color] };
      } else {
        return {
          ...state,
          colors: colors.filter((_, index) => index !== colorIndex),
        };
      }
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
