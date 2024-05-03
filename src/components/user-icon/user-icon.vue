<template>
  <div>
    <img :src="require('~/assets/images/user-icon.svg')" alt="user-icon" />
    <span>Johnathan Doe</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// @Component({
//   name: 'UserIcon',
// })
export default defineComponent({
  name: 'UserIcon',
});
</script>
