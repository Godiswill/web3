# 开始

全文操作在 Mac 上

## Rust 开发环境

### 安装
```zsh
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

```

需要选择安装方式，默认安装，直接 Enter 键即可，
出现 `Rust is installed now. Great!` 表示成功


- 安装 C 编译器（一般 Mac 装了，如果报链接器错误，需要安装，C 编译器包含链接器，Rust 包也依赖 C 代码，同样需要编译器）
```zsh
xcode-select --install
```

- 验证是否安装成功 Rust

```zsh
rustc --version
```

如果有问题重启下命令后窗口试试

### 更新
```zsh
rustup update
```

### 卸载
```zsh
rustup self uninstall
```

## Hello World

```rust
/**
Rust 编码风格：
1. 文件名用下划线 _ 分割单词
2. 左花括号与函数声明置于同一行并以空格分隔
3. 缩进风格使用 4 个空格，而不是 1 个制表符（tab）
4. 表达式以 ; 结尾
5. 编译与运行彼此独立，编译后产生可执行文件
    编译：$ rustc ./01_02_hello_world.rs
    运行：$ ./01_02_hello_world
*/
fn main() {
    // ! 表示调用的是宏，不是函数
    println!("Hello, world!");
}
```

## Cargo

Cargo 是 Rust 的构建系统和包管理器，用来管理 Rust 项目，例如管理依赖库，构建、编译、检查和运行项目等。前端的角度，类似 npm 或 yarn。

上面安装 rust 的同时也安装了 Cargo，类似安装了 node 会连带安装 npm。

- 检查是否安装
```zsh
cargo --version
```

### 创建项目
```zsh
cargo new hello_cargo
cd hello_cargo
```

```
hello_cargo
├── .git
│   └── ...
├── .gitignore
├── Cargo.toml
└── src
    └── main.rs
```

- Cargo 默认会初始化 git，并忽略 /target 目录。如果已存在 git 仓库，则不会生成.
- Cargo.[toml](https://toml.io/en/)，Cargo 配置文件，类型前端项目的 package.json，一般不太需要手动管理。
```toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2021"

[dependencies]
```
- src 目录存放项目代码，默认生成 main.rs 主文件
```rust
fn main() {
    println!("Hello, world!");
}
```

你也可以在已有目录转化成 Cargo 项目，并将代码移入 src 目录中，和 npm 类似。
```zsh
cargo init
```

更多查看 cargo 帮助
```zsh
cargo new --help
```

### 构建运行

```zsh
cargo build

./target/debug/hello_cargo
```
1. 会在 target/debug 目录生成可执行文件
1. 会生成 Cargo.lock，类似 package-lock.json 或 yarn.lock

```zsh
cargo run # 类似 npm run dev
```
- 等同于上面两个操作，编译并运行
- 如果源码未改变，会省略编译，运行上次生成的编译文件，节省时间

```zsh
cargo check
```
- cargo check 通常比 cargo build 快得多，也许你并不急于查看最终的运行结果，而是频繁想看下，新增修改的代码是否会通过编译，可以只用 cargo check

### 发布 release
```zsh
cargo build --release # 类似 npm run build
```
在 target/release 目录下生成最终发布版本，
因为会开启优化等，所以消耗更长编译时间。

- cargo new 创建项目。
- cargo build 构建项目。
- cargo run 构建并运行项目。
- cargo check 在不生成二进制文件的情况下构建项目来检查错误。
- cargo build --release 编译最终发布版本