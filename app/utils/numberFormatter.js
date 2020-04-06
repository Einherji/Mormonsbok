export const NumberFormatter = (number) => {
    if(String(number).length = 1){
        return "0" + number;
    }
    return String(number);
}