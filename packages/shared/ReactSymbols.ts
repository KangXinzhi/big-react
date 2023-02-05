const supportSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ElEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
