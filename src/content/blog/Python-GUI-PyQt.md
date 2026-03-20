---
title: Python_GUI_PyQt
author: GGLG
categories: Python
date: 2025-07-05 23:19:30
description: 'python, GUI, frontend, PyQt'
pubDate: 2026-03-21
---

## <center>Python PyQt GUI基础内容

### 创建空窗口

```Python
import sys
from PyQt6.QtWidgets import (
    QApplication, Qwidget
)   #导入QApplication, Qwidget类

class EmptyWindow(QWidget):
    def __init__(self):
        super().__init__()  #继承Qwidget父类init属性
        self._initialize()

    def _initialize(self):
        #初始化窗口的位置和标题并显示
        self.setGeometry(位置x, 位置y, 大小x, 大小y)
        self.setWindowTitle("标题")

        self.show()

if __name__ == '__main__':
    #创建窗口实例
    app = QApplication(sys.argv)
    window = EmptyWindow()
    sys.exit(app.exec())
```
