import { getExpiryDate, getInputDate, getRemainingDays, getStartDate } from "@/lib/functions";

const today = getInputDate();
const days = 1;

const startDate = getStartDate(today);
const expiryDate = getExpiryDate({ dateString: today, days });
const remainingDays = getRemainingDays(expiryDate);

console.log(startDate);
console.log(expiryDate);
console.log(remainingDays);
