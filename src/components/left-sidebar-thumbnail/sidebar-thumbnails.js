import React, { useState, useEffect, useRef } from 'react';
import Tooltip from '../tooltip/tooltip';

import './index.css'

const SidebarThumbnails = (props) => {
  const { imageItems: images, currentIndex, setImageIndex } = props;
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [isDidMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

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
      {images.map((img, i) => {
        const thumbId = img.id ?  `ril-thumb-${img.id}`: `ril-thumb-${i}`;
        return (
          <div
            key={thumbId}
            id={thumbId}
            ref={el => itemRefs.current[i] = el}
            className={`ril-thumb ${i === currentIndex ? 'thumb-active' : ''}`}
            onClick={() => setImageIndex && setImageIndex(i)}
          >
            <img src={img.thumbnail || img} alt="" />
            {isDidMount && (<Tooltip target={thumbId}>{img.name || img}</Tooltip>)}
          </div>
        )
      })}
      
    </div>
  );
};

export default SidebarThumbnails;
