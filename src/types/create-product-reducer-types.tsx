import { Tables } from "./supabase";

export type CreateProductAction =
  | {
      type: "TOGGLE_SHOW_CARD_DETAILS";
    }
  | {
      type: "INIT";
      payload: {
        category: Tables<"category"> | null;
        sub_category: Tables<"sub_category"> | null;
        colors: Tables<"color">[] | null;
        sizes: Tables<"sizes">[] | null;
        variants: Tables<"variants">[] | null;
      };
    }
  | {
      type: "SET_COLOR";
      payload: {
        color: Tables<"color">;
      };
    }
  | {
      type: "SET_SIZE";
      payload: {
        size: Tables<"sizes">;
      };
    }
  | {
      type: "SET_CATEGORY_SUBCATEGORY_IDS";
      payload: {
        category: Tables<"category">;
        sub_category: Tables<"sub_category">;
      };
    }
  | {
      type: "RESET";
    }
  | {
      type: "CREATE_VARIANT";
      payload: {
        product_id?: string;
        size_id: string;
        color_id: string;
        size_sku: string;
        color_sku: string;
        quantity: number;
      };
    }
  | {
      type: "INITIALIZE_VARIANT";
      payload: {};
    }
  | {
      type: "DELETE_VARIANT";
      payload: {
        variantIdToDelete: string;
      };
    };
