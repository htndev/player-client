<template>
  <div class="image-cropper">
    <vue-cropper :src="file" ref="cropper" :aspect-ratio="aspectRatio" zoomable preview=".preview" />
    <div class="preview q-mt-md" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import VueCropper from 'vue-cropperjs';
import eventBus from '@/common/event-bus';
import 'cropperjs/dist/cropper.css';
import { isNull, Nullable } from '@xbeat/toolkit';
import { fileToDataUrl, dataUrlToBlob } from '@xbeat/client-toolkit';

@Component({ components: { VueCropper } })
export default class ImageCropper extends Vue {
  $refs!: { cropper: any };
  private file = '';

  @Prop({ type: Number })
  aspectRatio!: number;

  @Prop({ type: [File, Object] })
  src!: Nullable<File>;

  created() {
    eventBus.$on('crop', this.crop);
  }

  @Watch('src', { immediate: true, deep: true })
  async onSrcChanged(image: File | null) {
    if (isNull(image)) {
      return;
    }

    this.file = await fileToDataUrl(image);
    this.$refs.cropper.replace(this.file);
  }

  async crop() {
    if (!this.$refs.cropper) {
      return;
    }

    const dataUrl = await this.$refs.cropper?.getCroppedCanvas().toDataURL('image/jpeg', 0.5);
    const file = await dataUrlToBlob(dataUrl);

    this.$emit('cropped', file);
  }
}
</script>

<style lang="less" scoped>
.image-cropper {
  .preview {
    width: 100%;
    height: calc(200px);
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
