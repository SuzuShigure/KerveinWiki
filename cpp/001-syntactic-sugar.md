# 01 · 语法糖与语法盐：让代码好读，也让错误难写

> 对应项目：cpp/10_learning/004_syntactic_sugar
> 目标：理解哪些语言特性是在替我们表达意图，哪些语言特性是在阻止我们偷偷犯错。

有些 C++ 语法像糖：嚼起来轻松，代码也短了一截。还有些语法像盐：入口不甜，甚至有点硌牙，但它能让一顿饭不至于坏掉。

这篇文章不把“写得少”当成唯一目标。整洁代码更关心另一件事：读者能不能一眼看出代码打算做什么，以及编译器能不能尽早拦住那些口是心非的写法。

## 先看一段没有加糖的代码

项目先用老式迭代器遍历武器：

~~~cpp
for (std::vector<Weapon>::const_iterator it = inventory.begin();
     it != inventory.end();
     ++it) {
    std::cout << "武器: " << (*it).name << "\n";
}
~~~

这段代码没有错。它把迭代器的全部细节都摊在桌面上：类型、起点、终点、递增、解引用。读者要先过滤这些机械动作，才能看见真正的业务句子：“把库存里的每件武器拿出来”。

范围 for 把这句话还给读者：

~~~cpp
for (const auto& weapon : inventory) {
    weapon.attack();
}
~~~

这里的糖不是为了炫技。它隐藏了不会改变业务含义的噪声，让循环的形状更接近人的描述。

## 糖的三条使用规则

### 第一条：糖应该降低噪声，不应该隐藏代价

auto 能隐藏冗长类型，但不应该隐藏重要的所有权和拷贝行为。下面两个写法看起来都短，含义却不同：

~~~cpp
for (const auto& weapon : inventory) {
    weapon.attack();
}

for (auto weapon : inventory) {
    weapon.attack();
}
~~~

第一段借用元素，第二段为每个元素创建副本。语法糖没有替我们决定性能；它只是给了我们更舒服的勺子。什么时候用引用，仍然需要根据对象大小、拷贝成本和业务意图来决定。

### 第二条：糖要让名字更有意义

项目里的 Weapon 有一个 attack 成员函数。调用 weapon.attack() 比在循环里拼接字符串和 damage 字段更像一句完整的业务话：

~~~cpp
struct Weapon {
    std::string name;
    int damage;

    void attack() const {
        std::cout << "挥舞 [" << name << "] 造成 " << damage << " 点伤害！\n";
    }
};
~~~

函数不是越短越好，而是要让调用点读起来像一段小故事。循环负责“遍历”，Weapon 负责“攻击”，每一块只承担一个读者可以记住的职责。

### 第三条：糖不能把复杂性藏到地毯下面

auto、范围 for、结构化绑定都能缩短代码，但如果变量名失去含义，短代码反而变成猜谜游戏：

~~~cpp
for (const auto& w : inventory) {
    w.attack();
}
~~~

w 在三行的小例子里还算安全，在几十行的函数里就可能变成“武器？钱包？工作项？”。整洁代码的原则很朴素：让变量名帮助读者，而不是让读者替变量名打工。项目示例为保持简短使用 w，真正的业务代码可以写成 weapon。

## 再看语法盐：explicit 和 enum class

糖负责减少无意义的重复，盐负责增加有意义的摩擦。

### enum class：给枚举加一道围栏

老式枚举会把名字泄漏到外层，还允许它悄悄参与整数运算：

~~~cpp
enum OldState { ALIVE, DEAD };

OldState state = ALIVE;
int accidental_score = state + 100;
~~~

这段代码能编译，却没有表达一个合理的业务意图。状态不是分数，能相加不代表应该相加。

enum class 要求调用者写清楚作用域，也拒绝隐式转换：

~~~cpp
enum class GameState { ALIVE, DEAD };

GameState state = GameState::ALIVE;
// int score = state + 100; // 编译失败：必须明确转换并解释原因
~~~

编译器这次像一位有点固执的门卫：“你要把状态当整数？请出示书面说明。”这点麻烦换来了更小的误用空间。

### explicit：禁止编译器自作聪明

项目中的 Player 使用显式构造函数：

~~~cpp
class Player {
public:
    explicit Player(int player_id) : name("未知玩家"), id(player_id) {}

    void print() const {
        std::cout << "玩家 ID: " << id << "\n";
    }

private:
    std::string name;
    int id;
};
~~~

如果没有 explicit，下面的调用可能偷偷创建一个临时 Player：

~~~cpp
void check_player(const Player& player);

// check_player(999); // 没有 explicit 时可能被隐式转换接受
check_player(Player(999)); // 显式表达：这里确实要构造一个 Player
~~~

显式构造不是让代码更“高级”，而是把一个可能影响逻辑的转换从幕后搬到台前。读者看到 Player(999)，就知道发生了对象构造；编译器也不会替他脑补。

## 糖和盐如何一起工作

一段可读又安全的代码通常同时拥有两种味道：

~~~cpp
for (const auto& weapon : inventory) {
    weapon.attack();
}

check_player(Player(999));
~~~

第一段用糖表达正常路径，第二段用盐保护边界。前者让正确的事情容易读，后者让可疑的事情必须解释。

这比“所有地方都写最短代码”更成熟，也比“所有地方都加最严格的模板”更克制。好的规则会把摩擦放在错误最可能发生的地方。

## 实验：把注释一行行打开

在项目根目录运行：

~~~bash
cmake -S . -B build
cmake --build build
~~~

然后做两个小实验：

1. 把范围 for 改回迭代器版本，比较两段代码表达业务的距离；
2. 取消 enum class 的整数相加或 check_player(999) 的注释，观察编译器如何拒绝隐式意图。

实验的重点不是记住语法名称，而是感受两种反馈：糖减少阅读噪声，盐增加错误摩擦。

## 结论：用糖表达业务，用盐保护边界

可以把这个项目的经验压缩成一句团队约定：

> 用糖让正确的代码更像人的语言，用盐让危险的转换必须经过人的同意。

auto、范围 for 和成员函数适合让主流程更顺；enum class、explicit 和显式转换适合守住类型边界。两者都服务于同一个目标：降低读者需要猜测的内容。

## 整洁代码检查表

- [ ] 语法糖是否减少了机械噪声，而不是隐藏拷贝、所有权或异常行为？
- [ ] auto 后面的变量名是否仍然能表达真实角色？
- [ ] 枚举是否需要作用域和强类型保护？
- [ ] 单参数构造函数是否应该禁止隐式转换？
- [ ] 代码是否让正常路径顺滑，让危险路径显式？
- [ ] 删除注释后，命名和接口是否仍然能说明意图？
