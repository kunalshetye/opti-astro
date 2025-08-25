interface Validator {
    type: string;
    errorMessage?: string;
    regularExpression?: string;
}

//// VALIDATORS
// Sample of validators JSON structure:
// [{
// 	{"type":"requirevalidator","errorMessage":"This field is required."},
// 	{"type":"emailvalidator","errorMessage":"Enter a valid email address."},
// 	{"type":"numbervalidator","errorMessage":"Invalid number."},
// 	{"type":"regularexpressionvalidator","errorMessage":"This field should be in \\"{0}\\" format.","regularExpression":"s"}
// }]

export function requiredValidatorMsg(validators?: any): string | undefined {
    const requiredValidator = Array.isArray(validators)
        ? validators.find((item: Validator) => item.type === 'requirevalidator')
        : undefined;

    if (requiredValidator) {
        return requiredValidator?.errorMessage;
    }
    return undefined;
}

export function emailValidatorMsg(validators?: any): string | undefined {
    const emailValidator = Array.isArray(validators)
        ? validators.find((item: Validator) => item.type === 'emailvalidator')
        : undefined;

    if (emailValidator) {
        return emailValidator?.errorMessage;
    }
    return undefined;
}

export function numberValidatorMsg(validators?: any): string | undefined {
    const numberValidator = Array.isArray(validators)
        ? validators.find((item: Validator) => item.type === 'numbervalidator')
        : undefined;

    if (numberValidator) {
        return numberValidator?.errorMessage;
    }
    return undefined;
}

export function regExpValidatorMsg(validators?: any): string | undefined {
    const regExpValidator = Array.isArray(validators)
        ? validators.find(
              (item: Validator) => item.type === 'regularexpressionvalidator'
          )
        : undefined;

    if (regExpValidator) {
        return regExpValidator?.errorMessage;
    }
    return undefined;
}

export function getRegularExpression(validators?: any): string | undefined {
    const regExpValidator = Array.isArray(validators)
        ? validators.find(
              (item: Validator) => item.type === 'regularexpressionvalidator'
          )
        : undefined;
        
    if (regExpValidator) {
        return regExpValidator?.regularExpression;
    }
    return undefined;
}
