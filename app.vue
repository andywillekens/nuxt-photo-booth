<script lang="ts" setup>
  const liveFeed = ref<HTMLVideoElement | null>(null)
  const latestPicture = ref<HTMLCanvasElement | null>(null)
  const pictureArray = ref([] as Picture[])
  const scrollCarousel = ref<HTMLElement | null>(null)
  const cameraEnabled = ref<Boolean>(false)

  const getVideoFeed = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user'
        }
      })
      .then((localMediaStream) => {
        if (liveFeed.value && localMediaStream) {
          liveFeed.value.srcObject = localMediaStream
          liveFeed.value.play()
          cameraEnabled.value = true
        } else {
          cameraEnabled.value = false
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const takePicture = () => {
    if (liveFeed.value && latestPicture.value) {
      const context = latestPicture.value.getContext('2d')
      if (context) {
        // Equal the live feed width and height
        latestPicture.value.width = liveFeed.value.videoWidth
        latestPicture.value.height = liveFeed.value.videoHeight

        // Flip the picture
        context.translate(liveFeed.value.videoWidth, 0)
        context.scale(-1, 1)

        // Draw the current frame into the canvas
        context.drawImage(
          liveFeed.value,
          0,
          0,
          liveFeed.value.videoWidth,
          liveFeed.value.videoHeight
        )

        // Add latest picture to array
        const imageData = latestPicture.value?.toDataURL('image/jpeg')
        const imageObject = {
          name: `photo-${pictureArray.value.length}`,
          data: imageData,
          alt: 'nuxt-photo-booth-picture',
          ext: '.jpg'
        } as Picture
        pictureArray.value.push(imageObject)
      }
    }
  }

  const pictureToDelete = (key: Picture) => {
    let index = pictureArray.value.indexOf(key)
    if (index !== -1) {
      pictureArray.value.splice(index, 1)
    }
  }

  const scrollX = (scroll: WheelEvent) => {
    scroll.stopPropagation()
    if (scrollCarousel.value) {
      scrollCarousel.value.scrollLeft += scroll.deltaY
    }
  }

  onBeforeMount(() => {
    getVideoFeed()
  })
</script>
<template>
  <main>
    <!-- Overlay -->
    <section
      v-if="!cameraEnabled"
      class="flex justify-center items-center bg-black/80 text-blue-600 w-full h-full absolute top-0 left-0 z-40">
      <Icon name="svg-spinners:90-ring-with-bg" size="90" />
    </section>
    <!-- Live video feed -->
    <video
      ref="liveFeed"
      class="w-full h-full absolute object-cover top-0 left-0 z-0 scale-x-[-1]"></video>
    <!-- Needed to convert to downloadable picture -->
    <canvas ref="latestPicture" class="hidden"></canvas>
    <!-- UI footer -->
    <section
      class="w-full h-auto min-h-32 bg-blue-950/10 flex justify-start items-center pl-6 gap-3 absolute z-10 bottom-0">
      <!-- Photo button -->
      <PhotoButton @click="takePicture">
        <Icon name="ph:camera-duotone" size="32" />
      </PhotoButton>
      <!-- Preview scroller -->
      <section
        @wheel="scrollX"
        ref="scrollCarousel"
        class="w-full grid grid-flow-col auto-cols-max py-3 pl-3 gap-3 overflow-visible whitespace-nowrap hideScroll [mask-image:_linear-gradient(to_right,transparent_0,_purple_20px,_black_calc(100%-200px),transparent_100%)]">
        <!-- Preview photo -->
        <TransitionGroup
          enter-from-class="opacity-0 scale-90 rotate-12"
          leave-to-class="opacity-0 scale-90 -rotate-12"
          enter-active-class="transition duration-100"
          leave-active-class="transition duration-100">
          <template v-for="picture in pictureArray" :key="picture.name">
            <div class="group relative" :id="picture.name">
              <!-- Download & delete buttons -->
              <ActionButtons :picture="picture" @deletePicture="pictureToDelete" />
              <!-- Preview image -->
              <NuxtImg
                :src="picture.data"
                :alt="picture.alt"
                class="w-full h-full origin-bottom-left aspect-square max-w-24 flex-shrink-0 object-cover" />
            </div>
          </template>
        </TransitionGroup>
      </section>
    </section>
  </main>
</template>
