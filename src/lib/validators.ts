/**
 * 表单校验函数
 *
 * 供 Ant Design Form 的 rules 属性使用，也用于提交前的前端预校验。
 */

/** IP 地址正则（IPv4） */
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

/** 主机名/域名正则 */
const HOSTNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;

/** 端口范围 */
const PORT_MIN = 1;
const PORT_MAX = 65535;

/** 校验主机地址（IP 或域名） */
export function validateHost(_rule: unknown, value: string): Promise<void> {
  if (!value || value.trim().length === 0) {
    return Promise.reject(new Error("主机地址不能为空"));
  }
  const host = value.trim();
  if (IPV4_REGEX.test(host)) {
    // 校验 IP 每段不超过 255
    const parts = host.split(".").map(Number);
    if (parts.every((p) => p >= 0 && p <= 255)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("IP 地址格式不正确"));
  }
  if (HOSTNAME_REGEX.test(host)) {
    return Promise.resolve();
  }
  // 也允许 localhost
  if (host === "localhost") {
    return Promise.resolve();
  }
  return Promise.reject(new Error("主机地址格式不正确"));
}

/** 校验端口号 */
export function validatePort(_rule: unknown, value: number): Promise<void> {
  if (value === undefined || value === null) {
    return Promise.reject(new Error("端口号不能为空"));
  }
  if (!Number.isInteger(value) || value < PORT_MIN || value > PORT_MAX) {
    return Promise.reject(new Error(`端口号范围为 ${PORT_MIN}-${PORT_MAX}`));
  }
  return Promise.resolve();
}

/** 校验连接名称 */
export function validateName(_rule: unknown, value: string): Promise<void> {
  if (!value || value.trim().length === 0) {
    return Promise.reject(new Error("连接名称不能为空"));
  }
  if (value.trim().length > 64) {
    return Promise.reject(new Error("连接名称不超过 64 个字符"));
  }
  return Promise.resolve();
}

/** 校验用户名 */
export function validateUsername(_rule: unknown, value: string): Promise<void> {
  if (!value || value.trim().length === 0) {
    return Promise.reject(new Error("用户名不能为空"));
  }
  return Promise.resolve();
}
