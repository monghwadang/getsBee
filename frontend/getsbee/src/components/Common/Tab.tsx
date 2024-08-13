import React, { useState, useEffect } from 'react';
import { TabMenu, TabMenuTabChangeEvent } from 'primereact/tabmenu';

const Tab: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const items = [
    { label: 'Weekly HOT', url: '/' },
    { label: 'Following', url: '/home' },
    {
      label: 'For you',
      url: '/recommend',
    },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/recommend') {
      setActiveIndex(2);
    } else if (path === '/home') {
      setActiveIndex(1);
    } else {
      setActiveIndex(0);
    }
  }, []);

  const onTabChange = (e: TabMenuTabChangeEvent) => {
    setActiveIndex(e.index);
  };

  return (
    <div className="card">
      <TabMenu model={items} activeIndex={activeIndex} onTabChange={onTabChange} className="bg-white" />
    </div>
  );
};

export default Tab;
