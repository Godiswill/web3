# Solana

## 安装本地开发环境

- 安装 Solana 本地验证器
```zsh 
sudo sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```
Mac 对目录访问限制比较严格，需要 sudo 输入密码

- 配置环境路径
```zsh
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc

. ~/.zshrc

# 测试安装是否成功
solana --version
```

- 安装 avm （类似管理 node 版本的 nvm)
```zsh
cargo install --git https://github.com/coral-xyz/anchor avm --force

# 测试安装是否成功
avm --version
```
- 安装 anchor
```zsh
avm install latest

# Error: Installation of `rustc 1.79.0` failed. `rustc <1.80` is required to install Anchor v0.30.1 from source
# 默认 rust 版本 1.8+，过高会报错，安装 1.79.0 版本
sudo rustup install 1.79.0

# 查看 rust 编译器版本
rustup toolchain list
# stable-aarch64-apple-darwin (default)
# 1.79.0-aarch64-apple-darwin

# 默认版本改为 1.79.0
rustup default 1.79.0-aarch64-apple-darwin

# 再次安装 anchor
avm install latest

# 查看安装是否成功
anchor --version
# anchor-cli 0.30.1
```

- vscode 安装 rust-analyzer（代码智能提示，跳转方法实现等）
```zsh
# 提示警告未安装 rust-src 解决办法
sudo rustup component add rust-src
```