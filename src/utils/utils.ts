import { DataSource, ResultData } from "@/type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (inputNodeId: any, version: number): DataSource => {
  if (version === 0.2) {
    const parts = inputNodeId.split(".");
    if (parts.length == 1) {
      return { nodeId: parts[0] };
    }
    return { nodeId: parts[0], propIds: parts.slice(1) };
  }
  console.log("***** version not 0.2", version);
  if (typeof inputNodeId === "string") {
    const parts = inputNodeId.split(".");
    if (parts[0].slice(0.1) !== '$') {
      return { value: parts[0] };
    }
    const nodeId = inputNodeId.slice(1);
    if (parts.length == 1) {
      return { nodeId };
    }
    return { nodeId, propIds: parts.slice(1) };
  }
  return { value: inputNodeId };
};

export function assert(condition: boolean, message: string, isWarn: boolean = false): asserts condition {
  if (!condition) {
    if (!isWarn) {
      throw new Error(message);
    }
    console.warn("warn: " + message);
  }
}

export const isObject = (x: unknown) => {
  return x !== null && typeof x === "object";
};

const getNestedData = (result: ResultData, propId: string) => {
  if (Array.isArray(result)) {
    const regex = /^\$(\d+)$/;
    const match = propId.match(regex);
    if (match) {
      const index = parseInt(match[1], 10);
      return result[index];
    }
    if (propId === "$last") {
      return result[result.length - 1];
    }
  }
  assert(isObject(result), "result is not object.");
  return (result as Record<string, any>)[propId];
};

const innerGetDataFromSource = (result: ResultData, propIds: string[] | undefined): ResultData | undefined => {
  if (result && propIds && propIds.length > 0) {
    const propId = propIds[0];
    const ret = getNestedData(result, propId);
    if (propIds.length > 1) {
      return innerGetDataFromSource(ret, propIds.slice(1));
    }
    return ret;
  }
  return result;
};

export const getDataFromSource = (result: ResultData, source: DataSource): ResultData | undefined => {
  return innerGetDataFromSource(result, source.propIds);
};

export const strIntentionalError = "Intentional Error for Debugging";
