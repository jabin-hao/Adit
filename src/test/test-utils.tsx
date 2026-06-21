/**
 * 自定义 render —— 包裹 Ant Design ConfigProvider
 *
 * 用于组件测试，确保：
 * - Ant Design 组件在 ConfigProvider 下渲染
 * - 可注入初始 Zustand 状态
 */
import { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ConfigProvider } from "antd";

/** 包裹层：仅提供 ConfigProvider，可根据需要扩展 */
function AllTheProviders({ children }: { children: ReactNode }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

/**
 * 自定义 render 函数
 * 用法同 @testing-library/react 的 render，但自动包裹 Provider
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

// 重导出所有 testing-library 工具
export * from "@testing-library/react";
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
