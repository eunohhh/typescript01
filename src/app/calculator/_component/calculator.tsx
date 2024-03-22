"use client"
import styles from '@/app/calculator/page.module.css'
import React, { MouseEventHandler, useEffect, useState } from 'react'

const btnCon = {
    padTop : [ 'C', '+-', '%'],
    rightCol : [ '÷', 'x', '-', '+', '='],
    numPad: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '.', '0']
}

const fourBasic : Record<string, Function> = {
    '+': function(a : number[]) : number{
        return a.reduce(function(acc, curr){
            return acc + curr
        });
    },
    '-': function(a : number[]) : number{
        return a.reduce(function(acc, curr){
            return acc - curr;
        });
    },
    '*': function(a : number[]) : number {
        console.log(a)
        return a.reduce(function(acc, curr){
            return acc * curr;
        })
    },
    '/': function(a : number[]) : number{
        return a.reduce(function(acc, curr){
            return acc / curr;
        });
    }
};

export default function CalcComp(){

    const [ currNum, setCurrNum ] = useState<number>(0);
    const [ readyNum, setReadyNum ] = useState<number | null>(null);
    const [ currDisplay, setCurrDisplay ] = useState<string>( String(currNum) );
    const [ currOper, setCurrOper ] = useState<string | null>(null);
    const [ selected, setSelected ] = useState<boolean>(false);

    const handleClick = (event : React.MouseEvent<HTMLButtonElement> ) : void  => {
        if(event.currentTarget){
            const role = event.currentTarget.dataset.role;
            const val = event.currentTarget.value;
            console.log(event.currentTarget.value)

            if(role === 'num'){
                if(currOper !== null){
                    console.log('사칙연산모드 o');
                    if(currDisplay.includes('.')){
                        const tempNum = Number(val);
                        const tempVal = currDisplay + String(tempNum);
                        setCurrDisplay(tempVal);
                        setReadyNum(Number(tempVal));
                    }else if(val === '.'){
                        const tempVal = currDisplay + '.'
                        setCurrDisplay(tempVal);
                        setReadyNum(Number(tempVal));
                    }
                    else{
                        setCurrDisplay(String(val));
                        setReadyNum(Number(val));
                    }
                }else{
                    console.log('사칙연산모드 x')
                    if(currDisplay.includes('.')){
                        const tempNum = Number(val);
                        const tempVal = currDisplay + String(tempNum);
                        setCurrDisplay(tempVal);
                    }else if(val === '.'){
                        const tempVal = currDisplay + '.'
                        setCurrDisplay(tempVal);
                    }else{
                        setCurrNum(Number(val));
                    }
                }
            }
            if(role === 'top'){
                if(val === 'C') {
                    setCurrNum(0);
                    setReadyNum(0);
                }
                if(val === '%') setCurrNum(currNum / 100);
                if(val === '+-') {
                    if(Math.sign(currNum) === 1){
                        setCurrNum(currNum * -1);
                    }else{
                        setCurrNum(Math.abs(currNum));
                    }
                }
            }
            if(role === 'right'){
                if(selected){ 
                    setSelected(false); 
                }else if(val === '+' && !selected) {
                    setCurrOper('+');
                    setSelected(true);
                }else if(val === '-') {
                    setCurrOper('-');
                    setSelected(true);
                }else if(val === 'x') {
                    setCurrOper('*');
                    setSelected(true);
                }else if(val === '÷') {
                    setCurrOper('/');
                    setSelected(true);
                }
                if(val === '=' && currOper){
                    const result : number = fourBasic[currOper]([currNum, readyNum]);
                    console.log(result)
                    setCurrNum(result);
                    setCurrOper(null);
                    setReadyNum(0);
                    setSelected(false);
                }
            }
        }
    }

    useEffect(() => {
        if(currNum % 1 !== 0){
            setCurrDisplay(String(currNum.toFixed(5)))
        }else{
            setCurrDisplay(String(currNum))
        }
    }, [currNum])

    return(
        <div className={`${styles.wrapper}`}>
            <div className={`${styles.numDisplay}`}>
                <p>{currDisplay}</p>
            </div>

            <div className={styles.pads}>
                <div className={`${styles.leftCol} ${styles.flexCenter}`}>
                    <div className={`${styles.padTop}`}>
                        {btnCon.padTop.map((e, i) => (
                            <div key={i} className={styles.flexCenter}>
                                <button data-role={'top'} className={`${styles.btn} ${styles.grey}`} value={e} onClick={handleClick}>{e}</button>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.numPad}`}>
                        {btnCon.numPad.map((e, i) => (
                            <div key={i} className={styles.flexCenter}>
                                <button data-role={'num'} className={`${styles.btn} ${styles.darkgrey}`} value={e} onClick={handleClick}>{e}</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`${styles.rightCol}`}>
                    {btnCon.rightCol.map((e, i) => (
                        <div key={i} className={styles.flexCenter}>
                            <button 
                                data-role={'right'} 
                                className={`${styles.btn} ${styles.orange}`} 
                                style={{ filter : currOper === e && currOper !== '=' ? 'contrast(2)' : '' }}
                                value={e} 
                                onClick={handleClick}
                            >{e}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}