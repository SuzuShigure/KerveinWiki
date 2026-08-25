# 02 · 封装不是 private：让对象守住自己的不变性

> 对应项目：cpp/10_learning/002_class_encapsulation
> 目标：从访问控制、行为边界和实现隐藏三个层次理解封装。

很多教程把封装解释成“把成员变量写在 private 下面”。这只是语法入口，不是设计结论。真正值得维护的是不变性（invariant）：对象一旦被构造，就应该持续满足某些规则；外部代码只能通过有意义的行为改变它。

想象一个没有门的银行金库。墙上贴着“请不要拿钱”，但每个人都能伸手进去。把数据成员放公开区，大概就是这个效果。private 是门，但真正重要的是门后面那套规则。

## 先看没有封装的数据包

~~~cpp
struct PublicSnapshot {
    std::string label;
    std::int64_t value{};
};

PublicSnapshot snapshot{.label = "演示数据", .value = 100};
snapshot.value = -999; // 合法：调用方可以直接破坏数据
~~~

这不是错误的 C++。如果类型只是一个公开的数据传输包，调用方确实需要自由读写，struct 是清楚而诚实的选择。问题出现在 value 有业务规则，却仍然把它当作裸数据暴露出去。

## 把规则放回对象

BankAccount 让账户自己维护余额规则：

- 所有者不能为空；
- 初始余额不能为负；
- 存取金额必须为正；
- 余额不能溢出；
- 失败的操作不改变状态。

头文件只暴露行为：

~~~cpp
class BankAccount {
public:
    explicit BankAccount(std::string owner, std::int64_t initial_balance = 0);

    bool deposit(std::int64_t cents) noexcept;
    bool withdraw(std::int64_t cents) noexcept;

    [[nodiscard]] std::int64_t balance_cents() const noexcept;
    [[nodiscard]] std::string_view owner() const noexcept;

private:
    std::string owner_;
    std::int64_t balance_cents_;
};
~~~

调用方不能这样绕过规则：

~~~cpp
// account.balance_cents_ = -1; // 编译失败：状态边界在编译期存在
~~~

它必须表达自己的意图：

~~~cpp
if (!account.withdraw(2'000)) {
    // 余额不足，BankAccount 保证状态不变
}
~~~

withdraw 比 set_balance 更整洁，因为它说的是业务动作，而不是暴露存储方式。调用方不需要知道余额存储在什么字段里，也不需要重复实现“不能透支”的判断。

## 构造函数建立第一条不变性

对象不能先处于无效状态，再等待某个 init 函数修复。项目在构造函数中拒绝无效输入：

~~~cpp
BankAccount::BankAccount(std::string owner, std::int64_t initial_balance)
    : owner_(std::move(owner)), balance_cents_(initial_balance) {
    if (owner_.empty()) {
        throw std::invalid_argument("账户所有者不能为空");
    }
    if (initial_balance < 0) {
        throw std::invalid_argument("初始余额不能为负数");
    }
}
~~~

这让后续成员函数可以建立在一个明确前提上：owner_ 非空，balance_cents_ 非负。验证放在边界处，内部逻辑就不需要到处猜测。

## 失败时状态不变

一个容易被忽视的契约是：被拒绝的操作不能留下半完成状态。

~~~cpp
bool BankAccount::deposit(std::int64_t cents) noexcept {
    if (cents <= 0 ||
        cents > std::numeric_limits<std::int64_t>::max() - balance_cents_) {
        return false;
    }

    balance_cents_ += cents;
    return true;
}
~~~

先检查，再修改；检查失败直接返回。这样的代码路径短、条件集中，也更容易写测试：每个拒绝条件都能验证“返回 false 且余额没有改变”。

## Pimpl：把实现细节移出头文件

Player 更进一步：头文件甚至不公开姓名、血量和算法的具体布局。

~~~cpp
class Player {
public:
    explicit Player(std::string name);
    ~Player();

    Player(Player&&) noexcept;
    Player& operator=(Player&&) noexcept;
    Player(const Player&) = delete;
    Player& operator=(const Player&) = delete;

    bool take_damage(int damage) noexcept;
    [[nodiscard]] int hp() const noexcept;
    [[nodiscard]] bool alive() const noexcept;

private:
    struct Impl;
    std::unique_ptr<Impl> impl_;
};
~~~

Impl 在 cpp 文件中定义，里面的 max_hp、当前血量和算法都不会污染使用方的头文件。这样做适合需要稳定 ABI、减少头文件依赖或隐藏第三方实现的场景，但不应把 Pimpl 当成默认模板：它会引入一次间接访问和动态分配，只有边界收益足够大时才值得使用。

## 实验：观察三层封装

~~~bash
cmake -S . -B build
cmake --build build
~~~

运行 class_encapsulation 后，重点观察：

1. PublicSnapshot 可以被外部改成负数；
2. BankAccount 拒绝透支和负金额，失败后余额不变；
3. Player 接受有效伤害，把血量限制在 [0, max_hp]；
4. 取消 private 成员的注释会触发编译错误，而不是运行时报警。

## 结论

封装可以分成三个递进层次：

1. **访问控制**：private 让非法写入在编译期失败；
2. **行为边界**：只暴露 deposit、withdraw、take_damage 等有意义的动作，并在动作内部维护不变性；
3. **实现隐藏**：Pimpl 把布局和算法留在 cpp，接口稳定时降低编译依赖。

所以，封装不是“变量藏起来”这么简单，而是让类型对自己的状态负责。

## 整洁代码检查表

- [ ] 构造完成后，对象是否立即满足自己的不变性？
- [ ] 对外接口描述的是业务行为，还是暴露了字段读写？
- [ ] 失败路径是否保证状态不变？
- [ ] private 成员是否真的有规则需要守护，而不是为了形式？
- [ ] Pimpl 带来的编译和 ABI 收益，是否足以抵消间接访问和复杂度？
