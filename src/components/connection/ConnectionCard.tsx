import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/lib/types";

interface Props { profile: Profile; onConnect: (p: Profile) => void; }

export function ConnectionCard({ profile, onConnect }: Props) {
  return (
    <Card onClick={() => onConnect(profile)} onKeyDown={(e) => e.key === "Enter" && onConnect(profile)}
      role="button" tabIndex={0} className="cursor-pointer w-64 hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{profile.name[0].toUpperCase()}</div>
          <span className="text-sm font-semibold truncate">{profile.name}</span>
        </div>
        <div className="text-xs text-muted-foreground truncate">{profile.username}@{profile.host}:{profile.port}</div>
        <span className="inline-block mt-2.5 text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md font-medium">{profile.auth_type}</span>
        {profile.group && <span className="inline-block mt-2.5 ml-1.5 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-md font-medium">{profile.group}</span>}
      </CardContent>
    </Card>
  );
}
