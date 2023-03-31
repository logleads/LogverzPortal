/* eslint-disable no-console */
import { isObject } from './checkIsItObj';

export function createS3Folders(data: any, listFolder: any, IDH: number | string): any {
  return data.reduce((acc: any, item: any, index: any) => {
    if (item[listFolder[index].BucketName][''] === '/') {
      return [
        ...acc,
        generateHeadObj(
          listFolder[index],
          listFolder[index].BucketName,
          index,
          item[listFolder[index].BucketName],
          listFolder[index].BucketName,
        ),
      ];
    }
    return [
      ...acc,
      generateHeadObj(
        listFolder[index],
        listFolder[index].BucketName,
        index,
        item[listFolder[index].BucketName],
        listFolder[index].BucketName,
      ),
      ...Object.keys(item[listFolder[index].BucketName]).reduce(
        (accc: any, it: string, idx: number) => {
          if (isObject(item[listFolder[index].BucketName][it])) {
            return [
              ...accc,
              generateOneItem(
                listFolder[index],
                it,
                index,
                idx,
                item[listFolder[index].BucketName],
                `${listFolder[index].BucketName}/${it}`,
              ),
              ...getAllFolder(
                item[listFolder[index].BucketName][it],
                index + 1 + '' + idx + 'h',
                listFolder[index],
                `${listFolder[index].BucketName}/${it}`,
              ),
            ];
          } else {
            return [
              ...accc,
              generateOneItem(
                listFolder[index],
                it,
                index,
                idx,
                item[listFolder[index].BucketName],
                `${listFolder[index].BucketName}/${it}`,
              ),
            ];
          }
        },
        [],
      ),
    ];
  }, []);
}

function getAllFolder(data: any, IDH: number | string, listFolderData: any, prefix: string): any[] {
  return Object.keys(data).reduce((acc: any, it: string, key: number) => {
    if (isObject(data[it])) {
      return [
        ...acc,
        generateOneItemRecursive(listFolderData, it, IDH, key, 'r', data[it], `${prefix}/${it}`),
        ...getAllFolder(data[it], IDH + '' + key + 'r', listFolderData, `${prefix}/${it}`),
      ];
    } else {
      return [
        ...acc,
        generateOneItemRecursive(listFolderData, it, IDH, key, 'r', data[it], `${prefix}/${it}`),
      ];
    }
  }, []);
}

function generateOneItemRecursive(
  listFolderData: any,
  name: string,
  IDH: string | number,
  key: number,
  pr: string,
  data: unknown,
  value: string = '/',
) {
  return generateData(listFolderData, name, IDH + '' + key + '' + pr, IDH, data, value);
}

function generateOneItem(
  listFolderData: any,
  name: string,
  index: number,
  idx: number,
  data: unknown,
  value: string = '/',
) {
  return generateData(listFolderData, name, index + 1 + '' + idx + 'h', index + 1, data, value);
}

function generateHeadObj(
  listFolderData: any,
  name: string,
  index: number,
  data: unknown,
  value: string = '/',
) {
  return generateData(listFolderData, name, index + 1, 0, data, value);
}

function generateData(
  listFolderData: unknown[],
  name: string,
  ID: string | number,
  IDH: string | number,
  data: unknown,
  value: string = '/',
) {
  return {
    ...listFolderData,
    name,
    ID,
    IDH,
    data,
    value,
  };
}

export function transformObjToS3Folder({ father, children }: { father: any; children: any }) {
  if (!children) return [];
  if (isObject(children[father.name])) {
    return transformObjToS3FolderRecursive(father, children[father.name]);
  }

  return [];
}

function transformObjToS3FolderRecursive(ownerObj: any, objForTransform: any): any {
  return Object.keys(objForTransform).reduce((acc: any, key, index: number) => {
    if (objForTransform[key]) {
      if (isObject(objForTransform[key])) {
        const row = {
          ...ownerObj,
          IDH: ownerObj.ID,
          ID: ownerObj.ID + '' + index + 'r',
          name: key,
          value: ownerObj.value + '/' + key,
          data: objForTransform[key],
        };
        return [...acc, row, ...transformObjToS3FolderRecursive(row, objForTransform[key])];
      } else {
        return [
          ...acc,
          {
            ...ownerObj,
            IDH: ownerObj.ID,
            ID: ownerObj.ID + '' + index + 'r',
            name: key,
            value: ownerObj.value + '/' + key,
            data: objForTransform[key],
          },
        ];
      }
    } else {
      return [...acc];
    }
  }, []);
}
