# 03 · struct 还是 class：用不变性决定类型边界

> 对应项目：cpp/10_learning/003_struct_vs_class
> 目标：不要把选择简化成“喜欢哪种关键字”，而要根据类型是否拥有规则来决定公开程度。

C++ 中 struct 和 class 的底层能力几乎相同。它们都可以有成员函数、构造函数、模板和运算符。语言层面最直接的区别只有默认访问权限：

- struct 默认 public；
- class 默认 private。

但团队代码中的关键差异不是语法，而是读者从关键字得到的设计信号：这是一个透明的数据集合，还是一个拥有状态规则的对象？

## struct：公开、透明、可直接初始化

项目中的 Player 是一个数据聚合：

~~~cpp
struct Player {
    std::string name;
    int hp;
    int attack;

    void showStatus() const {
        std::cout << "[" << name << "] HP: " << hp
                  << " ATK: " << attack << '\n';
    }
};
~~~

C++20 的指定初始化让数据意图很直白：

~~~cpp
Player player{
    .name = "勇者",
    .hp = 100,
    .attack = 15,
};
~~~

代价也同样直白：外部可以写入任意值。

~~~cpp
player.hp = -999;
player.attack = 9999;
~~~

当成员可以独立变化、没有必须同时维护的规则时，这种透明性是优点。坐标、颜色、解析后的配置和轻量消息通常适合 struct。

## class：把规则和状态放在同一个边界内

Monster 有血量、等级和最大血量计算规则。让外部直接写 hp 会破坏它的语义，因此使用 class：

~~~cpp
class Monster {
public:
    explicit Monster(const std::string& type, int level);

    void takeDamage(int damage);
    int getHp() const;
    void levelUp();

private:
    int calcMaxHpByLevel(int level) const;

    std::string type;
    int hp;
    int level;
};
~~~

调用方只能通过行为改变状态：

~~~cpp
Monster boss("远古巨龙", 5);
boss.takeDamage(300);
boss.levelUp();
~~~

takeDamage 可以拒绝非正伤害，并把血量限制在零；levelUp 可以在升级时重新计算满血值。规则离数据越近，越不容易在不同调用点产生互相矛盾的实现。

## 不要用“成员函数数量”决定关键字

struct 也可以有函数，class 也可以暴露公开数据。真正应该问的是：

> 如果外部随时修改每个字段，类型仍然保持正确吗？

如果答案是“可以”，公开数据能降低样板代码和访问成本；如果答案是“不可以”，就需要把修改动作收窄到能维护规则的接口。

这比“所有类型都用 class”更有信息量，也比“有函数就必须用 class”更准确。

## 从编译器视角验证差异

示例使用 std::is_aggregate_v 观察类型性质：

~~~cpp
std::cout << std::is_aggregate_v<Player> << '\n';
std::cout << std::is_aggregate_v<Monster> << '\n';
~~~

Player 是聚合类型，可以使用指定初始化；Monster 因为拥有私有成员和自定义构造函数，不再是聚合类型。这里的重点不是“聚合一定更快”这种未经测量的结论，而是编译器属性反映了设计边界：前者更像公开数据，后者更像自治对象。

## 一个更整洁的命名提醒

示例中的 getHp() 能工作，但在新代码中可以进一步采用表达意图的命名，例如 hp() 或 current_hp()。命名应该说明返回值的含义，而不是机械描述“调用 getter”。同理，levelUp() 是一个动作，setLevel() 则把调用者引向了可能破坏规则的任意写入。

整洁代码的目标不是让接口看起来“面向对象”，而是让错误的调用路径变得不自然：

~~~cpp
boss.levelUp();    // 表达一个完整、受规则保护的动作
// boss.setLevel(9); // 需要谨慎：它可能跳过升级规则
~~~

## 实验：验证选择带来的边界

~~~bash
cmake -S . -B build
cmake --build build
~~~

运行程序并做两个小实验：

1. 修改 Player 的 hp，观察编译器不会阻止它，因为这是公开数据；
2. 取消 boss.hp = 1; 的注释，观察编译在访问控制处失败。

这两个结果不是在比较“哪种关键字更高级”，而是在验证类型对状态拥有多大责任。

## 决策规则

| 问题 | 更适合的选择 |
| --- | --- |
| 类型只是几个公开字段的组合？ | struct |
| 字段必须一起满足不变性？ | class |
| 需要限制资源所有权、生命周期或并发状态？ | class |
| 只是为了方便提供一个只读展示函数？ | 仍可使用 struct |
| 需要隐藏布局、稳定 ABI 或减少编译依赖？ | class，必要时再考虑 Pimpl |

## 结论

struct 和 class 的选择是一个沟通工具：

- struct 告诉读者：“这些数据公开且可以独立变化”；
- class 告诉读者：“这个对象拥有规则，状态应该通过行为变化”。

先识别不变性，再决定访问边界。关键字只是把设计意图写给编译器和下一位读者看。

## 整洁代码检查表

- [ ] 外部直接修改字段后，类型是否仍然正确？
- [ ] 如果必须维护规则，规则是否与状态位于同一个类型边界？
- [ ] 接口名称是否表达动作和查询，而不是暴露存储细节？
- [ ] 是否因为“面向对象”而给简单数据增加了不必要的 getter 和 setter？
- [ ] 是否通过编译实验验证了聚合、访问权限和初始化方式，而不是凭印象判断？
