

import { JsonDecoder } from "ts.data.json";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.3
// source: common/error/v1/error.proto
/* eslint-disable */
export const protobufPackage = "faceblur.common.error.v1";
export interface ErrorResponse {
    error: string;
}




export const ErrorResponseDecoder = JsonDecoder.object(
    {
		error: JsonDecoder.string,
    },
    "ErrorResponse"
);




