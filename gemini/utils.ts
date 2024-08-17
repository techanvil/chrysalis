// See https://stackoverflow.com/a/71115598

export function roughSizeOfObject(object: any): number {
  const objectList = [];
  const stack = [object];
  const bytes = [0];
  while (stack.length) {
    const value = stack.pop();
    if (value == null) bytes[0] += 4;
    else if (typeof value === "boolean") bytes[0] += 4;
    else if (typeof value === "string") bytes[0] += value.length * 2;
    else if (typeof value === "number") bytes[0] += 8;
    else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);
      if (typeof value.byteLength === "number") bytes[0] += value.byteLength;
      else if (value[Symbol.iterator]) {
        for (const v of value) stack.push(v);
      } else {
        Object.keys(value).forEach((k) => {
          bytes[0] += k.length * 2;
          stack.push(value[k]);
        });
      }
    }
  }

  return bytes[0];
  // return formatByteSize(bytes[0]);
}

/*
function formatByteSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
  else return (bytes / 1073741824).toFixed(3) + " GiB";
}
*/
