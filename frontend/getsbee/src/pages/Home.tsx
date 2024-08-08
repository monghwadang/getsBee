import React, { useRef, useCallback, useState, useEffect } from 'react';
import Header from '../components/Common/Header';
import Tab from '../components/Common/Tab';
import Feed from '../components/Contents/Feed';
import FeedDetail from '../components/Contents/FeedDetail';
import honeyComb from '../assets/honeyComb.png';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useFeedDetail } from '../hooks/useFeedDetail';

const Home: React.FC = () => {
  const { feedPosts, feedLoading, hasMoreFeed, loadMoreFeedPosts } = useInfiniteScroll(10);

  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const { detailItems, detailLoading, detailInitialLoading, hasMoreDetails, loadMoreDetailItems, resetAndLoadDetails } =
    useFeedDetail(selectedUrl);

  const feedObserver = useRef<IntersectionObserver | null>(null);
  const detailObserver = useRef<IntersectionObserver | null>(null);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (feedLoading) return;
      if (feedObserver.current) feedObserver.current.disconnect();
      feedObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFeed) {
          loadMoreFeedPosts();
        }
      });
      if (node) feedObserver.current.observe(node);
    },
    [feedLoading, hasMoreFeed, loadMoreFeedPosts],
  );

  const lastDetailElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (detailLoading) return;
      if (detailObserver.current) detailObserver.current.disconnect();
      detailObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreDetails) {
          loadMoreDetailItems();
        }
      });
      if (node) detailObserver.current.observe(node);
    },
    [detailLoading, hasMoreDetails, loadMoreDetailItems],
  );

  const handleFeedClick = useCallback(
    (url: string) => {
      console.log('Feed clicked:', url);
      setSelectedUrl(url);
      resetAndLoadDetails(); // 새로운 feed 클릭 시 detail을 리셋하고 다시 로드
    },
    [resetAndLoadDetails],
  );

  useEffect(() => {
    if (feedPosts.length > 0 && !selectedUrl) {
      console.log('Initial URL set:', feedPosts[0].post.url);
      setSelectedUrl(feedPosts[0].post.url);
      resetAndLoadDetails(); // 초기 URL 설정 시에도 detail 로드
    }
  }, [feedPosts, selectedUrl, resetAndLoadDetails]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-center flex-grow overflow-hidden">
        <div className="w-[80%] flex flex-col">
          <Tab />
          <div className="flex flex-grow overflow-hidden">
            <div
              className="w-[600px] p-1 border-r overflow-y-auto scrollbar-hide"
              style={{ height: 'calc(100vh - 100px)' }}
            >
              {feedPosts.map((item, index) => (
                <Feed
                  key={item.post.postId}
                  {...item}
                  ref={index === feedPosts.length - 1 ? lastPostElementRef : undefined}
                  className={index > 0 ? 'mt-4' : ''}
                  onClick={() => handleFeedClick(item.post.url)}
                  isSelected={item.post.url === selectedUrl}
                />
              ))}
              {feedLoading && <div className="text-center py-4">Loading...</div>}
              {!feedLoading && feedPosts.length === 0 && <div className="text-center py-4">포스트가 없습니다.</div>}
            </div>
            <div
              className="flex flex-col flex-grow p-4 items-start overflow-y-auto scrollbar-hide"
              style={{ height: 'calc(100vh - 100px)' }}
            >
              <div className="flex items-center">
                <img src={honeyComb} alt="honeyComb" className="w-9" />
                <p className="ml-1 text-[#CC9C00] font-semibold text-[22px]">Others&apos; Highlights</p>
              </div>
              {detailInitialLoading && <div className="text-center py-4">초기 데이터를 불러오는 중...</div>}
              {detailItems.map((detail, index) => (
                <div
                  key={detail.postId}
                  ref={index === detailItems.length - 1 ? lastDetailElementRef : undefined}
                  className="border-b transform scale-[95%]"
                >
                  <FeedDetail detail={detail} />
                </div>
              ))}
              {detailLoading && !detailInitialLoading && <div className="text-center py-4">Loading details...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
