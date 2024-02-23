<script lang="ts" setup>
  type Picture = {
    data: string
    alt: string
    ext: string
  }

  const liveFeed = ref<HTMLVideoElement | null>(null)
  const photoStrip = ref<HTMLElement | null>(null)
  const latestPicture = ref<HTMLCanvasElement | null>(null)
  const pictureArray = ref([] as Picture[])
  const scrollCarousel = ref<HTMLElement | null>(null)

  const getVideoFeed = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user'
        }
      })
      .then((localMediaStream) => {
        if (liveFeed.value) {
          liveFeed.value.srcObject = localMediaStream
          liveFeed.value.play()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const takePhoto = () => {
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
          data: imageData,
          alt: 'Knappe beer',
          ext: '.jpg'
        } as Picture
        pictureArray.value.push(imageObject)
      }
    }
  }

  const scrollX = (scroll: WheelEvent) => {
    scroll.stopPropagation()
    if (scrollCarousel.value) {
      console.log(scroll.deltaY)
      scrollCarousel.value.scrollLeft += scroll.deltaY
    }
  }

  onBeforeMount(() => {
    getVideoFeed()
  })
</script>
<template>
  <!-- Photo booth -->
  <main>
    <!-- Live feed -->
    <video
      ref="liveFeed"
      class="w-full h-full absolute object-cover top-0 left-0 z-0 scale-x-[-1]"></video>
    <!-- Latest picture taken -->
    <canvas ref="latestPicture" class="hidden"></canvas>
    <!-- Controls -->
    <section class="flex flex-col w-full absolute z-10 bottom-0">
      <!-- Photostrip -->
      <section
        ref="photoStrip"
        class="w-full h-auto min-h-32 bg-blue-950/5 flex justify-start items-center pl-6 gap-3">
        <button
          @click="takePhoto"
          class="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full group text-blue-200 hover:text-blue-100 border-2 border-blue-200 hover:border-blue-100 flex-shrink-0 transition-colors duration-300">
          <Icon name="ph:camera-duotone" size="32" />
        </button>
        <!-- grid-template-columns: 1fr 1fr; grid-auto-flow: row dense; -->
        <section
          @wheel="scrollX"
          ref="scrollCarousel"
          class="w-full grid grid-flow-col auto-cols-max py-3 pl-3 gap-3 overflow-visible whitespace-nowrap hideScroll [mask-image:_linear-gradient(to_right,transparent_0,_purple_20px,_black_calc(100%-200px),transparent_100%)]">
          <TransitionGroup
            enter-from-class="opacity-0 scale-90"
            leave-to-class="opacity-0 scale-90"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300">
            <template v-for="picture in pictureArray" :key="picture.data">
              <div class="group relative">
                <!-- Button container -->
                <div
                  class="w-full absolute left-0 -top-2 flex opacity-0 group-hover:opacity-100 justify-around pointer-events-none group-hover:pointer-events-auto translate-y-5 group-hover:translate-y-0 transition-all duration-300">
                  <a
                    :href="picture.data"
                    :download="picture.alt + picture.ext"
                    class="imageButton hover:bg-blue-500/75"
                    title="Download this image">
                    <Icon name="ph:arrow-down" size="18" />
                  </a>
                  <button class="imageButton hover:bg-red-600/75" title="Delete this image">
                    <Icon name="ph:x" size="18" />
                  </button>
                </div>
                <NuxtImg
                  :src="picture.data"
                  :alt="picture.alt"
                  class="w-full h-full origin-bottom-left aspect-square max-w-24 flex-shrink-0 object-cover" />
              </div>
            </template>
          </TransitionGroup>
        </section>
      </section>
    </section>
  </main>
</template>
