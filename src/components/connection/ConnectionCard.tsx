/**
 * 连接卡片 —— 在 HomePage 中展示，用于首页快速连接
 */
import { Card, Tag, Typography } from "antd";
import type { Profile } from "../../lib/types";

interface ConnectionCardProps {
  profile: Profile;
  onConnect: (profile: Profile) => void;
}

export function ConnectionCard({ profile, onConnect }: ConnectionCardProps) {
  return (
    <Card
      hoverable
      size="small"
      className="w-64"
      onClick={() => onConnect(profile)}
    >
      <Typography.Text strong>{profile.name}</Typography.Text>
      <br />
      <Typography.Text type="secondary" className="text-xs">
        {profile.username}@{profile.host}:{profile.port}
      </Typography.Text>
      <br />
      <Tag color="blue" className="mt-1 text-xs">
        {profile.auth_type}
      </Tag>
    </Card>
  );
}
