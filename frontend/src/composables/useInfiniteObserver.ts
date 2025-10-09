// src/composables/useInfiniteObserver.ts
import { ref, onMounted, onBeforeUnmount, watch, unref, type Ref, type ComputedRef } from "vue"

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

export interface UseInfiniteObserverOptions {
  /** Есть ли следующая страница */
  hasNextPage: MaybeRef<boolean>
  /** Идет ли сейчас дозагрузка (чтобы не дергать повторно) */
  isLoading: MaybeRef<boolean>
  /** Колбэк, который подгружает следующую страницу */
  onLoadMore: () => void | Promise<unknown>

  /** Опции IntersectionObserver */
  root?: MaybeRef<Element | null>
  rootMargin?: string
  threshold?: number | number[]

  /** Временное отключение */
  disabled?: MaybeRef<boolean>
}

export function useInfiniteObserver(options: UseInfiniteObserverOptions) {
  const {
    hasNextPage,
    isLoading,
    onLoadMore,
    root = null,
    rootMargin = "400px 0px",
    threshold = 0.01,
    disabled = false,
  } = options

  const loadMoreRef = ref<HTMLElement | null>(null)
  let io: IntersectionObserver | null = null

  const isSupported =
    typeof window !== "undefined" && "IntersectionObserver" in window

  function observeIfNeeded() {
    if (!isSupported || !io) return
    const node = loadMoreRef.value
    if (!node) return

    // всегда сперва снимаем наблюдение, чтобы не дублировать
    io.unobserve(node)

    if (unref(disabled)) return
    if (unref(hasNextPage)) {
      io.observe(node)
    }
  }

  onMounted(() => {
    if (!isSupported) return

    const rootEl = (root as Ref<Element | null> | null) && "value" in (root as any)
      ? (root as Ref<Element | null>).value
      : (root as Element | null)

    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (
          entry?.isIntersecting &&
          unref(hasNextPage) &&
          !unref(isLoading) &&
          !unref(disabled)
        ) {
          onLoadMore()
        }
      },
      { root: rootEl ?? null, rootMargin, threshold }
    )

    observeIfNeeded()
  })

  // если появился/изменился сентинел, есть/нет следующей страницы, закончилась загрузка, включили/выключили
  watch([loadMoreRef, () => unref(hasNextPage), () => unref(isLoading), () => unref(disabled)], () => {
    if (!io) return
    // пере-наблюдаем только когда не грузим
    if (!unref(isLoading)) observeIfNeeded()
  })

  // если меняется root как ref
  if (root && typeof root === "object" && "value" in root) {
    watch(root as Ref<Element | null>, () => {
      // пересоздание наблюдателя под новый root
      io?.disconnect()
      const rootEl = (root as Ref<Element | null>).value ?? null
      if (!isSupported) return
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (
            entry?.isIntersecting &&
            unref(hasNextPage) &&
            !unref(isLoading) &&
            !unref(disabled)
          ) {
            onLoadMore()
          }
        },
        { root: rootEl, rootMargin, threshold }
      )
      observeIfNeeded()
    })
  }

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })

  return {
    /** Привяжите это к ref на сентинел */
    loadMoreRef,
    /** Поддерживается ли IntersectionObserver (на случай фолбэков) */
    isIOSupported: isSupported,
  }
}
