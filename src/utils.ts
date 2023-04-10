function parseData(data: any) {
  let result = {};
  try {
    result = JSON.parse(data as unknown as string);
  } catch (error) {
    Logger.error(error);
  }
  return result;
}
