<template>
  <!-- Button to trigger modal -->

  <!-- Modal Wrapper -->
  <div class="form" v-if="isModalVisible" @click.self="closeModal">
    <div class="form__body">
      <!-- Form Content -->
      <div class="input-wrapper">
        <label class="label">Policy Name</label>
        <Input v-model="formData.policyName" name="policyName" class="__input" placeholder="Enter policy name" />
        <div v-if="policyNameError" class="error-message">{{ policyNameError }}</div>
      </div>

      <div class="input-wrapper">
        <label class="label">Policy Type</label>
        <Input v-model="formData.policyType" name="policyType" class="__input isDisabled" :disabled="true" />
      </div>

      <div class="input-wrapper__multi">
        <label class="label">Associated Group(s)</label>
        <multiselect name="DatasetOwners" :options="groups" :multiple="true" v-model="formData.associatedGroups"
          placeholder="Select Groups" label="name" :close-on-select="true" :clear-on-select="false"
          :preserve-search="true" />
      </div>

      <div class="input-wrapper__multi">
        <label class="label">Associated Role(s)</label>
        <multiselect name="Roles" :options="roles" :multiple="true" v-model="formData.associatedRoles"
          placeholder="Select Roles" label="name" :close-on-select="true" :clear-on-select="false"
          :preserve-search="true" />
      </div>

      <!-- Associated Users -->
      <div class="input-wrapper__multi">
        <label class="label">Associated User(s)</label>
        <multiselect name="Users" :options="users" v-model="formData.associatedUsers" placeholder="Select Users"
          label="name" :multiple="true" :close-on-select="true" :clear-on-select="false" :preserve-search="true" />
      </div>

      <!-- Policy Document Input -->
      <div class="input-wrapper">
        <label class="label"><span>Policy Document</span>

          <ToolTip :tip="POLICY_DOUCMENTS_TOOLTIP" />
        </label>
        <textarea v-model="formData.policyDocument" rows="5" placeholder="Enter the policy document text"
          class="__input"></textarea>
        <div v-if="policyDocumentError" class="error-message">{{ policyDocumentError }}</div>
      </div>

      <div class="button-container">
        <Button text="Save" @click="saveForm" />
      </div>
    </div>
  </div>
</template>
<script>
import { DxButton } from 'devextreme-vue';
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';
import { defineComponent } from 'vue';
import Multiselect from 'vue-multiselect';
import Button from '~/components/shared/button.vue';
import Input from '~/components/shared/input.vue';
import { AdminModule } from '~/store/modules/admin';
import ToolTip from '~/components/shared/tool-tip.vue';
import { POLICY_DOUCMENTS_TOOLTIP } from '~/constants';

export default defineComponent({
  name: 'AddPolicy',
  components: {
    DxButton,
    Multiselect,
    Input,
    Button,
    ToolTip,
  },
  props: {
    closeModal: {
      type: Function,
      required: true,
    },
    updatePolicy: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {

    const isModalVisible = ref(true);

    const getAssociations = (associations = []) => {
      const result = {
        associatedGroups: [],
        associatedRoles: [],
        associatedUsers: [],
      };

      associations.forEach(i => {
        const [name, type] = i.split(':');
        const item = { name, type };

        if (type === 'GroupAWS') result.associatedGroups.push(item);
        else if (type === 'RoleAWS') result.associatedRoles.push(item);
        else result.associatedUsers.push(item);
      });

      return result;
    };

    const formData = reactive(props.updatePolicy ? {
      policyName: props.updatePolicy.Name,
      policyType: 'PolicyLGVZ',
      ...getAssociations(props.updatePolicy.Associations),
      policyDocument: props.updatePolicy.LatestVersion.Document,
    } : {
      policyName: '',
      policyType: 'PolicyLGVZ',
      associatedGroups: [],
      associatedRoles: [],
      associatedUsers: [],
      policyDocument: '',
    });

    const groups = computed(() => AdminModule.groups.map(i => ({ name: i.Name, type: i.Type })));
    const roles = computed(() => AdminModule.roles.map(i => ({ name: i.Name, type: i.Type })));
    const users = computed(() => AdminModule.users.map(i => ({ name: i.Name, type: i.Type })));

    // Validation errors
    const policyNameError = ref('');
    const policyDocumentError = ref('');
    onMounted(async () => {
      await AdminModule.getRoles();
    });

    // Show modal
    const showModal = () => {
      isModalVisible.value = true;
    };

    // Close modal
    const closeModal = () => {
      emit('closeModal');
    };

    // Validate Policy Name
    const validatePolicyName = () => {
      if (!formData.policyName) {
        policyNameError.value = 'Policy name is required';
        return false;
      } else {
        policyNameError.value = '';
        return true;
      }
    };

    // Validate Policy Document (must be valid JSON and minimum 20 characters)
    const validatePolicyDocument = () => {
      if (!formData.policyDocument || formData.policyDocument.length < 20) {
        policyDocumentError.value = 'Policy document must be at least 20 characters long';
        return false;
      }

      try {
        // Convert single quotes to double quotes and parse
        const normalizedJson = formData.policyDocument.replaceAll('"', '').replaceAll("'", '"');
        JSON.parse(normalizedJson);
        policyDocumentError.value = '';
        return true;
      } catch (e) {
        policyDocumentError.value = 'Policy document must be a valid JSON string';
        return false;
      }
    };

    // Save form
    const saveForm = () => {
      const isPolicyNameValid = validatePolicyName();
      const isPolicyDocumentValid = validatePolicyDocument();
      const associations = [
        ...formData.associatedUsers,
        ...formData.associatedRoles,
        ...formData.associatedGroups,
      ];
      const payload = {
        Name: formData.policyName,
        Type: formData.policyType,
        Document: formData.policyDocument,
        Associations: associations.map(item => `${item.name}:${item.type}`),
      };
      if (isPolicyNameValid && isPolicyDocumentValid) {
        AdminModule.createPolicy(payload);
        closeModal();
      }
    };

    // Return values and methods
    return {
      isModalVisible,
      formData,
      groups,
      roles,
      users,
      showModal,
      closeModal,
      saveForm,
      validatePolicyName,
      validatePolicyDocument,
      policyNameError,
      policyDocumentError,
      POLICY_DOUCMENTS_TOOLTIP,
    };
  },
});
</script>

<style scoped lang="scss">
.label {
  display: flex;
  align-content: center;
  margin-bottom: 5px;
  margin-right: 5px;

  &__text {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-right: 7px;
  }

  &__icon {
    color: var(--accent-color);
  }

  & span {
    margin-right: 5px;
  }
}

textarea {
  width: 100%;
  border: 1px solid;
  padding: 10px;
}

.footer {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: end;

  .save-btn {
    background-color: var(--accent-color);
    font-weight: 700;
    color: #fff !important;
    width: 10%;
  }
}

// DevExtreme Popup Global Styles
.dx-overlay-wrapper .dx-popup-wrapper {
  .dx-popup-title {
    font-family: 'Roboto', sans-serif !important;

    .dx-toolbar-items-container {
      font-family: 'Roboto', sans-serif !important;
    }
  }

  .dx-popup-content {
    font-family: 'Roboto', sans-serif !important;

    .dx-texteditor-input,
    .dx-button-text,
    .dx-textbox,
    .dx-textarea,
    .dx-widget,
    input,
    label,
    div {
      font-family: 'Roboto', sans-serif !important;
    }
  }
}

.form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(43, 42, 44, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__body {
    background-color: var(--gray-background);
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 55%;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
  }
}

.error-message {
  color: red;
}

.input-wrapper {
  margin-bottom: 15px;

  &__multi {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
