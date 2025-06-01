<!-- //global-notifications.vue -->
<template name="component-name">
  <div class="box">
    <div class="indecator" @click="() => openDropDownNotifications()">
      <img :src="require('~/assets/images/bell.png')" alt="notification" />
      <span v-if="notifications > 0" class="num">{{ notifications }}</span>
    </div>
    <div v-if="isOpenDropDownNotification" class="drop-down">
      <div class="drop-down__box">
        <div class="drop-down__first-part">
          <div class="tabset">
            <div class="tab-panels">
              <section id="globalnews" class="tab-panel">
                <div id="accordion" class="acc">
                  <div class="faq-box">
                    <div
                      v-for="notification in globalNotificationsList.Notification"
                      :key="notification.id"
                      class="faq"
                    >
                      <input :id="notification.id" class="radio-input" type="radio" />

                      <label class="faq-label" :for="notification.id">
                        <img
                          v-if="notification.imgurl"
                          :src="notification.imgurl"
                          width="50"
                          height="50"
                          alt="Image"
                          style="float: left"
                        />
                        {{ notification.type }}
                        <small class="small-font">{{ notification.date }}</small>
                      </label>
                      <div class="faq-content">
                        <div class="parent">
                          <div
                            class="child child2"
                            v-html="notification.detail"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, ref } from 'vue';

// import DxAccordion from 'devextreme-vue/accordion';
import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { UserModule } from '~/store/modules/user';

export default defineComponent({
  name: 'GlobalNotifications',
  components: {
    // DxAccordion,
    // CustomTitle,
    // CustomItem,
  },
  setup() {
    const notifications = ref(0);
    function unckeck(myRadio: any, id: any) {
      console.log('my', myRadio);
      // if (lastChecked == myRadio) {
      // lastChecked = null;
      myRadio.checked = false;
      // } else lastChecked = myRadio;
    }
    const isOpenDropDownNotification = computed(() => {
      // console.log(UserModule.DisplayDropDown);
      return UserModule.DisplayDropDownNotification;
    });
    async function fetchglobalNotifications() {
      await UserModule.getGlobalNotifications();
    }
    const globalNotificationsList = computed(() => {
      const listItem = UserModule.globalNotificationsList;
      const notificationCount = localStorage.getItem('notificationcount');
      if (notificationCount && notificationCount < listItem.id) {
        localStorage.setItem('notificationcount', listItem.id);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        notifications.value = +listItem.id - +notificationCount;
      }
      return listItem;
    });

    onMounted(() => {
      // fetchglobalNotifications();
    });
    const timerId_GN: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.timerID;
    });

    function openDropDownNotifications() {
      if (!isOpenDropDownNotification.value) {
        fetchglobalNotifications();
      }
      ConnectionIndecatoreModule.setDisplayDropdown(false);
      if (timerId_GN.value) {
        clearInterval(timerId_GN.value);
      }
      console.log(1);
      UserModule.setDisplayDropdownNotification(!isOpenDropDownNotification.value);
    }

    // function makeNotificationRead(nitfID){

    // }
    return {
      isOpenDropDownNotification,
      openDropDownNotifications,
      globalNotificationsList,
      notifications,
      unckeck,
    };
  },
});
</script>

<style  scoped lang="scss">
/*
 CSS for the main interaction
*/
.tabset > input[type='radio'] {
  position: absolute;
  left: -200vw;
}
//TODO: remove once tabs are added.
.tabset .tab-panel {
  // display: none;
}

.tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
.tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
.tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
.tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
.tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
.tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
  display: block;
}

.tabset > label {
  position: relative;
  display: inline-block;
  padding: 15px 15px 25px;
  border: 1px solid transparent;
  border-bottom: 0;
  cursor: pointer;
  font-weight: 600;
}

.tabset > label::after {
  content: '';
  position: absolute;
  left: 15px;
  bottom: 10px;
  width: 22px;
  height: 4px;
  background: #8d8d8d;
}

input:focus-visible + label {
  outline: 2px solid rgba(0, 102, 204, 1);
  border-radius: 3px;
}

.tabset > label:hover,
.tabset > input:focus + label,
.tabset > input:checked + label {
  color: #06c;
}

.tabset > label:hover::after,
.tabset > input:focus + label::after,
.tabset > input:checked + label::after {
  background: #06c;
}

.tabset > input:checked + label {
  border-color: #ccc;
  border-bottom: 1px solid #fff;
  margin-bottom: -1px;
}

.tab-panel {
  padding: 0 0;
  // padding: 30px 0;
  border-top: 1px solid #ccc;
}

.tabset {
  max-width: 65em;
}

.indecator {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  display: flex;
}

.drop-down {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 24px rgb(0 0 0 / 5%);
  border: 1px solid rgba(181, 190, 203, 0.28);
  border-radius: 10px;

  width: 300px;
  z-index: 100;

  &__box {
    color: #1a1b20;
    padding: 15px;
    font-weight: 600;
    font-size: 12px;
    line-height: 1;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    margin-left: 20px;
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;

    &__center {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button {
      margin-right: 7px;
    }
  }

  &__bd {
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 5px 0;
  }

  &__ind {
    margin: 0 20px;
    width: 20px;
    height: 20px;
    border-radius: 50px;
    background-color: green;
  }

  &__header {
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    border: 1px solid #1a1b20;

    &__title {
      display: flex;
      justify-content: start;
      align-items: center;
      span {
        margin: 0 20px;
      }
    }
  }

  &__counter {
    margin: 5px 0;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 5px;
    border: 1px solid #1a1b20;

    span {
      margin: 0 10px;
      cursor: pointer;
    }

    &__self {
      display: flex;
      justify-content: end;
      align-items: center;
      width: 200px;

      &__flex {
        display: flex;
        justify-content: start;
        align-items: center;
        cursor: pointer;
      }
    }

    &__left {
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
}

.box {
  position: relative;
}

.radio-input {
  position: absolute;

  opacity: 0;

  z-index: -1;
}

.faq {
  color: #ffffff;

  margin-bottom: 0.5rem;
}

.faq-label {
  font-size: 0.8rem;

  display: flex;

  align-items: center;

  justify-content: space-between;

  // padding: 1em;

  // background: #88c4be;

  // font-weight: bold;

  cursor: pointer;

  user-select: none;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border: 1px solid #1a1b20;
  color: #1a1b20;
}

.faq-label::after {
  content: '\002B';

  padding: 0.51rem;

  transform: scale(1.8);

  text-align: center;

  transition: all 0.35s;
}

.faq-content {
  max-height: 0;

  padding: 0 1em;

  color: #2c3e50;

  background: white;

  transition: all 0.35s;

  display: none;
}

input:checked + .faq-label {
  // background: #88c4be;
}

input:checked + .faq-label::after {
  content: '\2013';

  transform: scale(1.5);
}

input:checked ~ .faq-content {
  max-height: 130vh;

  padding: 1em;

  display: block;

  transition: all 0.35s;
}
.parent {
  display: flex;
}

.child {
  // border: 1px solid black;
  // padding: 10px;
}

.child1 {
  flex-basis: 25%;
}

.child2 {
  flex-basis: 100%;
}
.child3 {
  flex-basis: 100%;
}
.small-font {
  font-size: xx-small;
}
.num {
  position: absolute;
  right: 3px;
  border-radius: 50rem;
  top: 6px;
  color: #fff;
  background-color: red;
  padding: 5px;
  font-size: x-small;
}
</style>
