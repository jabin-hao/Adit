/**
 * 连接表单 —— Ant Design Modal + Form
 *
 * 用于创建和编辑 SSH 连接配置。
 * 这是组件开发的示例：展示如何组织表单校验、状态联动、IPC 调用。
 */
import { Form, Input, InputNumber, Modal, Select, type FormInstance } from "antd";
import { useEffect, useRef } from "react";
import { validateHost, validateName, validatePort, validateUsername } from "../../lib/validators";
import { DEFAULT_SSH_PORT } from "../../lib/constants";
import type { Profile } from "../../lib/types";

interface ConnectionFormProps {
  open: boolean;
  /** null = 新建模式，非 null = 编辑模式 */
  editingProfile?: Profile | null;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

/** 表单字段 —— 与 Profile 字段对应（不含 id/时间戳等元数据） */
export interface FormValues {
  name: string;
  host: string;
  port: number;
  username: string;
  auth_type: "password" | "key" | "agent";
}

export function ConnectionForm({ open, editingProfile, onClose, onSave }: ConnectionFormProps) {
  const formRef = useRef<FormInstance<FormValues>>(null);

  const isEdit = editingProfile !== null && editingProfile !== undefined;

  // 编辑模式回填表单
  useEffect(() => {
    if (open) {
      if (editingProfile) {
        formRef.current?.setFieldsValue({
          name: editingProfile.name,
          host: editingProfile.host,
          port: editingProfile.port,
          username: editingProfile.username,
          auth_type: editingProfile.auth_type as FormValues["auth_type"],
        });
      } else {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue({ port: DEFAULT_SSH_PORT, auth_type: "password" });
      }
    }
  }, [open, editingProfile]);

  const handleOk = async () => {
    try {
      const values = await formRef.current?.validateFields();
      if (values) {
        onSave(values);
      }
    } catch {
      // 表单校验失败，Ant Design 会自动高亮错误字段
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑连接" : "新建连接"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnClose
      okText="保存"
      cancelText="取消"
    >
      <Form<FormValues>
        ref={formRef}
        layout="vertical"
        initialValues={{ port: DEFAULT_SSH_PORT, auth_type: "password" }}
      >
        <Form.Item name="name" label="连接名称" rules={[{ validator: validateName }]}>
          <Input placeholder="如：生产服务器" maxLength={64} />
        </Form.Item>

        <Form.Item name="host" label="主机地址" rules={[{ validator: validateHost }]}>
          <Input placeholder="192.168.1.1 或 example.com" />
        </Form.Item>

        <Form.Item name="port" label="端口" rules={[{ validator: validatePort }]}>
          <InputNumber min={1} max={65535} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="username" label="用户名" rules={[{ validator: validateUsername }]}>
          <Input placeholder="root" />
        </Form.Item>

        <Form.Item name="auth_type" label="认证方式">
          <Select
            options={[
              { value: "password", label: "密码" },
              { value: "key", label: "私钥" },
              { value: "agent", label: "SSH Agent" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
