import { customFetch, isErrorResponse } from "../../../util/fetch";
import {ErrorResponse} from "@/proto/common/error/v1/error";

import { JsonDecoder } from "ts.data.json";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.3
// source: image/v1/image.proto
/* eslint-disable */
import { type CreateImage, type Image, CreateImageDecoder, ImageDecoder } from "../../common/image/v1/image";
import { type PageNavigationRequest, type PageNavigationResponse, PageNavigationRequestDecoder, PageNavigationResponseDecoder } from "../../common/page_navigation/v1/page_navigation";
export const protobufPackage = "faceblur.image.v1";
export interface GetUploadURLRequest {
}
export interface GetUploadURLResponse {
    version: string;
    url: string;
    objectName: string;
}
export interface SubmitImageRequest {
    image: CreateImage | undefined;
}
export interface SubmitImageResponse {
    version: string;
    image: Image | undefined;
}
export interface ListImagesRequest {
    pageNavigation: PageNavigationRequest | undefined;
}
export interface ListImagesResponse {
    version: string;
    images: Image[];
    pageNavigation: PageNavigationResponse | undefined;
}
export interface ImageService {
    /** GetUploadURL returns a new signed URL for image upload */
    GetUploadURL(request: GetUploadURLRequest): Promise<GetUploadURLResponse>;
    /** SubmitImage creates a new image and puts it to the processing queue */
    SubmitImage(request: SubmitImageRequest): Promise<SubmitImageResponse>;
    /** ListImages returns a list of user images, paginated and sorted by creation date */
    ListImages(request: ListImagesRequest): Promise<ListImagesResponse>;
}




export const GetUploadURLRequestDecoder = JsonDecoder.object(
    {
    },
    "GetUploadURLRequest"
);

export const GetUploadURLResponseDecoder = JsonDecoder.object(
    {
		version: JsonDecoder.string,
		url: JsonDecoder.string,
		objectName: JsonDecoder.string,
    },
    "GetUploadURLResponse"
);

export const SubmitImageRequestDecoder = JsonDecoder.object(
    {
		image: CreateImageDecoder,
    },
    "SubmitImageRequest"
);

export const SubmitImageResponseDecoder = JsonDecoder.object(
    {
		version: JsonDecoder.string,
		image: ImageDecoder,
    },
    "SubmitImageResponse"
);

export const ListImagesRequestDecoder = JsonDecoder.object(
    {
		pageNavigation: PageNavigationRequestDecoder,
    },
    "ListImagesRequest"
);

export const ListImagesResponseDecoder = JsonDecoder.object(
    {
		version: JsonDecoder.string,
		images: JsonDecoder.array(ImageDecoder, "arrayOfImages"),
		pageNavigation: PageNavigationResponseDecoder,
    },
    "ListImagesResponse"
);


type DeepNonUndefined<T> = T extends Date
    ? T
    : T extends object
        ? { [K in keyof T]: DeepNonUndefined<Exclude<T[K], undefined>> }
        : T;

type DeepReplaceDateWithNullable<T> = T extends Date
  ? Date | null
  : T extends object
  ? {
      [K in keyof T]: DeepReplaceDateWithNullable<T[K]>;
    }
  : T;




type GetUploadURLResponseStrict = DeepNonUndefined<DeepReplaceDateWithNullable<GetUploadURLResponse>>;
/*
GetUploadURL returns a new signed URL for image upload
*/
export async function GetUploadURL(request: GetUploadURLRequest, token?: string): Promise<GetUploadURLResponseStrict | ErrorResponse> {
  const data = await customFetch<GetUploadURLRequest, GetUploadURLResponse>("/v1/image/upload-url/get", request, token);
  if (!isErrorResponse(data)) {
    await GetUploadURLResponseDecoder.decodeToPromise(data);
  }

  return data as GetUploadURLResponseStrict | ErrorResponse;
}

type SubmitImageResponseStrict = DeepNonUndefined<DeepReplaceDateWithNullable<SubmitImageResponse>>;
/*
SubmitImage creates a new image and puts it to the processing queue
*/
export async function SubmitImage(request: SubmitImageRequest, token?: string): Promise<SubmitImageResponseStrict | ErrorResponse> {
  const data = await customFetch<SubmitImageRequest, SubmitImageResponse>("/v1/image/submit", request, token);
  if (!isErrorResponse(data)) {
    await SubmitImageResponseDecoder.decodeToPromise(data);
  }

  return data as SubmitImageResponseStrict | ErrorResponse;
}

type ListImagesResponseStrict = DeepNonUndefined<DeepReplaceDateWithNullable<ListImagesResponse>>;
/*
ListImages returns a list of user images, paginated and sorted by creation date
*/
export async function ListImages(request: ListImagesRequest, token?: string): Promise<ListImagesResponseStrict | ErrorResponse> {
  const data = await customFetch<ListImagesRequest, ListImagesResponse>("/v1/image/list", request, token);
  if (!isErrorResponse(data)) {
    await ListImagesResponseDecoder.decodeToPromise(data);
  }

  return data as ListImagesResponseStrict | ErrorResponse;
}


