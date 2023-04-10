const SYSTEM_ADMIN_ID = '00000000-0000-0000-0000-000000000000';
interface IStorage {
  key: string;
  collection: string;
}

interface IStorageRead extends IStorage {}
interface IStorageDelete extends IStorage {}

interface IStorageWrite extends IStorage {
  value: object;
  version?: string;
}

type TConfigValue = string | number;

function storageWrite(nk: nkruntime.Nakama, params: IStorageWrite[]) {
  const objectIds: nkruntime.StorageWriteRequest[] = params.map((param) => {
    return {
      ...param,
      userId: SYSTEM_ADMIN_ID,
      permissionRead: 2,
      permissionWrite: 0,
    };
  });

  try {
    nk.storageWrite(objectIds);
    return true;
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      Logger?.error('Error: ' + error.message);
    }
    return false;
  }
}

function storageRead(nk: nkruntime.Nakama, params: IStorageRead[]) {
  const objectIds: nkruntime.StorageReadRequest[] = params.map((param) => {
    return { ...param, userId: SYSTEM_ADMIN_ID };
  });
  let records: nkruntime.StorageObject[] = [];

  try {
    records = nk.storageRead(objectIds);
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      Logger?.error('Error: ' + error.message);
    }
  }
  return records;
}

function storageDelete(nk: nkruntime.Nakama, params: IStorageDelete[]) {
  const objectIds: nkruntime.StorageDeleteRequest[] = params.map((param) => {
    return { ...param, userId: SYSTEM_ADMIN_ID };
  });
  try {
    nk.storageDelete(objectIds);
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      Logger?.error('Error: ' + error.message);
    }
    return false;
  }
  return true;
}

function storageList(
  nk: nkruntime.Nakama,
  collection: string,
  limit: number = 100
) {
  let result: nkruntime.StorageObjectList = {};
  try {
    result = nk.storageList(SYSTEM_ADMIN_ID, collection, limit);
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      Logger?.error('Error: ' + error.message);
    }
  }
  return result;
}

class StorageEngine {
  static staticNk: nkruntime.Nakama | undefined;
  static load(staticNk: nkruntime.Nakama) {
    if (!StorageEngine.staticNk) {
      StorageEngine.staticNk = staticNk;
    }
  }

  static read(params: IStorageRead[]) {
    if (!StorageEngine.staticNk) return [];
    return storageRead(StorageEngine.staticNk, params);
  }

  static write(params: IStorageWrite[]) {
    if (!StorageEngine.staticNk) return false;
    return storageWrite(StorageEngine.staticNk, params);
  }

  static delete(params: IStorageDelete[]) {
    if (!StorageEngine.staticNk) return false;
    storageDelete(StorageEngine.staticNk, params);
  }
}
