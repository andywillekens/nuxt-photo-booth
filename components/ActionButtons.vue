<script setup lang="ts">
  interface Props {
    picture: Picture
  }
  defineProps<Props>()

  const emit = defineEmits(['deletePicture'])

  const triggerDeletePicture = (picture: Picture) => {
    emit('deletePicture', picture)
  }
</script>
<template>
  <div
    class="w-full absolute left-0 -top-2 flex opacity-0 group-hover:opacity-100 justify-around pointer-events-none group-hover:pointer-events-auto translate-y-5 group-hover:translate-y-0 transition-all duration-100">
    <!-- Download -->
    <a
      :href="picture.data"
      :download="picture.alt + picture.ext"
      class="photoButtons hover:bg-blue-500/75 transition-colors duration-100"
      title="Download this image">
      <Icon name="ph:arrow-down" size="18" />
    </a>
    <!-- Delete -->
    <button
      @click="triggerDeletePicture(picture)"
      class="photoButtons hover:bg-red-600/75 transition-colors duration-100"
      title="Delete this image">
      <Icon name="ph:x" size="18" />
    </button>
  </div>
</template>
