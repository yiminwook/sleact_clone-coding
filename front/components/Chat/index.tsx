import { IDM } from '@typings/db';
import React, { useMemo, memo } from 'react';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface ChatProps {
  data: IDM;
}

const Chat = ({ data }: ChatProps) => {
  const user = data.Sender;
  const { workspace } = useParams<{ workspace: string }>();

  const convertContent = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[.+?\]\(\d+?\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/);
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }

          return <br key={index} />; //줄바꿈 처리
        },
      }),
    [data.content, workspace],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format(' (D일 A h:mm )')}</span>
        </div>
        <p>{convertContent}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
