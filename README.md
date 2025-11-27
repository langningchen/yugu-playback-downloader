# Yugu Playback Downloader

这是一个用于下载浴谷课程回放视频的工具。

> [!WARNING]
>
> 此工具仅供学习和个人使用，请勿用于非法用途。
> 此工具仅适用于浴谷网站的课程视频下载，不要使用此工具传播下载任何洛谷网站的课程视频。
>
> 根据《洛谷网校用户协议》：
>
> > 2.7 用户不得进行以下任一行为：
> >
> > 2.7.3 通过技术途径或其他任何形式，对洛谷网校网站上的课程资源进行未得到洛谷网校授权的包括但不限于转存、录制、盗摄、下载、转载、汇编、发表、出版、建立镜像站点的行为；

## 前置要求

- [Node.js](https://nodejs.org/) (建议使用最新 LTS 版本)
- [pnpm](https://pnpm.io/) (本项目使用 pnpm 作为包管理器)

## 快速开始

无需安装，直接使用 `npx` 运行：

```bash
npx yugu-playback-downloader
```

## 本地运行

1. 克隆仓库到本地：

   ```bash
   git clone https://github.com/langningchen/yugu-playback-downloader.git
   cd yugu-playback-downloader
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 编译 TypeScript 代码：

   ```bash
   pnpm build
   ```

4. 运行程序：

   ```bash
   pnpm start
   ```

5. 按照终端提示操作，输入浴谷账号信息，选择课程和章节，即可开始下载。

## 许可证

本项目基于 [GNU Affero General Public License v3.0](https://github.com/langningchen/cph-ng/blob/main/LICENSE) 的条款进行许可。
