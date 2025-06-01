<template>
  <button type="button" class="container" @click="showMenu">
    <div class="logo">
      <img
        class="logo__img"
        :src="require('~/assets/images/logo_light.png')"
        alt="logo"
      />
    </div>
    <div class="delimiter" />
    <div class="icon">
      <Icon name="menu" :width="16" :height="16" />
    </div>
    <template v-if="isLoad">
      <Loader accent />
    </template>
  </button>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import { AD_HTML_TAG_ID } from '~/constants';
// import { AD_SCRIPT_SRC } from '~/cons\tants';
import { MenuModule } from '~/store/modules/menu';

// @Component({
//   name: 'MenuButton',
//   components: { Icon, Loader },
// })
export default defineComponent({
  name: 'MenuButton',
  components: { Icon, Loader },
  setup() {
    const isLoad: Ref<boolean> = ref(false);
    function test() {
      let a: any = window,
        g;
      let l: any = {
        zones: [],
        prefix: a.reviveAsync[AD_HTML_TAG_ID].name + '-' + a.reviveAsync[AD_HTML_TAG_ID].id + '-',
      };
      const q = new RegExp('^' + a.reviveAsync[AD_HTML_TAG_ID].getDataAttr('(.*)') + '$');
      let e = document.querySelectorAll(
        'ins[' + a.reviveAsync[AD_HTML_TAG_ID].getDataAttr('id') + "='" + AD_HTML_TAG_ID + "']",
      );

      const n = e[0];
      n.setAttribute(a.reviveAsync[AD_HTML_TAG_ID].getDataAttr('loaded'), '0');

      let s;
      let k: any = a.reviveAsync[AD_HTML_TAG_ID].getDataAttr('seq');

      if (n.hasAttribute(k)) {
        s = n.getAttribute(k);
      } else {
        s = a.reviveAsync[AD_HTML_TAG_ID].seq++;
        n.setAttribute(k, s as any);
        n.id = l.prefix + s;
      }
      for (var h = 0; h < n.attributes.length; h++) {
        if ((g = n.attributes[h].name.match(q))) {
          if ('zoneid' === g[1]) {
            l.zones[s as any] = n.attributes[h].value;
          } else {
            if (!/^(id|seq|loaded)$/.test(g[1])) {
              l[g[1] as any] = n.attributes[h].value;
            }
          }
        }
      }

      a.reviveAsync[AD_HTML_TAG_ID].apply(l);
    }
    function showMenu(): void {
      isLoad.value = true;
      setTimeout(() => {
        if (isLoad.value) {
          isLoad.value = false;
          MenuModule.openMenu();
        }
      }, 5000);
      // test();
      setTimeout(() => {
        isLoad.value = false;
        MenuModule.openMenu();
      }, 2000);
    }
    return {
      isLoad,
      showMenu,
      test,
    };
  },
});
</script>

<style  scoped lang="scss">
.container {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  padding-top: 5px;
  // padding-right: 3px;
  // padding-left: 3px;

  &__img {
    width: 100%;
    height: 100%;
  }
}

.delimiter {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 1px;
}

.icon {
  color: #fff;
  padding: 0 10px;
  display: flex;
}
</style>
