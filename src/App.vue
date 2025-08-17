<script lang="ts">
import { defineComponent } from "vue";
import FAQAccordion from "./components/FAQAccordion.vue";

export default defineComponent({
  name: "App",
  components: {
    FAQAccordion,
  },
});
</script>

<template>
  <FAQAccordion />
</template>

<style>
/* Define CSS Variables for the new, softer palette */
:root {
  --color-background: #F0F4F8; /* Very light blue-grey */
  --color-surface: #FFFFFF; /* Pure white for cards/sections */
  --color-text: #2C3E50; /* Dark blue-grey for main text */
  --color-text-secondary: #7F8C8D; /* Medium grey for descriptions */
  --color-primary: #3498DB; /* Vibrant Sky Blue - cool, modern */
  --color-secondary: #2ECC71; /* Emerald Green - complementary cool tone, fresh */
  --color-accent: #9B59B6; /* Amethyst - for subtle highlights if needed */
  --color-border: #DCE4EC; /* Light grey-blue for borders */
  --color-shadow-light: rgba(44, 62, 80, 0.08);
  --color-shadow-medium: rgba(44, 62, 80, 0.15);
}

/* Global styles for the webpart container */
#UNIQUECLIENTAPP {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
  box-sizing: border-box;
}
</style>