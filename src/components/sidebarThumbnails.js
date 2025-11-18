import React, { useEffect, useRef } from 'react';

import './index.css'

const SidebarThumbnails = (props) => {
  const { imageItems: images, currentIndex, setImageIndex } = props;
  console.log(3, images, currentIndex);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const listEl = listRef.current;
    const itemEl = itemRefs.current[currentIndex];
    if (!listEl || !itemEl) return;

    const itemCenter = itemEl.offsetTop + itemEl.offsetHeight / 2;
    const targetScrollTop = itemCenter - listEl.clientHeight / 2;

    const maxScroll = listEl.scrollHeight - listEl.clientHeight;
    const nextScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));

    listEl.scrollTo({
      top: nextScrollTop,
      behavior: 'smooth',
    });
  }, [currentIndex, images.length]);

  return (
    <div className="thumbnail-sidebar" 
      ref={listRef} 
      onWheel={e => {
        e.stopPropagation();
    }}>
      {images.map((src, i) => (
        <div
          key={src + i}
          ref={el => itemRefs.current[i] = el}
          className={`ril-thumb ${i === currentIndex ? 'thumb-active' : ''}`}
          onClick={() => setImageIndex && setImageIndex(i)}
        >
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
};

export default SidebarThumbnails;