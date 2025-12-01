<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value)
  },
  width: {
    type: String,
    default: '320px'
  },
  height: {
    type: String,
    default: '400px'
  },
  overlay: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const drawerClasses = computed(() => [
  'drawer',
  `drawer--${props.position}`,
  { 'drawer--open': isOpen.value }
])

const drawerStyles = computed(() => {
  const styles = {}

  if (props.position === 'left' || props.position === 'right') {
    styles.width = props.width
    styles.height = '100%'
  } else {
    styles.height = props.height
    styles.width = '100%'
  }

  return styles
})

const closeDrawer = () => {
  isOpen.value = false
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeDrawer()
  }
}

// Prevent body scroll when drawer is open
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-overlay">
      <div
        v-if="overlay && isOpen"
        class="drawer-overlay"
        @click="handleOverlayClick"
      />
    </Transition>

    <Transition :name="`drawer-${position}`">
      <div
        v-if="isOpen"
        :class="drawerClasses"
        :style="drawerStyles"
      >
        <div class="drawer__header">
          <div class="drawer__header-content" v-if="title || $slots.header">
            <slot name="header">
              <h3 class="drawer__title">{{ title }}</h3>
            </slot>
          </div>
          <button
            class="drawer__close"
            @click="closeDrawer"
            aria-label="Close drawer"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div class="drawer__content">
          <slot />
        </div>

        <div class="drawer__footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

/* Drawer Base Styles */
.drawer {
  position: fixed;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

/* Position Variants */
.drawer--left {
  top: 0;
  left: 0;
  bottom: 0;
}

.drawer--right {
  top: 0;
  right: 0;
  bottom: 0;
}

.drawer--top {
  top: 0;
  left: 0;
  right: 0;
}

.drawer--bottom {
  bottom: 0;
  left: 0;
  right: 0;
}

/* Header */
.drawer__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 1rem;
  min-height: 50px;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.drawer__header-content {
  flex: 1;
}

.drawer__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.drawer__close {
  background: var(--gcc-dk-green);
  border: none;
  padding: 0.5rem 0.65rem;
  cursor: pointer;
  color: white;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  margin-left: auto;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
}

.drawer__close:hover {
  background-color: var(--gcc-orange);
  color: white;
  transform: scale(1.05);
}

/* Content */
.drawer__content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* Footer */
.drawer__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Overlay Transitions */
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

/* Left Drawer Transitions */
.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: transform 0.3s ease;
}

.drawer-left-enter-from,
.drawer-left-leave-to {
  transform: translateX(-100%);
}

/* Right Drawer Transitions */
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform 0.3s ease;
}

.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
}

/* Top Drawer Transitions */
.drawer-top-enter-active,
.drawer-top-leave-active {
  transition: transform 0.3s ease;
}

.drawer-top-enter-from,
.drawer-top-leave-to {
  transform: translateY(-100%);
}

/* Bottom Drawer Transitions */
.drawer-bottom-enter-active,
.drawer-bottom-leave-active {
  transition: transform 0.3s ease;
}

.drawer-bottom-enter-from,
.drawer-bottom-leave-to {
  transform: translateY(100%);
}

/* Responsive adjustments */
@media (min-width: 1920px) {
  /* On ultra-wide screens, cap drawer at reasonable max width */
  .drawer--left,
  .drawer--right {
    max-width: 600px;
  }
}

@media (max-width: 1024px) {
  /* On tablets, make drawer a bit wider */
  .drawer--left,
  .drawer--right {
    width: 40vw !important;
  }
}

@media (max-width: 640px) {
  /* On mobile, drawer takes full width */
  .drawer--left,
  .drawer--right {
    width: 100% !important;
  }

  .drawer__content {
    padding: 0.75rem;
  }

  .drawer__header {
    padding: 0.75rem;
  }

  .drawer__footer {
    padding: 0.75rem;
  }
  
  .drawer__close {
    font-size: 0.9rem;
    min-width: 1.75rem;
    min-height: 1.75rem;
    padding: 0.4rem 0.5rem;
  }
}
</style>
