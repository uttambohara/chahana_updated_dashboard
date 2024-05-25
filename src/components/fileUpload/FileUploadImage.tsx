"use client";

import Uppy from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import clsx from "clsx";
import { useRef, useState } from "react";
import FileUploadImageList from "@/components/fileUpload/FileUploadImageList";
import { UploadImageAction } from "@/types/upload-image-types";
import { supabaseBrowserClient } from "@/lib/supabase/client";

const SUPABASE_PROJECT_ID = "prgbwpzcwoxdqzqzvhdh";

interface FileUploadImageProps {
  fileNumber: number;
  bucketName: string;
  folderName: string;
  //
  value?: string;
  onChange?: (imageArrInString: string) => void;
  dispatch?: React.Dispatch<UploadImageAction>;
}

export default function FileUploadImage({
  fileNumber,
  bucketName,
  folderName,
  //
  onChange,
  value: ArrayInString,
  dispatch,
}: FileUploadImageProps) {
  const folder = folderName;
  const supabaseStorageURL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`;

  const [uppy] = useState(() => {
    return new Uppy({
      restrictions: {
        maxNumberOfFiles: fileNumber,
      },
    }).use(Tus, {
      endpoint: supabaseStorageURL,
      async onBeforeRequest(req) {
        const supabase = supabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
        req.setHeader("x-upsert", "true");
      },
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
    });
  });

  uppy.on("file-added", (file) => {
    const supabaseMetadata = {
      bucketName,
      objectName: folder ? `${folder}/${file.name}` : file.name,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };

    console.log("file added", file);
  });

  uppy.on("complete", (result) => {
    console.log(
      "Upload complete! We’ve uploaded these files:",
      result.successful
    );

    const imgArrSuccessful = result?.successful.map((uploadedImageData) => {
      const originalFilename = uploadedImageData.name;
      return {
        name: uploadedImageData.name,
        image: `https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/${bucketName}/${folderName}/${originalFilename}`,
      };
    });

    // 1 image upload
    if (onChange) {
      onChange(JSON.stringify(imgArrSuccessful));
    }
    // Multiple image upload
    if (dispatch) {
      dispatch({
        type: "SET_IMAGES",
        payload: { productImgs: imgArrSuccessful },
      });
    }

    uppy.cancelAll();
  });

  return (
    <div
      className={clsx("grid gap-4", {
        "": Boolean(ArrayInString),
      })}
    >
      <Dashboard uppy={uppy} />

      {/* File upload Image container */}
      {ArrayInString && fileNumber === 1 && onChange && (
        <FileUploadImageList
          ArrayInString={ArrayInString}
          onChange={onChange}
        />
      )}
    </div>
  );
}
