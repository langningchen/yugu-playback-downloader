export default (str: string, obfsKey: number) => {
  const sz = 95;
  return Array.from(str)
    .map((c) => {
      let code = c.charCodeAt(0) - 32;
      if (code < 0 || code >= sz) {
        throw new Error("Invalid character in string");
      }
      code = (code - obfsKey + sz) % sz;
      return String.fromCharCode(code + 32);
    })
    .join("");
};
