export function checkPermissionForDisplayPermissions(UsersPermissions: any, record: any): boolean {
  // const userName = UsersPermissions.UserName
  // eslint-disable-next-line no-console
  // console.log('perm', UsersPermissions);
  // eslint-disable-next-line no-console
  // console.log('Record', record);
  const isCreator = UsersPermissions.UserName === record.UsersQuery;
  const adminORPowerUser = UsersPermissions.Admin || UsersPermissions.LisaPowerUsers;
  const isOwnerSelf = record.Owners.indexOf(UsersPermissions.UserName) !== -1;
  const isOwnerGroup = record.Owners.some((owner: any) => {
    const valid = UsersPermissions.IamGroups.indexOf(owner);
    if (valid !== -1) {
      return true;
    }
  });
  if (isCreator || adminORPowerUser || isOwnerSelf || isOwnerGroup) {
    return true;
  } else {
    return false;
  }
  //?COND1: the user creator of the table (usersquery == username)
  //?COND2: the user is in the tables owners list
  //?COND3: the user is member of a group that is member in the table owners list
  //?COND4: the user is admin or poweruser.
}
