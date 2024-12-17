<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({linkify: true})

const props = defineProps({
  source: {
    type: String,
    default: ''
  }
})

const { source } = toRefs(props)
const showDialog = ref(false)
const selectedReference = ref<string | null>(null)
const referenceContent = ref<Record<string, string>>({})

const idMap = ref<Record<string, number>>({})
let linkCounter = 1

const renderedMarkdown = computed(() => {
  linkCounter = 1
  idMap.value = {}

  const rendertMarkdown = markdown.render(source.value);

  const markdownLink = rendertMarkdown.replace(/\[[^\]]{0,40}\]/g, (match) => {
    if (!idMap.value[match]) {
      idMap.value[match] = linkCounter++
      referenceContent.value[match] = `Referenz-ID: ${match}`
    }
    const displayNumber = idMap.value[match]
    return ` [<a href="#" data-ref="${match}" class="ref-link">${displayNumber}</a>]`
  })

  return markdownLink;
})

const handleLinkClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('ref-link')) {
    event.preventDefault()
    const refId = target.getAttribute('data-ref')
    if (refId) {
      selectedReference.value = refId
      showDialog.value = true
    }
  }
}

</script>

<template>
  <div v-html="renderedMarkdown" @click="handleLinkClick"></div>
  <v-dialog v-model="showDialog" max-width="500">
    <v-card>
      <v-card-title>Details to the used source</v-card-title>
      <v-card-text v-if="selectedReference">
        {{ referenceContent[selectedReference] }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
.ref-link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>