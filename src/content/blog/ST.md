---
title: PLC_ST语言
categories: PLC
author: GGLG
description: "PLC, 可编程逻辑控制器, ST"
pubDate: 2026-03-21
---

## <center>PLC—ST语言基础

### 语言标准 IEC 61131

1. IEC 61131-1: 通用信息
2. IEC 61131-2: 装置要求与测试
3. IEC 61131-3: 编程语言
4. IEC 61131-4: 用户导则
5. IEC 61131-5: 通信服务规范
6. IEC 61131-6: 功能安全
7. IEC 61131-7: 模糊控制编程软件工具实施
8. IEC 61131-8: IEC 61131-3 语言的应用和现实导则
9. IEC 61131-9: 小型传感器和执行器的单点数字通信接口技术
10. IEC 61131-10: 可编程逻辑控制器开放XML交换格式

### 变量

#### 变量命名规则

1. 以字母/下划线开头，以字母/数字结尾
2. 不区分字母大小写
3. 不存在两个/两个以上连续下划线
4. 不含空格
5. 不使用ST语言关键字
6. 一般不超过32字符
7. 尽量不使用与物理地址相似的变量名

#### 变量属性

<center>|PLC常见属性|

|     变量属性     |         属性说明          | 变量属性 | 属性说明 |
| :--------------: | :-----------------------: | :------: | :------: |
|       VAR        |         局部变量          | VAR_OUT  | 输出变量 |
|    VAR_GLOBAL    |         全局变量          |  VAR_IN  | 输入变量 |
|    VAR_RETAIN    |        保持型变量         | VAR_TEMP | 临时变量 |
|   VAR_CONSTANT   |           常量            | VAR_STAT | 静态变量 |
|    VAR_IN_OUT    |       输入输出变量        |
| VAR\_变量A 变量B | 组合变量:不冲突可任意组合 |

</center>

变量定义:

```
VAR_Global CONSTANT
    PI : REAL := 3.1415926
END_VAR
```

#### 常见变量类型

<center>|数据类型|

| 变量类型 |     类型名称      | 变量类型 |      类型名称      |
| :------: | :---------------: | :------: | :----------------: |
|   BOOL   |       布尔        |   WORD   |     字型(16位)     |
|  DWORD   |    双字(32位)     |   INT    |     整型(16位)     |
|   DINT   |   双整型(32位)    |   REAL   |     实型(32位)     |
|  USINT   | 无符号短整型(8位) |  UDINT   | 无符号双整型(32位) |
|   UINT   | 无符号整型(16位)  |   LINT   |    长整型(64位)    |
|   BYTE   |     字节(8位)     |   SINT   |    短整型(8位)     |
|  LWORD   |    长字(64位)     |          |                    |

</center>

<center>

|字符串类型|
|变量类型|类型名称|变量类型|类型名称|
|:---:|:---:|:---:|:---:|
|CHAR|字符型|WCHAR|宽字符型|
|STRING|字符串|WSTRING|宽字符串型|

</center>

<center>

|常见转义字符|
|转义字符|意义|转义字符|意义|
|:---:|:---:|:---:|:---:|
|$$|美元|$ R|回车符|
|$ L|换行符|$ T|制表符|
|$ N|新行符|$ P|换页符|

</center>

#### 时间数据类型

<center>

|时间标识符|

| 标识符 | 含义 | 标识符 | 含义 |
| :----: | :--: | :----: | :--: |
|   ms   | 毫秒 |   s    |  秒  |
|   m    |  分  |   h    |  时  |
|   d    |  天  |

</center>

<center>

|时间数据类型表|

|  含义  |   类型名称   |  语法结构   |          存储空间          |
| :----: | :----------: | :---------: | :------------------------: |
| 时间型 |     TIME     |  T#1h1m1s   |       32位（时基ms）       |
| 时刻型 | TIME_OF_DATE |  TOD#1:1:1  |  32位（表示一天中某时刻）  |
| 日期型 |     DATE     | DT#2025-1-1 | 32位（表示日期后可加时刻） |

</center>

#### 扩展数据类型

##### 数组

```
VAR
    ARR1 : ARRAY[0..9] OF REAL;                 //一维数组
    ARR2 : ARRAY[0..9, 2..5] OF INT;            //二维数组
    ARR3 : ARRAY[0..9, 2..5, 3..8] OF WORD      //三维数组
END_VAR
```

##### 指针

###### Pointer(6字节)

<center> Pointer存储区代码编号 </center>

<center>

| 存储区代码（16#） | 存储区 |        说明        |
| :---------------: | :----: | :----------------: |
|      B#16#1       |   PI   |  S7-1500 外设输入  |
|      B#16#2       |   PQ   |  S7-1500 外设输出  |
|      B#16#81      |   I    |   过程输入映像区   |
|      B#16#82      |   Q    |   过程输出映像区   |
|      B#16#83      |   M    |      位存储区      |
|      B#16#84      |   DB   |     全局数据块     |
|      B#16#85      |   DI   |     背景数据块     |
|      B#16#86      |   L    |   局部数据存储区   |
|      B#16#87      |   V    | 先前局部数据存储区 |

</center>

```

```

#### 自定义数据类型

##### 结构体 (STRUCT)

```
TYPE 类型名 :
    STRUCT
    属性变量 : 类型
    END_STRUCT
END_TYPE
```

#### 数据类型转换

1. 隐式转换 (PLC内部自动执行)
2. 显式转换 (使用*TO*关键字组合两类型的方法实现)

```
VAR
    DATA1 : INT := -12;
    DATA2 : WORD := 65524;
END_VAR

DATA2 := INT_TO_WORD(DATA1)
```

### 流程控制

#### 条件选择

条件

```
IF 条件 THEN
    分支;
ELSIF 条件1 THEN
    分支1;
ELSE
    分支2;
END_IF;
```

选择

```
CACE 变量 OF
    变量值1：分支1;
    变量值2：分支2;
END_CACE;
```

#### 循环

FOR

```
FOR 循环变量 := init_V TO end_V BY 步长 DO
    循环内容;
END_FOR;
```

WHILE

```
WHILE 语句 DO
    循环内容；
END_WHILE;
```

REPEAT

```
REPEAT
    循环内容;
UNTIL 条件
END_REAPEAT;
```

#### 退出和继续流程块

```
EXIT     退出
CONTINUE 继续
```

### ST基础指令

#### 边沿指令

<center>

|                 指令原型                  |  含义  |                 指令原型                  |  含义  |
| :---------------------------------------: | :----: | :---------------------------------------: | :----: |
| "R_TRIG_DB"(CLK:= bool_in, Q=> bool_out); | 上升沿 | "F_TRIG_DB"(CLK:= bool_in, Q=> bool_out); | 下降沿 |

</center><br>

#### 定时器指令

<center>

|                                指令原型                                |         含义         |
| :--------------------------------------------------------------------: | :------------------: |
|        TP(IN:=bool_in, PT:=time_in, Q=>bool_out, ET=>time_out);        |      脉冲定时器      |
|       TON(IN:=bool_in, PT:=time_in, Q=>bool_out, ET=>time_out);        |    延时接通定时器    |
|       TOF(IN:=bool_in, PT:=time_in, Q=>bool_out, ET=>time_out);        |    延时断开定时器    |
| TONR(IN:=bool_in, R:=bool_in, PT:=time_in, Q=>bool_out, ET=>time_out); | 保持型延时接通定时器 |
|                       RESET_TIMER(ICE_TIMER_IN);                       |      复位定时器      |
|            PRESET_TIMER(PT:=time_in, TIMER:=ICE_TIMER_IN);             |   定时器预设值设置   |

</center><br>

#### 计数器指令

<center>

|                                               指令原型                                                |   含义   |
| :---------------------------------------------------------------------------------------------------: | :------: |
|                      CTU(CU:=bool_in, R:=bool_in, PV:=in, Q=>bool_out, CV=>out);                      |  加计数  |
|                     CTD(CD:=bool_in, LD:=bool_in, PV:=in, Q=>bool_out, CV=>out);                      |  减计数  |
| CTUD(CU:=bool_in, CD:=bool_in, R:=bool_in, LD:=bool_in, PV:=in, QU=>bool_out, QD=>bool_out, CV=>out); | 加减计数 |

</center>

#### 数学指令

<center>

| 指令原型 |  含义  | 指令原型 |  含义  |
| :------: | :----: | :------: | :----: |
|  SIN()   |  正弦  |  COS()   |  余弦  |
|  SQR()   |  平方  |  MAX()   | 最大值 |
|  MIN()   | 最小值 |

</center>

#### 读写存储器指令

<center>

|                                                                           指令原型                                                                            |      含义      |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------: |
|                                                  PEEK(area:=byte_in, dbNumber:=dint_in, byteOffset:=dint_in)                                                  |  存储器读指令  |
|                                      PEEK_BOOL(area:=byte_in, dbNumber:=dint_in, byteOffset:=dint_in, bitOffset:=int_in)                                      | 存储器位读指令 |
|                                          POKE(area:=byte_in, dbNumber:=dint_in, byteOffset:=dint_in, value:=byte_in)                                          |  存储器写指令  |
|                              POKE_BOOL(area:=byte_in, dbNumber:=dint_in, byteOffset:=dint_in, bitOffset:=int_in, value:=bool_in)                              | 存储器位写指令 |
| POKE_BLK(area_src:=byte_in, dbNumber:=dint_in, byteOffset_src:=dint_in, area_dest:=byte_in, dbNumber_dest:=dint_in, byteOffset_dest:=dint_in, count:=dint_in) | 存储器块写指令 |

</center>
