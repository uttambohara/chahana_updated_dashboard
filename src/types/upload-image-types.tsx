export type UploadImageAction =
  | {
      type: "INIT";
      payload: {
        productImgs: { name: string; image: string }[] | null;
      };
    }
  | {
      type: "SET_IMAGES";
      payload: {
        productImgs: { name: string; image: string }[];
      };
    }
  | {
      type: "REMOVE_IMAGE";
      payload: {
        productImg: { name: string; image: string };
      };
    }
  | {
      type: "RESET";
    };
