"use strict";
class Calculator {
    constructor() {
        this.calculator = document.querySelector(".calculator");
        this.display = document.querySelector(".calculator__result");
        this.btnOperands = document.querySelector(".calcForm__buttons");
        this.ecuations = [];
        this.currEcuation = null;
        this._operandClicked = false;
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
    handleFormClick(event) {
        event.preventDefault();
        const clicked = event.target;
        if (!this.clickedIsValid(clicked) ||
            !this.inputs.every(el => el.value !== ""))
            return;
        this.displayNumber("", true);
        const numArr = this.inputs.map(el => +el.value);
        const val = clicked.textContent;
        val && numArr.push(val, "=");
        this.manageObjectForm(numArr);
    }
    handleCalcClick(event) {
        const clicked = event.target;
        if (!this.clickedIsValid(clicked))
            return;
        const value = clicked.textContent;
        const lastOpClicked = this.operandClicked;
        this.operandClicked = +value;
        if (!this.operandClicked)
            this.displayNumber(value, lastOpClicked);
        else {
            const displayVal = +this.display.value;
            if (this.isRepeatedOperand(value, lastOpClicked))
                return;
            this.createEcuationObj(displayVal, value);
        }
    }
    clickedIsValid(elclicked) {
        return elclicked.classList.contains("btn") ? true : false;
    }
    isRepeatedOperand(op, lastOp = false) {
        if (op !== "=" && this.currEcuation && lastOp) {
            this.currEcuation.replaceLastOp(op);
            return true;
        }
        else
            return false;
    }
    displayNumber(num, lastOp) {
        if (this.display.value === "0" || lastOp)
            this.display.value = "";
        this.display.value += num;
    }
    manageCalculation(value, op) {
        this.currEcuation.setValueAndOperand(value, op);
        if (op === "=") {
            this.saveInstanceData();
            this.currEcuation = null;
        }
        0;
    }
    manageObjectForm(arr) {
        this.operandClicked = "=";
        typeof arr[0] === "number" &&
            typeof arr[2] === "string" &&
            this.createEcuationObj(arr[0], arr[2]);
        typeof arr[1] === "number" &&
            typeof arr[3] === "string" &&
            this.createEcuationObj(arr[1], arr[3]);
    }
    saveInstanceData() {
        this.ecuations.push(this.currEcuation);
    }
    createEcuationObj(value, op) {
        if (op === "=" && !this.currEcuation)
            return;
        if (!this.currEcuation)
            this.currEcuation = new Ecuation(value, op);
        else
            this.manageCalculation(value, op);
    }
    set operandClicked(value) {
        this._operandClicked = !Number.isFinite(value);
    }
    get operandClicked() {
        return this._operandClicked;
    }
}
class Ecuation extends Calculator {
    constructor(num1, operand) {
        super();
        this.calculationMap = new Map([
            ["+", (num1, num2) => num1 + num2],
            ["-", (num1, num2) => num1 - num2],
            ["*", (num1, num2) => num1 * num2],
            ["/", (num1, num2) => num1 / num2],
        ]);
        this.result = null;
        this.numArr = [num1];
        this.op = [operand];
    }
    calculate(acc, curr, i) {
        if (i === 0)
            return curr;
        return this.calculationMap.get(this.op[i - 1])(acc, curr);
    }
    performCalculation() {
        this.result = this.numArr.reduce(this.calculate.bind(this));
        this.displayNumber(this.result, true);
    }
    setValueAndOperand(value, op) {
        this.numArr.push(value);
        if (op !== "=")
            this.op.push(op);
        else
            this.performCalculation();
    }
    replaceLastOp(op) {
        this.op.pop();
        this.op.push(op);
    }
}
Calculator.initialize();
//# sourceMappingURL=calculator.js.map