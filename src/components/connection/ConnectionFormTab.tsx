import { FormBody, type FormValues } from "@/components/connection/ConnectionForm";
import type { Profile } from "@/lib/types";

interface Props {
  editingProfile?: Profile | null;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

export function ConnectionFormTab({ editingProfile, onClose, onSave }: Props) {
  const isEdit = editingProfile !== null && editingProfile !== undefined;
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-sm font-semibold">{isEdit ? "编辑连接" : "新建连接"}</h2>
      </div>
      <FormBody
        key={editingProfile?.id ?? "new"}
        editingProfile={editingProfile}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
