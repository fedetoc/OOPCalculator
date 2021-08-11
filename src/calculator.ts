type Html = HTMLButtonElement | HTMLDivElement | HTMLInputElement;
class Calculator {
	private calculator = document.querySelector(".calculator")! as HTMLDivElement;
	private display = document.querySelector(
		".calculator__result"
	)! as HTMLInputElement;
	private btnOperands = document.querySelector(
		".calcForm__buttons"
	)! as HTMLDivElement;
	private ecuations: Ecuation[] = [];
	private inputs: HTMLInputElement[];
	private currEcuation: Ecuation | null = null;
	private _operandClicked: boolean = false;

	protected constructor() {
		this.inputs = Array.from(document.querySelectorAll(".calcForm__input"));
	}

	static initialize() {
		const calculatorInstance = new Calculator();
		calculatorInstance.__init__();
	}

	__init__() {
		this.calculator.addEventListener("click", this.handleCalcClick.bind(this));
		this.btnOperands.addEventListener("click", this.handleFormClick.bind(this));
	}

	handleFormClick(event: Event): void {
		event.preventDefault();
		const clicked = event.target! as Html;
		if (
			!this.clickedIsValid(clicked) ||
			!this.inputs.every(el => el.value !== "")
		)
			return;
		this.displayNumber("", true);
		const numArr: Array<number | string> = this.inputs.map(el => +el.value);
		const val: string = clicked.textContent!;
		val && numArr.push(val, "=");
		this.manageObjectForm(numArr);
	}

	handleCalcClick(event: Event): void {
		const clicked = event.target! as Html;
		if (!this.clickedIsValid(clicked)) return;
		const value: string = clicked.textContent!;
		const lastOpClicked = this.operandClicked;
		this.operandClicked = +value;
		if (!this.operandClicked) this.displayNumber(value, lastOpClicked);
		else {
			const displayVal: number = +this.display.value;
			if (this.isRepeatedOperand(value, lastOpClicked)) return;
			this.createEcuationObj(displayVal, value);
		}
	}

	clickedIsValid(elclicked: Html): boolean {
		return elclicked.classList.contains("btn") ? true : false;
	}

	isRepeatedOperand(
		this: Calculator,
		op: string,
		lastOp: boolean = false
	): boolean {
		if (op !== "=" && this.currEcuation && lastOp) {
			this.currEcuation.replaceLastOp(op);
			return true;
		} else return false;
	}

	displayNumber(num: string | number, lastOp: boolean): void {
		if (this.display.value === "0" || lastOp) this.display.value = "";
		this.display.value += num;
	}

	manageCalculation(value: number, op: string): void {
		this.currEcuation!.setValueAndOperand(value, op);
		if (op === "=") {
			this.saveInstanceData();
			this.currEcuation = null;
		}
		0;
	}

	manageObjectForm(arr: Array<number | string>): void {
		this.operandClicked = "=";

		typeof arr[0] === "number" &&
			typeof arr[2] === "string" &&
			this.createEcuationObj(arr[0], arr[2]);
		typeof arr[1] === "number" &&
			typeof arr[3] === "string" &&
			this.createEcuationObj(arr[1], arr[3]);
	}

	saveInstanceData(): void {
		this.ecuations.push(this.currEcuation!);
	}

	createEcuationObj(value: number, op: string): void {
		if (op === "=" && !this.currEcuation) return;
		if (!this.currEcuation) this.currEcuation = new Ecuation(value, op);
		else this.manageCalculation(value, op);
	}

	set operandClicked(value: number | string) {
		this._operandClicked = !Number.isFinite(value);
	}

	get operandClicked(): any {
		return this._operandClicked;
	}
}

class Ecuation extends Calculator {
	private calculationMap: any = new Map([
		["+", (num1: number, num2: number): number => num1 + num2],
		["-", (num1: number, num2: number): number => num1 - num2],
		["*", (num1: number, num2: number): number => num1 * num2],
		["/", (num1: number, num2: number): number => num1 / num2],
	]);
	private numArr: [number];
	private op: [string];

	private result: number | null = null;

	constructor(num1: number, operand: string) {
		super();
		this.numArr = [num1];
		this.op = [operand];
	}

	calculate(this: Ecuation, acc: number, curr: number, i: number): number {
		if (i === 0) return curr;
		return this.calculationMap.get(this.op[i - 1])(acc, curr);
	}

	performCalculation(): void {
		this.result = this.numArr.reduce(this.calculate.bind(this));
		this.displayNumber(this.result, true);
	}

	setValueAndOperand(value: number, op: string): void {
		this.numArr.push(value);
		if (op !== "=") this.op.push(op);
		else this.performCalculation();
	}

	replaceLastOp(op: string) {
		this.op.pop();
		this.op.push(op);
	}
}

Calculator.initialize();
