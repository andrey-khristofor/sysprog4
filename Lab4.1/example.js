function parseDates(obj) {
    if (!obj) return null;
    // new Date('work item 275760') === "+275759-12-31T22:00:00.000Z"
    const digitsAtEndValidator = (str) => {
        let strValid = true;
        let currentPosition = -1;
        while (currentPosition * -1 <= 7) {
            const currentSubstr = str.slice(currentPosition);
            if (JSON.stringify(new Date(currentSubstr)) !== "null") {
                strValid = false;
            } else {
                if (currentPosition * -1 > 6) {
                    strValid = true;
                }
            }
            currentPosition--;
        }
        return strValid;
    };
    function dateWithoutTime(date) {
        const formatPatterns = [];
        let matchFound = false;
        formatPatterns.forEach((formatPattern) => {
            const match = date.match(formatPattern);
            if (match) {
                matchFound = true;
            }
        });
        return matchFound;
    }
    for (let [key, value] of Object.entries(obj)) {
        if (value) {
            if (
                typeof value === "string" &&
                value.length > 7 &&
                JSON.stringify(new Date(value)) !== "null" &&
                digitsAtEndValidator(value) &&
                !dateWithoutTime(value)
            ) {
                obj[key] = iml.parseDate(iml.formatDate(value, "YYYY-MM-DD HH:mm:ss"));
            } else if (Array.isArray(value)) {
                obj[key] = value.map((item) => iml.parseDates(item));
            } else if (typeof value === "object") {
                obj[key] = iml.parseDates(value);
            }
        }
    }
    return obj;
}