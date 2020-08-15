import React, { useEffect, useCallback, useRef } from 'react'

interface InfiniteScrollerProps {
  isLoading: Boolean
  loader: React.FC
  children: React.FC
  fetchData: Function
  hasMore: React.FC
}

export const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({
  isLoading,
  loader,
  fetchData,
  hasMore,
  children,
}) => {
  const loaderRef = useRef<any>(null)
  const fetchMore = useCallback(
    (entries) => {
      if (isLoading) return
      if (entries[0].isIntersecting) {
        fetchData()
      }
    },
    [isLoading, fetchData],
  )
  useEffect(() => {
    const observer = new IntersectionObserver(fetchMore, { threshold: 1 })
    let timer = setTimeout(() => {
      loaderRef.current && observer.observe(loaderRef.current)
    }, 500)
    return () => {
      clearTimeout(timer)
      loaderRef.current && observer.unobserve(loaderRef.current)
    }
  }, [loaderRef, fetchMore])
  return (
    <div>
      {children}
      {hasMore}
      <div ref={loaderRef}> {loader}</div>
    </div>
  )
}
