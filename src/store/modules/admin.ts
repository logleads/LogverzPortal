import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import {
  AdminWindowService,
  AdminWindowService as IdentitiesService,
} from '~/services/api/admin-window-service';
import { store } from '~/store';
import { ErrorsModule } from '~/store/modules/errors';
import { AsyncStatus } from '~/types';
import {
  groupResponse,
  payloadForUpdate,
  payloadForUpdate2,
  PermissionsTypes,
  policiesResponse,
  rolesResponse,
  userResponse,
} from '~/types/models/admin-window-types';
import { parseFormatTimeUTS } from '~/utils/parsTimeUTC';

@Module({ dynamic: true, name: 'identities', store })
class Admin extends VuexModule {
  users: userResponse[] = [];
  usersNotAWS: userResponse[] = [];
  groups: groupResponse[] = [];
  policies: policiesResponse[] = [];
  roles: rolesResponse[] = [];
  platform: any = [];

  usersStatus: AsyncStatus = AsyncStatus.IDLE;
  groupsStatus: AsyncStatus = AsyncStatus.IDLE;
  policiesStatus: AsyncStatus = AsyncStatus.IDLE;
  rolesStatus: AsyncStatus = AsyncStatus.IDLE;
  platformStatus: AsyncStatus = AsyncStatus.IDLE;

  permissions: PermissionsTypes = {
    Admin: false,
    LisaPowerUsers: false,
    LisaUsers: false,
    UserName: '',
    Azure:false
    
  };
  identitySyncFetching = false;
  isReceivedPermissions = false;

  availableTypes: string[] = [];
  currentType = '';

  usersOfGroups: any = {};
  usersGroupsFetching: any = {};

  usersOfPolicies: any = {};
  usersPoliciesFetching: any = {};
  lastSyncTime: { utcTime?: string; localTime?: string } = {};

  @Mutation
  private SET_PERMISSIONS(obj: PermissionsTypes) {
    this.permissions = obj;
    
  }

  @Mutation
  private SET_STATUS_USERS_OF_POLICIES(payload: { policyName: string; fetching: boolean }) {
    this.usersPoliciesFetching = {
      ...this.usersPoliciesFetching,
      [payload.policyName]: payload.fetching,
    };
  }

  @Mutation
  private SET_STATUS_USERS_OF_GROUPS(payload: { groupName: string; fetching: boolean }) {
    this.usersGroupsFetching = {
      ...this.usersGroupsFetching,
      [payload.groupName]: payload.fetching,
    };
  }

  @Mutation
  private SET_USERS_OF_GROUP(payload: { group: string; data: any }) {
    this.usersOfGroups = {
      ...this.usersOfGroups,
      [payload.group]: payload.data,
    };
  }

  @Mutation
  private SET_USERS_OF_POLICY(payload: { policy: string; data: any }) {
    this.usersOfPolicies = {
      ...this.usersOfPolicies,
      [payload.policy]: payload.data,
    };
  }

  @Mutation
  private SET_CURRENT_TYPE(value: string) {
    this.currentType = value;
  }

  @Mutation
  private SET_LAST_SYNC_TIME(value: { utcTime: string; localTime: string }) {
    this.lastSyncTime = value;
  }

  @Mutation
  private SET_AVAILABLE_TYPES(value: string[]) {
    this.availableTypes = value.map(i => 'User' + i);
  }

  @Mutation
  private RECEIVE_PERMISSIONS() {
    this.isReceivedPermissions = true;
  }

  @Mutation
  private SET_IDENTITY_SYNC_STATUS(status: boolean) {
    this.identitySyncFetching = status;
  }

  @Mutation
  private SET_USERS_STATUS(status: AsyncStatus) {
    this.usersStatus = status;
  }

  @Mutation
  private SET_USERS(users: userResponse[]) {
    this.users = users;
  }

  @Mutation
  private SET_USER_NOT_AWS(users: userResponse[]) {
    this.usersNotAWS = users.filter(i => i.Type !== 'UserAWS');
  }

  @Mutation
  private SET_GROUPS_STATUS(status: AsyncStatus) {
    this.groupsStatus = status;
  }

  @Mutation
  private SET_GROUPS(groups: groupResponse[]) {
    this.groups = groups;
  }

  @Mutation
  private SET_POLICIES_STATUS(status: AsyncStatus) {
    this.policiesStatus = status;
  }

  @Mutation
  private SET_POLICIES(policies: policiesResponse[]) {
    this.policies = policies;
  }
  @Mutation
  private SET_ROLES_STATUS(status: AsyncStatus) {
    this.rolesStatus = status;
  }

  @Mutation
  private SET_ROLES(roles: rolesResponse[]) {
    this.roles = roles;
  }

  @Mutation
  private SET_PLATFORM_STATUS(status: AsyncStatus) {
    this.platformStatus = status;
  }

  @Mutation
  private SET_PLATFORM(platform: any) {
    this.platform = platform;
  }

  @Action
  public setCurrentType(value: string) {
    this.SET_CURRENT_TYPE(value);
  }

  @Action
  public async getUsers() {
    this.SET_USERS_STATUS(AsyncStatus.LOADING);

    try {
      const data = await IdentitiesService.getUsers();
      this.SET_USERS(data);
      this.SET_USER_NOT_AWS(data);
      await this.getUsersTypes();
      this.SET_USERS_STATUS(AsyncStatus.SUCCESS);
    } catch (e: any) {
      this.SET_USERS_STATUS(AsyncStatus.FAIL);
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async createUser(payload: {
    Name: string;
    Type: string;
    IAMGroups: string[];
    IAMPolicies: string[];
  }): Promise<void> {
    try {
      await AdminWindowService.createUser(payload);
      await this.getUsers();
      
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async updateUser(payload: payloadForUpdate): Promise<void> {
    try {
      await AdminWindowService.updateUser(payload);
      await this.getUsers();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }
  @Action
  public async updateUser2(payload: payloadForUpdate2): Promise<void> {
    try {
      await AdminWindowService.updateUser2(payload);
      await this.getUsers();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async deleteUser(payload: { Name: string; Type: string }): Promise<void> {
    try {
      await AdminWindowService.deleteUser(payload);
      await this.getUsers();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async checkIfAdmin() {
    try {
      const data = await IdentitiesService.checkIfAdmin();

      this.SET_PERMISSIONS(data);
      this.RECEIVE_PERMISSIONS();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getGroups() {
    this.SET_GROUPS_STATUS(AsyncStatus.LOADING);

    try {
      const data = await IdentitiesService.getGroups();
      this.SET_GROUPS(data);
      this.SET_GROUPS_STATUS(AsyncStatus.SUCCESS);
    } catch (e: any) {
      this.SET_GROUPS_STATUS(AsyncStatus.FAIL);
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getPolicies() {
    this.SET_POLICIES_STATUS(AsyncStatus.LOADING);

    try {
      const PolicyLGVZ = await IdentitiesService.getPolicies('PolicyLGVZ');
      const PolicyAWS = await IdentitiesService.getPolicies('PolicyAWS');

      const data = [...PolicyLGVZ, ...PolicyAWS];

      this.SET_POLICIES(data);
      this.SET_POLICIES_STATUS(AsyncStatus.SUCCESS);
    } catch (e: any) {
      this.SET_POLICIES_STATUS(AsyncStatus.FAIL);
      ErrorsModule.showErrorMessage(e.message);
    }
  }
  @Action
  public async createPolicy(payload: {
    Name: string;
    Type: string;
    Document: string;
    Associations: string[];
  }): Promise<void> {
    try {
      await AdminWindowService.createPolicy(payload);
      await this.getUsers();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getRoles() {
    this.SET_ROLES_STATUS(AsyncStatus.LOADING);
    try {
      const ROLESAWS = await IdentitiesService.getRoles();
      
      this.SET_ROLES(ROLESAWS);
      this.SET_ROLES_STATUS(AsyncStatus.SUCCESS);
    } catch (e: any) {
      this.SET_ROLES_STATUS(AsyncStatus.FAIL);
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async startIdentitySync() {
    this.SET_IDENTITY_SYNC_STATUS(true);
    try {
      await AdminWindowService.startIdentitySync();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IDENTITY_SYNC_STATUS(false);
    }
  }

  @Action
  public async getUsersTypes() {
    try {
      const data = await AdminWindowService.getUsersAvailableType();
      this.SET_AVAILABLE_TYPES(data);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getUserOfGroup(groupName: string) {
    this.SET_STATUS_USERS_OF_GROUPS({ groupName, fetching: true });
    try {
      const payload = await AdminWindowService.getUserOfGroup(groupName);
      this.SET_USERS_OF_GROUP({ group: payload.groupName, data: payload.data });
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_STATUS_USERS_OF_GROUPS({ groupName, fetching: false });
    }
  }

  @Action
  public async getUserOfPolicy(policyName: string) {
    this.SET_STATUS_USERS_OF_POLICIES({ policyName, fetching: true });
    try {
      const payload = await AdminWindowService.getUserOfPolicy(policyName);
      this.SET_USERS_OF_POLICY({ policy: payload.policyName, data: payload.data });
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_STATUS_USERS_OF_POLICIES({ policyName, fetching: false });
    }
  }

  @Action
  public async getLastSyncTime() {
    try {
      const unixTimeLastSync: Date = await AdminWindowService.getLastSyncTime();
      const lastSyncTime = parseFormatTimeUTS(unixTimeLastSync);
      this.SET_LAST_SYNC_TIME(lastSyncTime);
    } catch (error: any) {
      ErrorsModule.showErrorMessage(error.message);
    }
  }
}

export const AdminModule = getModule(Admin);
