import React, { useState, useEffect, useRef, useMemo } from 'react';
import Tooltip from '../tooltip/tooltip';
import { clamp } from '../../utils/helpers';
import { Utils } from '../../utils/utils';

import './index.css';

const ITEM_HEIGHT = 104;  // 88px image height + 16px gap
const WINDOW = 12;  // Number of items to render in the viewport
const OVER_SCAN = 4;  // Number of items to render before and after the viewport

const SidebarThumbnails = (props) => {
  const { imageItems: images, currentIndex, setImageIndex } = props;
  const [scrollTop, setScrollTop] = useState(currentIndex * ITEM_HEIGHT);
  const [isDidMount, setDidMount] = useState(false);
  const listRef = useRef(null);

  // Total height of the list and 16 is gap of images; last item no need gap
  const totalHeight = useMemo(() => (
    images.length > 0 ? images.length * ITEM_HEIGHT - 16 : 0
  ), [images.length]);

  const start = useMemo(() => {
    // When the last image is selected, config the start
    if (currentIndex === images.length - 1) {
      return Math.max(0, images.length - (WINDOW + OVER_SCAN * 2));
    }

    const raw = Math.floor(scrollTop / ITEM_HEIGHT) - OVER_SCAN;
    return clamp(raw, 0, Math.max(0, images.length - 1));
  }, [scrollTop, images.length, currentIndex]);

  const end = useMemo(() => {
    // When the last image is selected, ensure it is visible
    if (currentIndex === images.length - 1) {
      return images.length;
    }
    return Math.min(images.length, start + WINDOW + OVER_SCAN * 2);
  }, [start, images.length, currentIndex]);

  const visibleImages = images.slice(start, end);

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const viewTop = el.scrollTop;
    const viewBottom = viewTop + el.clientHeight;

    const currentImageTop = currentIndex * ITEM_HEIGHT;
    const currentImageBottom = currentImageTop + ITEM_HEIGHT;

    const safeDistance = ITEM_HEIGHT * 2;
    const safeTop = viewTop + safeDistance;
    const safeBottom = viewBottom - safeDistance;

    const inSafeZone = currentImageTop >= safeTop && currentImageBottom <= safeBottom;
    if (inSafeZone) return;

    // Scroll to make the current image in the center of left thumbnail list
    const maxScroll = totalHeight - el.clientHeight;
    const target = currentImageTop - (el.clientHeight - ITEM_HEIGHT) / 2;

    el.scrollTo({
      top: clamp(target, 0, Math.max(0, maxScroll)),
      behavior: 'auto',
    });
    // Update scrollTop state when scrolling from last to first image
    requestAnimationFrame(() => {
      setScrollTop(el.scrollTop);
    });
  }, [currentIndex, totalHeight]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const maxScroll = Math.max(0, totalHeight - el.clientHeight);
        const nextTop = clamp(el.scrollTop, 0, maxScroll);
        setScrollTop(nextTop);
      });
    };
    el.addEventListener('scroll', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="thumbnail-sidebar"
      ref={listRef}
      onWheel={e => {
        e.stopPropagation();
    }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div className="thumbnail-sidebar-container" style={{ transform: `translateY(${start * ITEM_HEIGHT}px)` }}>
          {visibleImages.map((img, i) => {
            const realIndex = start + i;
            const thumbId = `ril-thumb-${realIndex}`;
            return (
              <div
                key={thumbId}
                id={thumbId}
                className={`ril-thumb ${realIndex === currentIndex ? 'thumb-active' : ''}`}
                onClick={() => setImageIndex && setImageIndex(realIndex)}
                role="button"
                aria-label={img.name ? `Thumbnail for ${img.name}` : `Thumbnail ${realIndex + 1}`}
                tabIndex="0"
                onKeyDown={Utils.onKeyDown}
              >
                <img src={img.thumbnail || img} alt="" />
                {isDidMount && (<Tooltip target={thumbId}>{img.name || img}</Tooltip>)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarThumbnails;
