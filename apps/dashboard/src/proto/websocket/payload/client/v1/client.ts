

import { JsonDecoder } from "ts.data.json";
// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.3
// source: websocket/payload/client/v1/client.proto
/* eslint-disable */
export const protobufPackage = "faceblur.websocket.payload.client.v1";
export interface TokenUpdate {
    token: string;
}




export const TokenUpdateDecoder = JsonDecoder.object(
    {
		token: JsonDecoder.string,
    },
    "TokenUpdate"
);




