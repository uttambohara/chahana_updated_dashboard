"use client";

import { UploadImageAction } from "@/types/upload-image-types";
import { Dispatch, createContext, useContext, useReducer } from "react";

// Interfaces
interface UploadImageProviderProps {
  children: React.ReactNode;
}
type UploadImageContextProps = {
  state: UploadImageState;
  dispatch: Dispatch<UploadImageAction>;
};
export interface UploadImageState {
  productImgs: { name: string; image: string }[];
}

// ...
const UploadImageContext = createContext<UploadImageContextProps | null>(null);
const initialState: UploadImageState = {
  productImgs: [],
};

const UploadImageReducer = (
  state: UploadImageState,
  action: UploadImageAction
): UploadImageState => {
  switch (action.type) {
    case "INIT":
      return { ...state, productImgs: action.payload.productImgs || [] };
    case "SET_IMAGES":
      //...
      // Use Set to get unique imgs from existing state
      const existingImageUrls = new Set(
        state.productImgs.map(({ image }) => image)
      );
      // Check payload img duplication. Use filter to extract an unique/ new image
      const newImages = action.payload.productImgs.filter(
        ({ image }) => !existingImageUrls.has(image)
      );
      return {
        ...state,
        productImgs: [...state.productImgs, ...newImages],
      };
    case "REMOVE_IMAGE": {
      const updatedPosts = state.productImgs?.filter(
        (post) => post.name !== action.payload.productImg.name
      );
      if (!updatedPosts) {
        return { ...state };
      } else {
        return { ...state, productImgs: updatedPosts };
      }
    }
    case "RESET":
      return { ...state, ...initialState };
    default:
      return state;
  }
};

export function UploadImageProvider({ children }: UploadImageProviderProps) {
  const [state, dispatch] = useReducer(UploadImageReducer, initialState);

  return (
    <UploadImageContext.Provider value={{ state, dispatch }}>
      {children}
    </UploadImageContext.Provider>
  );
}

// ..
export function useUploadImage() {
  const contextData = useContext(UploadImageContext);
  if (!contextData) {
    throw new Error(
      "useUploadImage hook should be used inside UploadImageProvider!"
    );
  }
  return contextData;
}
