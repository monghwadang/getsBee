import React, { useState, useEffect, KeyboardEvent, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line camelcase
import { useRecoilValueLoadable, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { userState, userInfoByEmailPrefixSelector } from '../recoil/userState';
import SideBar from '../components/Common/SideBar';
import Menu from '../components/Common/Menu';
import Post from '../components/Contents/Post';
import PostDetail from '../components/Contents/PostDetail';
import DirectoryNav from '../components/Directory/DirectoryNav';
import { getPostsByDirectoryState } from '../recoil/PostState';
import { DirectoryInfo, getDirectoryInfo } from '../api/DirectoryApi';

const MyHiveDir: React.FC = () => {
  const { username, directoryId } = useParams<{ username: string; directoryId: string }>();
  const currentUser = useRecoilValue(userState);
  const isOwnHive = currentUser?.email.split('@')[0] === username;
  const userInfoLoadable = useRecoilValueLoadable(userInfoByEmailPrefixSelector(username || ''));
  const [memberId, setMemberId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followId, setFollowId] = useState<number | null>(null);
  const [postCount, setPostCount] = useState<number | null>(null);
  const [directoryInfo, setDirectoryInfo] = useState<DirectoryInfo | null>(null);

  useEffect(() => {
    if (userInfoLoadable.state === 'hasValue' && userInfoLoadable.contents) {
      setMemberId(userInfoLoadable.contents.memberId);
    }
  }, [userInfoLoadable.state, userInfoLoadable.contents]);

  const postLoadable = useRecoilValueLoadable(
    getPostsByDirectoryState({ directoryId: parseInt(directoryId || '0', 10), size: 10 }),
  );
  const refreshPosts = useRecoilRefresher_UNSTABLE(
    getPostsByDirectoryState({ directoryId: parseInt(directoryId || '0', 10), size: 10 }),
  );

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (postLoadable.state === 'hasValue') {
      console.log('Left side contents (posts):', postLoadable.contents.content);
    }
  }, [postLoadable.state, postLoadable.contents]);

  useEffect(() => {
    if (postLoadable.state === 'hasValue' && postLoadable.contents.content.length > 0) {
      setSelectedPostId(postLoadable.contents.content[0].post.postId);
    }
  }, [postLoadable.state, postLoadable.contents]);

  interface Directory {
    id: string;
    name: string;
    directoryId: string;
  }

  const [directories, setDirectories] = useState<Directory[]>([]);

  const updateDirectories = (info: DirectoryInfo) => {
    let newDirectories: Directory[];

    if (info.depth === 1) {
      newDirectories = [
        {
          id: '1',
          name: info.directoryName,
          directoryId: directoryId || '0',
        },
      ];
    } else if (info.depth === 2) {
      newDirectories = [
        {
          id: '1',
          name: info.parentDirectoryName || 'Parent Directory',
          directoryId: info.parentDirectoryId?.toString() || '0',
        },
        {
          id: '2',
          name: info.directoryName,
          directoryId: directoryId || '0',
        },
      ];
    } else {
      console.warn(`Unexpected depth: ${info.depth}`);
      newDirectories = [
        {
          id: '1',
          name: info.directoryName,
          directoryId: directoryId || '0',
        },
      ];
    }

    setDirectories(newDirectories);
  };

  useEffect(() => {
    const fetchDirectoryInfo = async () => {
      try {
        if (directoryId) {
          const data = await getDirectoryInfo(parseInt(directoryId, 10));
          setDirectoryInfo(data.data);
          updateDirectories(data.data);
          setIsFollowing(data.data.isFollow);
          setFollowId(data.data.followId);
          setPostCount(data.data.postCount);
        }
      } catch (error) {
        console.error('Failed to get directory info:', error);
      }
    };

    fetchDirectoryInfo();
  }, [directoryId]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>, postId: number) => {
    if (!isEditing && (event.key === 'Enter' || event.key === ' ')) {
      setSelectedPostId(postId);
    }
  };

  const handlePostDeleted = useCallback(() => {
    refreshPosts();
    setSelectedPostId(null);
  }, [refreshPosts]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleStopEditing = () => {
    setIsEditing(false);
  };

  const handleFollowChange = (newFollowState: boolean, newFollowId?: number) => {
    setIsFollowing(newFollowState);
    if (newFollowId !== undefined) {
      setFollowId(newFollowId);
    }
  };

  if (postLoadable.state === 'loading') {
    return <div>Loading...</div>;
  }

  if (postLoadable.state === 'hasError') {
    return <div>Error: {postLoadable.contents}</div>;
  }

  const posts = postLoadable.contents.content;

  return (
    <div className="flex h-screen">
      <div className="w-56">
        <SideBar memberId={memberId} isOwnHive={isOwnHive} />
      </div>
      <div className="flex flex-col w-5/6 ml-2">
        <div className="flex justify-between items-center border-b ml-6">
          <div className="mt-[75px] mb-[5px]">
            <DirectoryNav
              userName={username || ''}
              directories={directories}
              postCount={postCount}
              directoryId={parseInt(directoryId || '0', 10)}
              isFollowing={isFollowing}
              followId={followId}
              isOwnHive={isOwnHive}
              onFollowChange={handleFollowChange}
            />
          </div>
          <div className="mb-[33px] mr-3">
            <Menu />
          </div>
        </div>
        <div className="flex flex-grow overflow-hidden">
          <div className="flex flex-col items-center w-[465px] p-4 border-r overflow-y-auto scrollbar-hide">
            {posts.map((postData) => (
              <div
                key={postData.post.postId}
                className={`mt-4 cursor-pointer ${
                  selectedPostId === postData.post.postId
                    ? 'border-[3px] border-[#FFC60A] border rounded-[16px]'
                    : 'bg-white'
                } ${isEditing ? 'pointer-events-none opacity-50' : ''}`}
                style={{
                  boxShadow: selectedPostId === postData.post.postId ? '0 0 10px rgba(255, 198, 10, 0.5)' : 'none',
                  transition: 'border-color 0.3s, border-width 0.3s, box-shadow 0.3s',
                }}
                onClick={() => !isEditing && setSelectedPostId(postData.post.postId)}
                onKeyPress={(event) => handleKeyPress(event, postData.post.postId)}
                tabIndex={0}
                aria-label="button"
                role="button"
              >
                <Post
                  title={postData.post.title}
                  url={postData.post.url}
                  thumbnail={postData.post.thumbnail}
                  viewCount={postData.post.viewCount}
                  directoryName={postData.directory.directoryName}
                  createdAt={postData.post.createdAt}
                  highlightColors={postData.highlight.highlightColors}
                  highlightNumber={postData.highlight.highlightNumber}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-grow justify-center items-start overflow-y-auto scrollbar-hide transform scale-110 mt-8 mb-8">
            {selectedPostId && (
              <PostDetail
                postId={selectedPostId}
                onDelete={handlePostDeleted}
                onStartEditing={handleStartEditing}
                onStopEditing={handleStopEditing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyHiveDir;
