<template>
  <main class="settings">
    <h1 class="text-h4">{{ $t('settings.title') }}</h1>

    <q-splitter v-model="splitterModel">
      <template #before>
        <q-tabs v-model="tab" vertical>
          <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :icon="tab.icon" :label="tab.label" />
        </q-tabs>
      </template>
      <template #after>
        <q-tab-panels v-model="tab" animated vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
            <component :is="tab.component" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GeneralSettings from '@/components/Settings/GeneralSettings.vue';
import AvatarSettings from '@/components/Settings/AvatarSettings.vue';
import SecuritySettings from '@/components/Settings/SecuritySettings.vue';

@Component({ components: { GeneralSettings, AvatarSettings, SecuritySettings } })
export default class Settings extends Vue {
  tab = this.tabs[0].name;

  get tabs() {
    return [
      {
        name: GeneralSettings.name,
        icon: 'manage_accounts',
        label: this.$t('settings.general'),
        component: GeneralSettings.name
      },
      { name: AvatarSettings.name, icon: 'face', label: this.$t('settings.avatar'), component: AvatarSettings.name },
      {
        name: SecuritySettings.name,
        icon: 'shield',
        label: this.$t('settings.security'),
        component: SecuritySettings.name
      }
    ];
  }

  get splitterModel(): number {
    return this.$q.screen.width > 420 ? 20 : 30;
  }

  created() {
    console.log(GeneralSettings.name);
  }
}
</script>

<style lang="less" scoped></style>
