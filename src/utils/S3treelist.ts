/* eslint-disable no-console */
import { isObject } from './checkIsItObj';

export function createS3Folders(data: any, listFolder: any, IDH: number | string): any {
  return data.reduce((acc: any, item: any, index: any) => {
    if (listFolder[index] && item[listFolder[index].BucketName][''] === '/') {
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
interface FolderNode {
  ID: number;
  IDH: number;
  StorageAccount: string;
  ContainerName: string;
  Location: string;
  data: FolderNode[];
  fullPath: string;
}
export function createAzureFolders(
  data: any,
  parentID: number = 0,
  StorageAccount: string | null = null,
  parentPath: string = '',
  idCounterObj = { count: 1 },
  visitedPaths = new Set<string>(),
  inheritedLocation: string = '',
): FolderNode[] {
  return Object.keys(data).reduce((acc: FolderNode[], key: string) => {
    if (key === 'stgaccproperties') return acc;

    const fullPath = parentPath ? `${parentPath}/${key}` : key;
    if (visitedPaths.has(fullPath)) return acc;
    visitedPaths.add(fullPath);

    const newID = idCounterObj.count++;
    const currentLocation = data.stgaccproperties?.Location || inheritedLocation;

    // ✅ Use root ContainerName only at the top level
    const storageAccount = fullPath?.split('/')[0];

    const row: FolderNode = {
      ID: newID,
      IDH: parentID,
      StorageAccount: storageAccount,
      ContainerName: key,
      Location: currentLocation,
      data: [],
      fullPath,
    };

    if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
      row.data = createAzureFolders(
        data[key],
        newID,
        storageAccount, // ✅ Only pass top-level container as account
        fullPath,
        idCounterObj,
        visitedPaths,
        currentLocation,
      );
    }

    acc.push(row);
    return acc;
  }, []);
}
export function findNestedDataByKey(data: any, keyToFind: string): any | null {
  if (typeof data !== 'object' || data === null) return null;

  if (keyToFind in data) return data[keyToFind];

  for (const key in data) {
    if (typeof data[key] === 'object') {
      const found = findNestedDataByKey(data[key], keyToFind);
      if (found) return found;
    }
  }
  return null;
}

export function updateTreeNodeData(
  tree: FolderNode[],
  id: number,
  newChildren: FolderNode[],
): FolderNode[] {
  return tree.map(node => {
    if (node.ID === id) {
      // Merge existing children with new ones where needed
      const mergedChildren = node.data.map(existingChild => {
        const updated = newChildren.find(
          newChild => newChild.fullPath === existingChild.fullPath, // ✅ Match on fullPath
        );

        // If there's an update and it has children, update that child
        if (updated && updated.data.length > 0) {
          return {
            ...existingChild,
            data: updated.data,
          };
        }

        return existingChild;
      });

      return { ...node, data: mergedChildren };
    } else if (node.data?.length) {
      return { ...node, data: updateTreeNodeData(node.data, id, newChildren) };
    }

    return node;
  });
}
export function mergeTreeByFullPath(
  existingNodes: FolderNode[],
  newNodes: FolderNode[],
): FolderNode[] {
  return existingNodes.map(existing => {
    const updated = newNodes.find(n => n.fullPath === existing.fullPath);

    if (updated && updated.data.length > 0) {
      return {
        ...existing,
        data:
          existing.data.length > 0
            ? mergeTreeByFullPath(existing.data, updated.data)
            : updated.data, // ✅ fallback when existing is empty
      };
    }

    // Still recurse if needed (e.g., nested structure updates)
    return {
      ...existing,
      data: mergeTreeByFullPath(existing.data, newNodes),
    };
  });
}

export function getMaxId(tree: any[]): number {
  let maxId = 0;
  function recurse(nodes: FolderNode[]) {
    nodes.forEach(node => {

      if (node.ID > maxId) maxId = node.ID;
      if (node.data?.length) recurse(node.data);
    });
  }
  recurse(tree);
  return maxId;
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
