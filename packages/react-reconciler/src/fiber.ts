import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;

	memoizedProps: Props | null;
	// 双缓存，如果是workInProgress则alternate指向current，反之，如果是current则alternate指向workInProgress
	alternate: FiberNode | null;

	// 对应保存的标记（插入（placement），删除（Deletion），移动......）
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		// HostComponent <div> div DOM
		this.stateNode = null;
		// FunctionComponent ()=> {}
		this.type = null;

		// 构成树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		//<ul>li*3</ul> li的index分别为 1 2 3
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		// 工作单元刚开始工作时的props
		this.pendingProps = pendingProps;
		// 确定下的props
		this.memoizedProps = null;
		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
	}
}
