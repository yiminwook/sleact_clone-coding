import useUser from '@hooks/useUser';
import { IUserWithOnline } from '@typings/db';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CollapseButton } from '@components/ChannelsSection/DMList/styles';
import useSocket from '@hooks/useSocket';
import fetcher from '@hooks/fetcher';
import useSWR from 'swr';
import EachDm from '@components/EachDm';

const DMList = () => {
  const { workspace } = useParams();

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [socket] = useSocket(workspace);
  const { myData } = useUser();

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    myData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((pre) => !pre);
  }, []);

  useEffect(() => {
    setOnlineList(() => []);
  }, [workspace]);

  useEffect(() => {
    if (!socket) return;
    socket.on('onlineList', (data: number[]) => {
      setOnlineList(() => data);
    });
    return () => {
      socket.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      {!channelCollapse
        ? memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDm key={`eachDm-${member.id}`} member={member} isOnline={isOnline} />;
          })
        : null}
    </>
  );
};

export default DMList;
