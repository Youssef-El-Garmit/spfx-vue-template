<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<template>
  <div class="spfx-landing-container">
    <header class="hero-section">
      <h1 class="hero-title">Your AI-Powered SharePoint Webpart Studio</h1>
      <p class="hero-description">Unlock the future of SharePoint development with our cutting-edge SPFx template. Simply describe your desired webpart to this AI, and watch it come to life with intelligent code generation, ready for instant deployment.</p>
    </header>

    <section class="features-section">
      <div class="feature-card">
        <h3 class="card-title">Ready-to-Use SPFx Template</h3>
        <p class="card-description">Jumpstart your projects with a pre-configured SharePoint Framework template, designed for seamless integration and performance.</p>
      </div>
      <div class="feature-card">
        <h3 class="card-title">AI-Driven Webpart Generation</h3>
        <p class="card-description">Simply describe your desired webpart to this AI, and watch it come to life with intelligent code generation.</p>
      </div>
      <div class="feature-card">
        <h3 class="card-title">Prompt-Based Development</h3>
        <p class="card-description">No more manual coding. Generate complex SharePoint webparts effortlessly, just by providing clear, concise prompts.</p>
      </div>
      <div class="feature-card">
        <h3 class="card-title">Seamless .sppkg Deployment</h3>
        <p class="card-description">Once your webpart is perfected, easily generate the .sppkg file for quick and secure deployment to your SharePoint environment.</p>
      </div>
    </section>

    <section class="call-to-action-section">
      <h2 class="cta-heading">Ready to Transform Your SharePoint Experience?</h2>
      <p class="cta-description">Engage with me now by providing your prompts to begin crafting your next powerful SharePoint webpart. No manual coding required.</p>
    </section>
  </div>
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
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 2rem;
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.spfx-landing-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--color-shadow-medium);
  position: relative;
  overflow: hidden;
  animation: fadeIn 1s ease-out;
}

.hero-title {
  font-size: 3.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
}

.hero-description {
  font-size: 1.5rem;
  color: var(--color-text);
  max-width: 800px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.feature-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 20px var(--color-shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px var(--color-shadow-medium);
}

.card-title {
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.card-description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Call to Action Section */
.call-to-action-section {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 10px 30px var(--color-shadow-medium);
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  /* Subtle gradient for "cool" vibe */
  background: linear-gradient(45deg, var(--color-background) 0%, var(--color-surface) 100%);
}

.cta-heading {
  font-size: 3rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  font-weight: 700;
}

.cta-description {
  font-size: 1.4rem;
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-description {
    font-size: 1.2rem;
  }
  .cta-heading {
    font-size: 2.2rem;
  }
  .cta-description {
    font-size: 1.1rem;
  }
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
