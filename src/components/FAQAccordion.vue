<template>
  <div class="faq-container">
    <!-- Header Section -->
    <div class="faq-header">
      <h1 class="faq-title">Frequently Asked Questions</h1>
      <p class="faq-subtitle">Find answers to common questions organized by category</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <fluent-text-field
        v-model="searchQuery"
        placeholder="Search FAQs..."
        class="search-input"
        @input="handleSearch"
      >
        <fluent-button
          slot="end"
          appearance="stealth"
          @click="clearSearch"
          v-if="searchQuery"
        >
          ✕
        </fluent-button>
      </fluent-text-field>
    </div>

    <!-- Category Filter -->
    <div class="category-filter" v-if="!searchQuery">
      <fluent-button
        v-for="category in categories"
        :key="category"
        :appearance="selectedCategory === category ? 'accent' : 'neutral'"
        @click="selectCategory(category)"
        class="category-btn"
      >
        {{ category }}
      </fluent-button>
    </div>

    <!-- Search Results Count -->
    <div class="results-info" v-if="searchQuery">
      <p>{{ filteredFAQs.length }} result(s) found for "{{ searchQuery }}"</p>
    </div>

    <!-- FAQ Accordion -->
    <div class="faq-accordion">
      <div
        v-for="faq in filteredFAQs"
        :key="faq.id"
        class="faq-item"
      >
        <fluent-accordion>
          <fluent-accordion-item>
            <div slot="heading" class="faq-question">
              <span class="category-badge">{{ faq.category }}</span>
              <span class="question-text" v-html="highlightSearchTerm(faq.question)"></span>
            </div>
            <div class="faq-answer" v-html="highlightSearchTerm(faq.answer)"></div>
          </fluent-accordion-item>
        </fluent-accordion>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="filteredFAQs.length === 0" class="no-results">
      <fluent-card class="no-results-card">
        <h3>No FAQs found</h3>
        <p v-if="searchQuery">
          No results match your search term "{{ searchQuery }}". Try different keywords or browse by category.
        </p>
        <p v-else>
          No FAQs available in the "{{ selectedCategory }}" category.
        </p>
        <fluent-button @click="resetFilters" appearance="accent">
          Show All FAQs
        </fluent-button>
      </fluent-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export default defineComponent({
  name: 'FAQAccordion',
  setup() {
    const searchQuery = ref('');
    const selectedCategory = ref('All');

    // Sample FAQ data - replace with your actual data source
    const faqData = ref<FAQ[]>([
      {
        id: 1,
        question: 'How do I create a new SharePoint site?',
        answer: 'To create a new SharePoint site, navigate to the SharePoint start page, click "Create site", choose your template (Team site or Communication site), provide a name and description, set privacy settings, and click "Create". The site will be provisioned within a few minutes.',
        category: 'SharePoint Basics',
        tags: ['site creation', 'getting started', 'basics']
      },
      {
        id: 2,
        question: 'What are SharePoint web parts and how do I use them?',
        answer: 'SharePoint web parts are reusable components that display content on SharePoint pages. To add a web part, edit your page, click the "+" icon, select from available web parts like Document Library, News, or custom SPFx web parts, configure the settings, and publish your page.',
        category: 'Web Parts',
        tags: ['web parts', 'spfx', 'customization']
      },
      {
        id: 3,
        question: 'How do I manage permissions in SharePoint?',
        answer: 'SharePoint permissions can be managed at site, list, or item level. Go to Site Settings > Site Permissions to manage site-level access. For lists and libraries, use the "Manage Access" option. You can assign permission levels like Full Control, Edit, Contribute, or Read to users and groups.',
        category: 'Security & Permissions',
        tags: ['permissions', 'security', 'access control']
      },
      {
        id: 4,
        question: 'What is the difference between SharePoint Online and SharePoint Server?',
        answer: 'SharePoint Online is the cloud-based version included in Microsoft 365, offering automatic updates, scalability, and integration with other Microsoft 365 services. SharePoint Server is the on-premises version that you host and maintain yourself, providing more control but requiring infrastructure management.',
        category: 'SharePoint Basics',
        tags: ['online', 'server', 'deployment']
      },
      {
        id: 5,
        question: 'How do I create custom SPFx web parts?',
        answer: 'To create custom SPFx web parts: 1) Install Node.js and SPFx development tools, 2) Run "yo @microsoft/sharepoint" to scaffold a new project, 3) Develop your web part using TypeScript/React, 4) Test locally with "gulp serve", 5) Build and package with "gulp bundle --ship" and "gulp package-solution --ship", 6) Deploy the .sppkg file to your App Catalog.',
        category: 'Development',
        tags: ['spfx', 'development', 'custom web parts', 'typescript']
      },
      {
        id: 6,
        question: 'How do I troubleshoot SPFx web part deployment issues?',
        answer: 'Common SPFx deployment issues include: 1) Check App Catalog permissions, 2) Verify the .sppkg file is properly uploaded and deployed, 3) Ensure the web part is added to the site\'s app catalog, 4) Check browser console for JavaScript errors, 5) Verify API permissions if using Microsoft Graph, 6) Clear browser cache and try incognito mode.',
        category: 'Development',
        tags: ['troubleshooting', 'deployment', 'spfx', 'debugging']
      },
      {
        id: 7,
        question: 'What are the best practices for SharePoint governance?',
        answer: 'SharePoint governance best practices include: 1) Define clear site creation policies, 2) Establish naming conventions, 3) Implement information architecture standards, 4) Set up regular access reviews, 5) Create content lifecycle policies, 6) Train users on proper usage, 7) Monitor site usage and performance, 8) Establish backup and recovery procedures.',
        category: 'Governance',
        tags: ['governance', 'best practices', 'policies', 'management']
      },
      {
        id: 8,
        question: 'How do I integrate Power Platform with SharePoint?',
        answer: 'Power Platform integrates seamlessly with SharePoint: 1) Power Apps can create custom forms and apps using SharePoint lists as data sources, 2) Power Automate can create workflows triggered by SharePoint events, 3) Power BI can visualize SharePoint data in dashboards, 4) Use SharePoint connector in Power Platform to access lists, libraries, and sites programmatically.',
        category: 'Integration',
        tags: ['power platform', 'power apps', 'power automate', 'power bi', 'integration']
      }
    ]);

    // Get unique categories
    const categories = computed(() => {
      const cats = ['All', ...new Set(faqData.value.map(faq => faq.category))];
      return cats;
    });

    // Filter FAQs based on search and category
    const filteredFAQs = computed(() => {
      let filtered = faqData.value;

      // Filter by category
      if (selectedCategory.value !== 'All') {
        filtered = filtered.filter(faq => faq.category === selectedCategory.value);
      }

      // Filter by search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return filtered;
    });

    const selectCategory = (category: string) => {
      selectedCategory.value = category;
      searchQuery.value = ''; // Clear search when selecting category
    };

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        selectedCategory.value = 'All'; // Show all categories when searching
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const resetFilters = () => {
      searchQuery.value = '';
      selectedCategory.value = 'All';
    };

    const highlightSearchTerm = (text: string) => {
      if (!searchQuery.value.trim()) return text;
      
      const regex = new RegExp(`(${searchQuery.value})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    };

    onMounted(() => {
      // Register Fluent UI components
      import('@fluentui/web-components').then(module => {
        const {
          fluentAccordion,
          fluentAccordionItem,
          fluentButton,
          fluentTextField,
          fluentCard,
          provideFluentDesignSystem
        } = module;

        provideFluentDesignSystem()
          .register(
            fluentAccordion(),
            fluentAccordionItem(),
            fluentButton(),
            fluentTextField(),
            fluentCard()
          );
      });
    });

    return {
      searchQuery,
      selectedCategory,
      faqData,
      categories,
      filteredFAQs,
      selectCategory,
      handleSearch,
      clearSearch,
      resetFilters,
      highlightSearchTerm
    };
  }
});
</script>

<style scoped>
.faq-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.faq-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: block;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.category-btn {
  border-radius: 20px;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.results-info {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--color-shadow-light);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 16px var(--color-shadow-medium);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.category-badge {
  background: var(--color-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.question-text {
  flex: 1;
  line-height: 1.4;
}

.faq-answer {
  padding: 1rem 1.5rem 1.5rem;
  line-height: 1.6;
  color: var(--color-text);
  border-top: 1px solid var(--color-border);
}

.no-results {
  text-align: center;
  margin-top: 3rem;
}

.no-results-card {
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.no-results-card h3 {
  color: var(--color-text);
  margin-bottom: 1rem;
}

.no-results-card p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Search highlighting */
:deep(.search-highlight) {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.1rem 0.2rem;
  border-radius: 3px;
  font-weight: 600;
}

/* Fluent UI component customization */
:deep(fluent-accordion) {
  width: 100%;
}

:deep(fluent-accordion-item) {
  border: none;
  background: transparent;
}

:deep(fluent-text-field) {
  --neutral-fill-input-rest: var(--color-surface);
  --neutral-stroke-input-rest: var(--color-border);
  --neutral-stroke-input-hover: var(--color-primary);
  --neutral-stroke-input-focus: var(--color-primary);
}

:deep(fluent-button) {
  --accent-fill-rest: var(--color-primary);
  --accent-fill-hover: var(--color-secondary);
  --neutral-fill-rest: var(--color-surface);
  --neutral-fill-hover: var(--color-background);
  --neutral-stroke-rest: var(--color-border);
}

:deep(fluent-card) {
  --card-fill-color: var(--color-surface);
  --card-stroke-color: var(--color-border);
  border-radius: 12px;
}

/* Responsive design */
@media (max-width: 768px) {
  .faq-container {
    padding: 1rem;
  }
  
  .faq-title {
    font-size: 2rem;
  }
  
  .category-filter {
    justify-content: flex-start;
  }
  
  .faq-question {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .category-badge {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .faq-question {
    padding: 0.75rem;
  }
  
  .faq-answer {
    padding: 0.75rem 1rem 1rem;
  }
}
</style>