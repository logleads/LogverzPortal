export const parseObj = (obj: any): any => {
  if (Object.keys(obj).length === 0) {
    return {};
  }
  let tray: any = {};
  Object.keys(obj).forEach(i => {
    if (typeof obj[i] === 'object') {
      tray = { ...tray, ...obj[i] };
    } else {
      tray[i] = obj[i];
    }
  });
  let isNested = false;
  Object.keys(tray).forEach(i => {
    if (typeof tray[i] === 'object') {
      isNested = true;
    }
  });
  if (isNested) {
    tray = parseObj(tray);
  }
  return tray;
};

export function convertObjForTable(
  a: Record<string, unknown | Record<string, unknown>>,
): Record<string, unknown> {
  let obj = {};
  for (const key in a) {
    let checkObj: Record<string, unknown> = {};
    if (typeof a[key] === 'object' && a[key] !== null) {
      if (Array.isArray(a[key])) {
        checkObj = { [key]: (a[key] as Array<unknown>).join(' ') };
      } else {
        checkObj = convertObjForTable(a[key] as Record<string, unknown>);
      }
    } else {
      checkObj = { [key]: a[key] };
    }

    if (Object.values(checkObj).length) {
      for (const newKey in checkObj) {
        if (newKey in obj) {
          const newLocal = newKey + '_' + newKey;
          checkObj[newLocal] = checkObj[newKey];
          delete checkObj[newKey];
        }
      }

      obj = { ...obj, ...checkObj };
    }
  }

  return { ...obj };
}

export function c(
  a: Record<string, unknown | Record<string, unknown>>,
  acc: Array<unknown> = [],
): unknown {
  const accc: Array<unknown> = [...acc];
  let obj = { ...a };

  for (const key in a) {
    if (typeof a[key] === 'object' && a[key] !== null) {
      if (!Array.isArray(a[key])) {
        obj[key] = c(a[key] as Record<string, unknown>, [...accc, ...Object.keys(a)]);
      }
    }
    if (accc.includes(key)) {
      obj[key + '_' + key] = obj[key];
      delete obj[key];
    }
    obj = { ...obj };
  }
  return obj;
}

export function checkIsObj(v: unknown): boolean {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function checkIsKey(keys: string[], kay: string): boolean {
  return keys.includes(kay);
}

export function transformObj(
  obj: Record<string, Record<string, unknown> | unknown>,
): Record<string, Record<string, unknown> | unknown> {
  let newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    newObj = checkIsObj(value)
      ? {
          ...newObj,
          ...transformObj(value as Record<string, unknown>),
        }
      : { ...newObj, [key]: value };
  }

  return { ...newObj };
}

export function transformKeys(
  obj: Record<string, Record<string, unknown> | unknown>,
): Record<string, Record<string, unknown> | unknown> {
  const newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (checkIsKey(Object.keys(newObj), key)) {
      newObj[`${key}_${key}`] = checkIsObj(value)
        ? transformKeys(value as Record<string, unknown>)
        : value;
    } else {
      newObj[key] = checkIsObj(value) ? transformKeys(value as Record<string, unknown>) : value;
    }
  }

  return { ...newObj };
}

export function transformHeader(
  obj: Record<string, Record<string, unknown> | unknown>,
  keyP?: string,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (checkIsObj(value)) {
      const obj_2 = transformHeader(value as Record<string, unknown>, key);
      Object.keys(obj_2).map((item: any) => {
        if (keyP) {
          newObj[(keyP + '-' + item).toLowerCase()] = obj_2[item];
        } else {
          newObj[item.toLowerCase()] = obj_2[item];
        }
      });
    } else {
      if (Array.isArray(value) || typeof value === 'object') {
        if (keyP) {
          newObj[(keyP + '-' + key).toLowerCase()] = JSON.stringify(value);
        } else {
          newObj[key.toLowerCase()] = JSON.stringify(value);
        }
      } else {
        if (keyP) {
          newObj[(keyP + '-' + key).toLowerCase()] = value;
        } else {
          newObj[key.toLowerCase()] = value;
        }
      }
    }
  }
  return newObj;
}
