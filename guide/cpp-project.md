# 创建 C++ 项目

## 从模板开始

模板位于工作区的 `cpp/_template/`。复制后把 `REPLACE_ME` 替换为合法的 CMake target 名称：

```powershell
Copy-Item -Recurse cpp/_template cpp/10_learning/002_my_topic
```

如果新项目需要自己的 `.vscode/launch.json` 和任务配置，把项目路径加入根目录的 `vault.code-workspace`；VS Code 只有在项目作为工作区文件夹打开时，才会加载该项目的独立配置。

项目 README 至少说明：目标、依赖、构建命令、运行命令和已知问题。

## 最小验证

```bash
cmake -S . -B build
cmake --build build
```

如果只是单文件实验，也可以使用工作区任务 `C++: build current file (GCC/Clang)`，不必先写 CMake。

构建系统不是工作区的硬性标准：小库可以没有构建文件，复杂项目可以使用 CMake、Ninja、Make，或像 Tsoding 的项目一样把一个小型构建程序放在项目内。选择能让项目在干净目录中清楚重建的方式即可。

## 变复杂之后

再按实际需要增加：

```text
src/       实现
include/   对外头文件
tests/     测试
thirdparty/固定版本的外部源码或说明
```

不要为了遵守模板而提前添加这些目录。
