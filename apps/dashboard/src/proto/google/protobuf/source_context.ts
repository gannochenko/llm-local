

import { JsonDecoder } from "ts.data.json";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.3
// source: google/protobuf/source_context.proto
/* eslint-disable */
export const protobufPackage = "google.protobuf";
/**
 * `SourceContext` represents information about the source of a
 * protobuf element, like the file in which it is defined.
 */
export interface SourceContext {
    /**
     * The path-qualified name of the .proto file that contained the associated
     * protobuf element.  For example: `"google/protobuf/source_context.proto"`.
     */
    fileName: string;
}




export const SourceContextDecoder = JsonDecoder.object(
    {
		fileName: JsonDecoder.string,
    },
    "SourceContext"
);




