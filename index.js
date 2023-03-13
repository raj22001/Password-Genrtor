const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBTN = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercase = document.querySelector("#Uppercase");
const lowercase = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Number");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".GenerateButton");
const allChecksBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={}[]\|;:/?<>,.';

let password = "";
let passwordlength = 10;
let checkcount = 0; 
setIndicator("#ccc");

handleslider();
//set password length
function handleslider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerHTML = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =((passwordlength-min)*100/(max-min)) + "100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//genrate random number or char
function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function genraterandomNumber() {
    return getRndInteger(0,9);
}

function genrateLowerCase() {
    return  String.fromCharCode(getRndInteger(97 , 123));
}

function genrateUpperCase() {
    return  String.fromCharCode(getRndInteger(65 , 91));
}

function generateSymbol(){
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8){
        setIndicator('#0f0')
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
    ){
        setIndicator('#ff8')
    }
    else{
        setIndicator('#f00')
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    for(let i =array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i +1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) =>{
        str += el
    });
    return str;
}

function hadleCheckBoxChange() {
    checkcount =0;
    allChecksBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkcount++;
        }
    });

    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider();
    }
}

allChecksBox.forEach((checkbox) =>{
    checkbox.addEventListener('change' , hadleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
    passwordlength = e.target.value;
    handleslider();
})

copyBTN.addEventListener('click',() =>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () =>{
    if(checkcount <= 0){
        return;
    }

    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider();
    }

    password="";

    //let's put the stuff mentioned by checkbox
/*
    if(uppercase.checked){
        password +=genrateUpperCase();
    }
    if(lowercase.checked){
        password +=genrateLowerCase();
    }

    if(numbersCheck.checked){
        password +=genraterandomNumber();
    }

    if(symbolsCheck.checked){
        password +=generateSymbol();
    }
*/
    let funcArr=[];

    if(uppercase.checked){
        funcArr.push(genrateUpperCase)
    }

    if(lowercase.checked){
        funcArr.push(genrateLowerCase)
    }

    if(numbersCheck.checked){
        funcArr.push(genraterandomNumber)
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol)
    }

    for(let i =0; i<funcArr.length; i++){
        password +=funcArr[i]();
    }

    for(let i=0; i<passwordlength - funcArr.length; i++){
        let randIndex = getRndInteger(0  , funcArr.length);
        password +=funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    calcStrength();
});