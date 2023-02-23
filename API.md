# Plugin API document

### 1. 添加顶部按钮

```typescript
type ToolbarPosition = 'left' | 'right';

/**
 * addToolbarItem 添加顶部按钮
 * @param toolbarItem ToolbarItem 顶部工具栏物件
 * @param position ToolbarPosition 摆放位置，默认左侧
 * @return void
 */
function addToolbarItem(toolbarItem: ToolbarItem, position?: ToolbarPosition): void
```

### 2. 添加dock按钮

```typescript
type DockPosition = 'left' | 'right' | 'top' | 'bottom';
/**
 * addDockItem 添加dock栏按钮
 * @param dockItem DockItem 按钮的主要实现对象
 * @param position DockPosition 摆放位置
 */
function addDockItem(dockItem: DockItem, position: DockPosition): void
```

### 3. 添加状态栏物件

```typescript
type StatusPosition = 'left' | 'right';
/**
 * addStatusItem 添加状态栏物件，例如按钮、文字、图标、进度条等
 * @param item StatusItem，状态栏物件对象
 * @param position StatusPosition, 状态栏摆放位置
 */
function addStatusItem(item: StatusItem, position: StatusPosition): void
```

### 4. 创建菜单

```typescript
interface MenuItem {
    setTitle(title: string): void;
    setIcon(icon: string): void;
    setDisabled(disabled: boolean): void;
    addMenu(menuItem: MenuItem): void;
    onClick(event: MouseEvent): void;
}
interface Menu {
    addItem(callback: (item: MenuItem) = > void);
    showOnEvent(event: Event);
    showOnPosition(position: { x: number, y: number });
    hide(): void;
}
```

5. 创建模态框
6. 创建提示框
7. 注册命令快捷键
8. 监听事件总线
