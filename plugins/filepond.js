import Vue from 'vue'
import VueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginMediaPreview from 'filepond-plugin-media-preview'
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'

const FilePond = VueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileMetadata,
  FilePondPluginMediaPreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageCrop
)

Vue.component(FilePond)
