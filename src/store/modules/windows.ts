/* eslint-disable no-console */
// import Vue from 'vue';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { store } from '~/store';

export enum WindowName {
  ANALYTICS = 'analytics',
  DATA_COLLECTION = 'data_collection',
  ADMIN_WINDOW = 'admin_window',
  QUERY_HISTORY = 'query_history',
  EVENTS_WINDOW = 'events-window',
  TERMS_WINDOW = 'terms-window',
  USERS_SETTINGS = 'settings-window',
  PRIVACY_WINDOW = 'privacy-policy-window',
}

export interface WindowData {
  minimized: boolean;
  label: string;
  name: WindowName;
  zIndex: number;
  index: number;
  windowName: string;
}

const labels: Record<WindowName, string> = {
  [WindowName.ANALYTICS]: 'Analytics Window',
  [WindowName.DATA_COLLECTION]: 'Data collection',
  [WindowName.ADMIN_WINDOW]: 'Admin Window',
  [WindowName.QUERY_HISTORY]: 'Query history',
  [WindowName.EVENTS_WINDOW]: 'Events window',
  [WindowName.TERMS_WINDOW]: 'PDF Viewer window',
  [WindowName.USERS_SETTINGS]: 'User Settings window',
  [WindowName.PRIVACY_WINDOW]: 'privacy policy window',
};

@Module({ dynamic: true, name: 'windows', store })
class Windows extends VuexModule {
  focusedWindow: Nullable<WindowName> = null;
  focusedIndex: Nullable<number> = null;
  activeWindows: Array<WindowData> = [];
  lastZIndex: number = 50;
  activeWindowsIndex: number = 0;

  @Mutation
  private SET_FOCUSED_WINDOW(name: Nullable<WindowName>) {
    if (name) {
      const window = this.activeWindows[this.activeWindowsIndex];
      if (window) {
        window.zIndex = ++this.lastZIndex;
      }
    }
  }

  @Mutation
  private ADD_ACTIVE_WINDOW(name: WindowName) {
    this.activeWindows.push({
      name,
      minimized: false,
      label: labels[name],
      zIndex: this.lastZIndex++,
      index: this.activeWindows.length,
      windowName: labels[name],
    });

    this.activeWindowsIndex = this.activeWindows.length - 1;
  }

  @Mutation
  private UPDATE_WINDOW_NAME(name: string) {
    this.activeWindows[this.activeWindowsIndex].windowName = name;
  }

  @Mutation
  private REMOVE_ACTIVE_WINDOW(index: number) {
    const windows = [...this.activeWindows].filter((item: any) => item.index != index); //
    this.activeWindows = windows.map((item: any) => {
      return {
        ...item,
        index: item.index < index ? item.index : item.index - 1,
      };
    });
  }

  @Mutation
  private UPDATE_WINDOW(payload: { index: number; data: Partial<WindowData> }) {
    const { index, data } = payload;
    if (this.activeWindows[index]) {
      Object.assign(this.activeWindows[index], data);
      this.activeWindowsIndex = index;
    }
  }

  @Action
  public openWindow(payload: { name: WindowName; index: any }) {
    if (payload.index !== undefined) {
      this.UPDATE_WINDOW({ index: payload.index, data: { minimized: false } });
    } else {
      if (this.activeWindows.length < 10) {
        this.ADD_ACTIVE_WINDOW(payload.name);
      }
    }
    this.SET_FOCUSED_WINDOW(payload.name);
  }

  @Action
  public closeWindow(index: number) {
    this.REMOVE_ACTIVE_WINDOW(index);
    this.SET_FOCUSED_WINDOW(null);
  }

  @Action
  public minimizeWindow(index: number) {
    this.UPDATE_WINDOW({
      index,
      data: {
        minimized: true,
      },
    });
    this.SET_FOCUSED_WINDOW(null);
  }

  @Action
  public editWindowName(name: string) {
    this.UPDATE_WINDOW_NAME(name);
  }
}

export const WindowsModule = getModule(Windows);
