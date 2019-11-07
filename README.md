## g6 (v2.x) vs cytoscape (v3.8)

尝试使用了 `GGEdtior`，发现当导入的 node 数量达到 100+，有肉眼可见的明显卡顿；当导入的 node 数量达到 1000，已无法响应绘制。

GGEdtior 是 `gg-editor-core` 的 react 包装版本，gg-editor-core 在 `g6(渲染绘图框架)` 基础上，实现了增删/拖拽/缩放/编辑等一些交互操作的图编辑器。（PS: 目前，gg-editor-core已废弃，它的一部分的功能已经移植到 g6 v3.x 版本，一部分未实现）

理想的状态，是有一个能编辑大规模数据量的图编辑器。

为什么选择 antv 系列？是因为它们的结构设计很好，很灵活也很方便扩展。

最初尝试直接使用过 g6，以上量绘图完全都hold住。基于 g6 自己写一个图编辑器，有一定工作量，何况已经有开源现成的了呢。但 gg-editor-core 对于以上使用的数据量是不够的。那么做成编辑器之后，性能到底差在哪儿？差距有多大？


### 排查思路

##### 数据清洗

将不必要、敏感数据清洗，只保留必需的、最干净的 graph 数据。

##### library 对比

g6 vs gg-editor-core vs 开源较高 star 的library

*这里选取的开源较高star的lib为：[cytoscape](https://github.com/cytoscape/cytoscape.js).    
*cytoscape 也是一个可视化分析的图库，除了基本的渲染绘图之外，还已经内置了一些拖拽/状态管理等交互功能。

**环境：**
MacBook Pro: mojave, 2.7 GHz Intel Core i5
Chrome: 76.0.3809.100

**版本：**
- g6：2.2.6
- gg-editor-core: 3.0.4
- cytoscape: 3.8.2

**对比内容：**
1. basic测试
2. layout测试
3. compound node(即 点包含点)测试

**结果衡量：**
`window.performance.now()`


### 测试数据准备

**数据量：**
- nodes count: 1339
- edges count: 8706

**数据格式：**
```
// node
{
  id: ‘xx’,
}
// edge
{
  source: ‘x’,
  target: ‘o'
}
```

**测试 code：**
```
var start = window.performance.now();
graph.read(data);
var end = window.performance.now();

console.log(end - start);
```

### 测试结果

#### basic

|  lib  |  g6  |  gg-editor-core  |  cytoscape  |
|  ----  |  ----  |  ----  |  ----  |
|  time  |718.9200000138953|7173.8900000054855|1316.0199999983888|
|  交互  |  -①  |  严重卡顿，无法拖动  |  顺畅  |

*① g6没有如拖拽等内置的交互行为.*

**可以看到，gg-editor-core 是有性能瓶颈的。**

#### layout
|  lib/layout  |  g6  |  gg-editor-core  |  cytoscape  |
|  ----  |  ----  |  ----  |  ----  |
|  grid  |1078.0749999976251|10523.629999981495|1576.805000018794|
|  circle  |1074.3200000142679|9260.340000008|1691.3449999992736|
|  dagre  |无响应|无响应|无响应|
|  交互  |  -  |  严重卡顿，无法拖动  |  卡顿明显，但能拖拽操作  |

**可以看到，使用 dagre 布局是有性能瓶颈的。**

#### compound
为了方便测试，这里把测试的数据量调整为：
nodes: 1339
edges: 1000
groups(compound node): 600

|  lib  |  g6  |  gg-editor-core  |  cytoscape  |
|  ----  |  ----  |  ----  |  ----  |
|  time  |1957.9650000086986|2834.4949999882374|772.9500000132248|
|  交互  |  -  |  严重卡顿，无法拖动  |  顺畅  |

**对比 basic&compound 测试，可看到 g6 在绘制组合点时的性能还是不尽如人意。**

##### TODO

待更新影响性能原因发现
