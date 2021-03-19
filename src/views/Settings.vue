<template>
  <main class="settings">
    <h1 class="text-h4">{{ $t('settings.title') }}</h1>

    <q-splitter v-model="splitterModel">
      <template #before>
        <q-tabs v-model="tab" vertical>
          <q-tab
            v-for="(tab, index) in tabs"
            :key="tab.name"
            :name="tab.name"
            :icon="tab.icon"
            :label="tab.label"
            @click="navigate(index)"
          />
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

const componentRegex = () =>
  new RegExp(
    `(${[GeneralSettings.name, AvatarSettings.name, SecuritySettings.name]
      .map(component => component.replace(/settings/gi, ''))
      .join('|')})`,
    'gi'
  );

@Component({ components: { GeneralSettings, AvatarSettings, SecuritySettings } })
export default class Settings extends Vue {
  tab: string = this.tabs[0].name;

  get tabs() {
    return [
      {
        name: this.formatTab(GeneralSettings.name),
        icon: 'manage_accounts',
        label: this.$t('settings.general.name'),
        component: GeneralSettings.name
      },
      {
        name: this.formatTab(AvatarSettings.name),
        icon: 'face',
        label: this.$t('settings.avatar.name'),
        component: AvatarSettings.name
      },
      {
        name: this.formatTab(SecuritySettings.name),
        icon: 'shield',
        label: this.$t('settings.security.name'),
        component: SecuritySettings.name
      }
    ];
  }

  get splitterModel(): number {
    return this.$q.screen.width > 420 ? 20 : 30;
  }

  created() {
    const tab = this.$route.query.tab;
    if (!tab) {
      this.$router.push({ query: { tab: this.tabs[0].name } });
      return;
    }

    const navigateTab = this.tabs.find(availableTab => availableTab.name === tab) || this.tabs[0];

    this.tab = navigateTab.name;
  }

  private formatTab(tab: string) {
    const [rawTab] = tab.match(componentRegex()) || [];
    return rawTab.toLowerCase();
  }

  navigate(tabIndex: number) {
    const { name } = this.tabs[tabIndex];
    if (this.$route.query.tab === name) {
      return;
    }

    this.$router.push({ query: { tab: name } });
  }
}
</script>

<style lang="less" scoped></style>
